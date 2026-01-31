import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Update if backend runs on a different port
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to attach the JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('civic_token'); // Fix: consistent token name
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const getHealth = async () => {
  const response = await api.get('/health');
  return response.data;
};

export const getIssues = async () => {
  const response = await api.get('/issues');
  return response.data;
};

export const getIssueById = async (id) => {
  const response = await api.get(`/issues/${id}`);
  return response.data;
};

export const getUserIssues = async (userId) => {
  const response = await api.get(`/users/${userId}/issues`);
  return response.data;
};

export const updateIssueStatus = async (id, status) => {
  const response = await api.patch(`/issues/${id}/status`, { status });
  return response.data;
};

export const createIssue = async (data) => {
  const response = await api.post('/issues', data);
  return response.data;
};

export const updateIssue = async (id, data) => {
  const response = await api.put(`/issues/${id}`, data);
  return response.data;
};

export const deleteIssue = async (id) => {
  const response = await api.delete(`/issues/${id}`);
  return response.data;
};

export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data; // { url: string, type: string }
};

export const registerUser = async (data) => {
  const response = await api.post('/auth/register', data);
  return response.data;
};

export const loginUser = async (data) => {
  const response = await api.post('/auth/login', data);
  return response.data;
};

export default api;
