import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { randomUUID } from 'node:crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { authenticateToken } from './middleware/authMiddleware.js';
import { createClient } from '@supabase/supabase-js';
import multer from 'multer';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'secret-key';
const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function createBucket() {
  const { data, error } = await supabase.storage.getBucket('evidence');
  if (error) {
    console.log('Bucket evidence not found, creating...');
    const { error: createError } = await supabase.storage.createBucket('evidence', {
      public: true
    });
    if (createError) console.error('Error creating bucket:', createError);
    else console.log('Bucket evidence created successfully.');
  }
}
createBucket();

const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 * 1024 }, // 2GB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images and videos are allowed'));
    }
  }
});

const createIssueSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  category: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  images: z.array(z.string()).optional(),
});

async function getAnonymousUser() {
  const email = 'anonymous@civic.com';
  let user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    user = await prisma.user.create({
      data: { 
        email, 
        name: 'Anonymous Citizen', 
        role: 'USER',
        username: 'anonymous',
        phoneNumber: '0000000000'
      }
    });
  }
  return user;
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const sanitizedOriginalName = req.file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `${Date.now()}-${sanitizedOriginalName}`;
    
    const { data, error } = await supabase.storage
      .from('evidence')
      .upload(fileName, req.file.buffer, {
        contentType: req.file.mimetype
      });

    if (error) {
      throw error;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('evidence')
      .getPublicUrl(fileName);

    res.json({ url: publicUrl, type: req.file.mimetype });
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ error: 'File upload failed' });
  }
});

app.get('/api/issues', async (req, res) => {
  try {
    const issues = await prisma.issue.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(issues);
  } catch (error) {
    console.error('Fetch Error:', error);
    res.status(500).json({ error: 'Failed to fetch issues' });
  }
});

app.get('/api/issues/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const issue = await prisma.issue.findUnique({
      where: { id }
    });
    
    if (!issue) {
      return res.status(404).json({ error: 'Issue not found' });
    }
    
    res.json(issue);
  } catch (error) {
    console.error('Fetch Detail Error:', error);
    res.status(500).json({ error: 'Failed to fetch issue details' });
  }
});

app.get('/api/users/:userId/issues', async (req, res) => {
  try {
    const { userId } = req.params;
    const issues = await prisma.issue.findMany({
      where: { reportedBy: userId },
      orderBy: { createdAt: 'desc' }
    });
    res.json(issues);
  } catch (error) {
    console.error('Fetch User Issues Error:', error);
    res.status(500).json({ error: 'Failed to fetch user issues' });
  }
});

async function analyzeWithGemini(fileUrl, description = '') {
  if (!fileUrl) {
    return { status: 'UNCERTAIN', confidence: 0, analysis: 'No evidence provided for analysis.' };
  }

  try {
    const response = await fetch(fileUrl);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const mimeType = response.headers.get('content-type') || 'image/jpeg';

    const prompt = `
      Analyze this image or video of a reported civic issue (e.g., pothole, garbage, broken street light).
      Your task is to verify if this is a REAL civic issue or if it looks FAKE / AI-generated / Unrelated.
      
      User Description: "${description}"

      Return a single JSON object with these keys:
      - status: "REAL" | "FAKE" | "UNCERTAIN"
      - confidence: number between 0.0 and 1.0
      - analysis: A short explanation (max 1 sentence).
      
      JSON Only.
    `;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: buffer.toString('base64'),
          mimeType: mimeType
        }
      }
    ]);

    const responseText = result.response.text();
    const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanJson);

    return {
      status: parsed.status,
      confidence: parsed.confidence,
      analysis: parsed.analysis
    };

  } catch (error) {
    console.error('Gemini Analysis Error:', error);
    return {
      status: 'UNCERTAIN',
      confidence: 0,
      analysis: 'AI verification unavailable at this time.'
    };
  }
}

app.post('/api/issues', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const validation = createIssueSchema.safeParse(req.body);
    
    if (!validation.success) {
       return res.status(400).json({ error: validation.error.errors });
    }

    const data = validation.data;
    const id = randomUUID();

    const firstImage = data.images && data.images.length > 0 ? data.images[0] : undefined;
    const aiResult = await analyzeWithGemini(firstImage, data.description);

    const lng = Number(data.longitude);
    const lat = Number(data.latitude);
    const aiStat = String(aiResult.status);
    const aiConf = Number(aiResult.confidence);
    const aiAnal = String(aiResult.analysis);

    await prisma.$executeRaw`
      INSERT INTO "issues" (
        "id", "title", "description", "category", "status", 
        "reportedBy", "location", "images", "updatedAt", "createdAt",
        "aiStatus", "aiConfidence", "aiAnalysis"
      )
      VALUES (
        ${id}, ${data.title}, ${data.description || ''}, ${data.category}, 'REPORTED'::"Status", 
        ${userId}, ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326), 
        ${data.images || []}, NOW(), NOW(),
        ${aiStat}::"AiStatus", ${aiConf}, ${aiAnal}
      )
    `;

    res.status(201).json({ 
      id, ...data, 
      status: 'REPORTED', 
      reportedBy: userId,
      aiVerification: aiResult
    });
  } catch (error) {
    console.error('Submit Error:', error);
    res.status(500).json({ error: 'Failed to submit issue' });
  }
});

app.patch('/api/issues/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const validStatuses = ['REPORTED', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const updatedIssue = await prisma.issue.update({
      where: { id },
      data: { status }
    });
    
    res.json(updatedIssue);
  } catch (error) {
    console.error('Update Status Error:', error);
    res.status(500).json({ error: 'Failed to update status' });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name, username, phoneNumber } = req.body;
    
    if (!email || !password || password.length < 6 || !username) {
      return res.status(400).json({ error: 'Missing required fields or invalid password' });
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username },
          { phoneNumber: phoneNumber || undefined }
        ]
      }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User with this email, username, or phone already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || 'Citizen',
        username,
        phoneNumber,
        role: 'USER'
      }
    });

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, userId: user.id, name: user.name, role: user.role });
  } catch (error) {
    console.error('Register Error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { identifier, password } = req.body;
    
    if (!identifier || !password) {
       return res.status(400).json({ error: 'Missing credentials' });
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier },
          { username: identifier },
          { phoneNumber: identifier }
        ]
      }
    });

    if (!user || !user.password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, userId: user.id, name: user.name, role: user.role });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

app.delete('/api/issues/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const issue = await prisma.issue.findUnique({ where: { id } });
    if (!issue) return res.status(404).json({ error: 'Issue not found' });

    if (issue.reportedBy !== userId) {
      return res.status(403).json({ error: 'You can only delete your own issues' });
    }
    
    await prisma.issue.delete({ where: { id } });
    res.json({ success: true, message: 'Issue deleted' });
  } catch (error) {
    console.error('Delete Error:', error);
    res.status(500).json({ error: 'Failed to delete issue' });
  }
});

app.put('/api/issues/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category } = req.body;
    const userId = req.user?.userId;

    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const issue = await prisma.issue.findUnique({ where: { id } });
    if (!issue) return res.status(404).json({ error: 'Issue not found' });

    if (issue.reportedBy !== userId) {
      return res.status(403).json({ error: 'You can only edit your own issues' });
    }
    
    const updated = await prisma.issue.update({
      where: { id },
      data: { 
        title: String(title), 
        description: String(description), 
        category: String(category),
        updatedAt: new Date()
      }
    });

    res.json(updated);
  } catch (error) {
    console.error('Update Error:', error);
    res.status(500).json({ error: 'Failed to update issue' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
