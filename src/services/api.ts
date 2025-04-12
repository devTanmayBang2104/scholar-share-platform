
import axios from 'axios';
import { toast } from 'sonner';

// Base API configuration
const API_URL = 'https://api.scholar-share.com/api'; // Replace with your actual API URL

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'Something went wrong';
    toast.error(message);
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  register: async (userData: { name: string; email: string; password: string }) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  
  login: async (credentials: { email: string; password: string }) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  
  updateProfile: async (userId: string, userData: { name?: string; bio?: string; profilePicture?: File }) => {
    const formData = new FormData();
    
    if (userData.name) formData.append('name', userData.name);
    if (userData.bio) formData.append('bio', userData.bio);
    if (userData.profilePicture) formData.append('profilePicture', userData.profilePicture);
    
    const response = await api.put(`/users/${userId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  }
};

// Materials services
export const materialsService = {
  getAll: async (filters = {}) => {
    const response = await api.get('/materials', { params: filters });
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await api.get(`/materials/${id}`);
    return response.data;
  },
  
  getUserMaterials: async (userId: string) => {
    const response = await api.get(`/users/${userId}/materials`);
    return response.data;
  },
  
  create: async (materialData: FormData) => {
    const response = await api.post('/materials', materialData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },
  
  update: async (id: string, materialData: FormData) => {
    const response = await api.put(`/materials/${id}`, materialData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },
  
  delete: async (id: string) => {
    const response = await api.delete(`/materials/${id}`);
    return response.data;
  },
  
  vote: async (id: string, voteType: 'upvote' | 'downvote') => {
    const response = await api.post(`/materials/${id}/vote`, { voteType });
    return response.data;
  },
  
  report: async (id: string, reason: string) => {
    const response = await api.post(`/materials/${id}/report`, { reason });
    return response.data;
  }
};

export default api;
