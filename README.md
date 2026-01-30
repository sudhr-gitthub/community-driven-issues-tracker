# Community Driven Issues Tracker 🏙️

A robust civic engagement platform enabling citizens to report local issues (like potholes, garbage, broken streetlights) with location tagging and AI-powered verification.

![CivicTracker Banner](https://via.placeholder.com/1200x300?text=Community+Driven+Issues+Tracker)

## 🌟 Key Features

- **📍 Geo-Tagging:** Pinpoint exact issue locations using an interactive map (Google Maps integration).
- **🤖 AI Verification:** Automatically detects if uploaded images/videos are real civic issues or fake/spam using **Google Gemini AI**.
- **🔐 Secure Authentication:** User accounts via Email, Username, or Phone Number with secure JWT, enabling issue ownership and management.
- **📸 Media Uploads:** Users can upload images and videos as evidence.
- **📊 Status Tracking:** Track the progress of reported issues (Reported, In Progress, Resolved).
- **📱 Responsive Design:** Built with React and Tailwind CSS for a seamless mobile and desktop experience.

## 🛠️ Tech Stack

### Frontend

- **React (Vite):** Fast, modern UI.
- **Tailwind CSS:** Responsive styling.
- **@react-google-maps/api:** Maps integration.
- **Axios:** API communication.

### Backend

- **Node.js & Express:** Scalable REST API.
- **Prisma ORM:** Database management.
- **PostgreSQL:** Relational database with **PostGIS** for location data.
- **Google Gemini API:** AI content analysis.
- **Supabase:** File storage (for evidence).

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- PostgreSQL (with PostGIS extension enabled)
- Google Maps API Key
- Google Gemini API Key
- Supabase Account (for bucket storage)

### 1. Clone the Repository

```bash
git clone https://github.com/sudhr-gitthub/community-driven-issues-tracker.git
cd community-driven-issues-tracker
```

### 2. Backend Setup

Navigate to the backend folder and install dependencies:

```bash
cd backend
npm install
```

Create a `.env` file in `backend/` and configure:

```env
PORT=3000
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?schema=public"
JWT_SECRET="your_super_secret_key"
GEMINI_API_KEY="your_google_gemini_key"
SUPABASE_URL="your_supabase_url"
SUPABASE_SERVICE_KEY="your_supabase_service_role_key"
```

Initialize the database:

```bash
npx prisma generate
npx prisma db push
```

Start the server:

```bash
npm run dev
```

### 3. Frontend Setup

Open a new terminal, navigate to the frontend folder:

```bash
cd frontend
npm install
```

Create a `.env` file in `frontend/` and configure:

```env
VITE_GOOGLE_MAPS_API_KEY="your_google_maps_api_key"
```

Start the application:

```bash
npm run dev
```

Visit `http://localhost:5173` to browse the app!

## 🧪 Deployment

### Frontend (GitHub Pages)

The frontend can be deployed to GitHub Pages (static hosting).

- Ensure `vite.config.ts` has the correct `base` path.
- Run `npm run deploy` from the `frontend` directory.

### Backend (Render/Railway)

The backend must be deployed to a Node.js hosting service like Render, Railway, or Heroku.

- Add your environment variables to the hosting dashboard.
- Ensure the database URL is accessible from the cloud.

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## 📄 License

This project is licensed under the MIT License.
