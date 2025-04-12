
import axios from 'axios';
import { toast } from 'sonner';
import { User, Material } from '@/types';

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

// Mock data
const mockUsers = [
  {
    _id: 'user1',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123', // This would be hashed in a real app
    profilePicture: '',
    bio: 'Computer Science student passionate about web development',
    points: 75,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const mockMaterials = [
  {
    _id: 'material1',
    title: 'Database Systems Notes',
    description: 'Comprehensive notes covering SQL, normalization, and transaction processing',
    category: 'Handwritten Notes',
    year: '3rd Year',
    fileUrl: 'https://loremflickr.com/640/480/document',
    fileName: 'database_systems_notes.pdf',
    uploadedBy: {
      _id: 'user1',
      name: 'John Doe'
    },
    upvotes: 42,
    downvotes: 5,
    voted: [],
    reports: [],
    createdAt: '2025-03-01T10:30:00Z',
    updatedAt: '2025-03-01T10:30:00Z'
  },
  {
    _id: 'material2',
    title: 'Data Structures Handbook',
    description: 'Complete guide to arrays, linked lists, trees, and graphs with examples',
    category: 'Handbooks',
    year: '2nd Year',
    fileUrl: 'https://loremflickr.com/640/480/document',
    fileName: 'data_structures_handbook.pdf',
    uploadedBy: {
      _id: 'user1',
      name: 'John Doe'
    },
    upvotes: 28,
    downvotes: 2,
    voted: [],
    reports: [],
    createdAt: '2025-02-15T14:20:00Z',
    updatedAt: '2025-02-15T14:20:00Z'
  },
  {
    _id: 'material3',
    title: 'Operating Systems Previous Year Papers',
    description: 'Last 5 years question papers with solutions',
    category: 'Previous Year Papers',
    year: '3rd Year',
    fileUrl: 'https://loremflickr.com/640/480/document',
    fileName: 'os_previous_papers.pdf',
    uploadedBy: {
      _id: 'user2',
      name: 'Jane Smith'
    },
    upvotes: 55,
    downvotes: 3,
    voted: [],
    reports: [],
    createdAt: '2025-01-20T09:15:00Z',
    updatedAt: '2025-01-20T09:15:00Z'
  }
];

// Auth services
export const authService = {
  register: async (userData: { name: string; email: string; password: string }) => {
    // In a real app, this would be an API call
    try {
      // Mock registration
      const existingUser = mockUsers.find(u => u.email === userData.email);
      if (existingUser) {
        throw new Error('User already exists');
      }

      const newUser = {
        _id: `user${mockUsers.length + 1}`,
        ...userData,
        profilePicture: '',
        bio: '',
        points: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      mockUsers.push(newUser);
      
      const token = 'mock-token-' + Date.now();
      
      return { user: newUser, token };
    } catch (error) {
      console.error('Registration error:', error);
      throw { response: { data: { message: error instanceof Error ? error.message : 'Registration failed' } } };
    }
  },
  
  login: async (credentials: { email: string; password: string }) => {
    // In a real app, this would be an API call
    try {
      // Mock login
      const user = mockUsers.find(u => u.email === credentials.email);
      if (!user) {
        throw new Error('User not found');
      }
      
      if (user.password !== credentials.password) {
        throw new Error('Invalid password');
      }
      
      const { password, ...userWithoutPassword } = user;
      const token = 'mock-token-' + Date.now();
      
      return { user: userWithoutPassword, token };
    } catch (error) {
      console.error('Login error:', error);
      throw { response: { data: { message: error instanceof Error ? error.message : 'Login failed' } } };
    }
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  
  updateProfile: async (userId: string, userData: { name?: string; bio?: string; profilePicture?: File }) => {
    try {
      // Mock update
      const userIndex = mockUsers.findIndex(u => u._id === userId);
      if (userIndex === -1) {
        throw new Error('User not found');
      }
      
      const updatedUser = {
        ...mockUsers[userIndex],
        ...(userData.name && { name: userData.name }),
        ...(userData.bio && { bio: userData.bio }),
        updatedAt: new Date().toISOString()
      };
      
      mockUsers[userIndex] = updatedUser;
      
      return updatedUser;
    } catch (error) {
      console.error('Update profile error:', error);
      throw { response: { data: { message: error instanceof Error ? error.message : 'Update profile failed' } } };
    }
  }
};

// Materials services
export const materialsService = {
  getAll: async (filters = {}) => {
    try {
      // In a real app, this would be filtered on the server
      console.log('Returning mock materials data');
      return mockMaterials;
    } catch (error) {
      console.error('Get all materials error:', error);
      throw error;
    }
  },
  
  getById: async (id: string) => {
    try {
      const material = mockMaterials.find(m => m._id === id);
      if (!material) {
        throw new Error('Material not found');
      }
      return material;
    } catch (error) {
      console.error('Get material by id error:', error);
      throw error;
    }
  },
  
  getUserMaterials: async (userId: string) => {
    try {
      return mockMaterials.filter(m => {
        if (typeof m.uploadedBy === 'object' && m.uploadedBy !== null) {
          return m.uploadedBy._id === userId;
        }
        return m.uploadedBy === userId;
      });
    } catch (error) {
      console.error('Get user materials error:', error);
      throw error;
    }
  },
  
  create: async (materialData: FormData) => {
    try {
      // Mock create
      const newMaterial = {
        _id: `material${mockMaterials.length + 1}`,
        title: materialData.get('title') as string,
        description: materialData.get('description') as string,
        category: materialData.get('category') as string,
        year: materialData.get('year') as string,
        fileUrl: 'https://loremflickr.com/640/480/document',
        fileName: 'new_material.pdf',
        uploadedBy: {
          _id: 'user1',
          name: 'John Doe'
        },
        upvotes: 0,
        downvotes: 0,
        voted: [],
        reports: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      mockMaterials.push(newMaterial);
      
      return newMaterial;
    } catch (error) {
      console.error('Create material error:', error);
      throw error;
    }
  },
  
  update: async (id: string, materialData: FormData) => {
    try {
      const materialIndex = mockMaterials.findIndex(m => m._id === id);
      if (materialIndex === -1) {
        throw new Error('Material not found');
      }
      
      const updatedMaterial = {
        ...mockMaterials[materialIndex],
        title: materialData.get('title') as string || mockMaterials[materialIndex].title,
        description: materialData.get('description') as string || mockMaterials[materialIndex].description,
        category: materialData.get('category') as string || mockMaterials[materialIndex].category,
        year: materialData.get('year') as string || mockMaterials[materialIndex].year,
        updatedAt: new Date().toISOString()
      };
      
      mockMaterials[materialIndex] = updatedMaterial;
      
      return updatedMaterial;
    } catch (error) {
      console.error('Update material error:', error);
      throw error;
    }
  },
  
  delete: async (id: string) => {
    try {
      const materialIndex = mockMaterials.findIndex(m => m._id === id);
      if (materialIndex === -1) {
        throw new Error('Material not found');
      }
      
      const deletedMaterial = mockMaterials[materialIndex];
      mockMaterials.splice(materialIndex, 1);
      
      return deletedMaterial;
    } catch (error) {
      console.error('Delete material error:', error);
      throw error;
    }
  },
  
  vote: async (id: string, voteType: 'upvote' | 'downvote') => {
    try {
      const materialIndex = mockMaterials.findIndex(m => m._id === id);
      if (materialIndex === -1) {
        throw new Error('Material not found');
      }
      
      const material = mockMaterials[materialIndex];
      
      const updatedMaterial = {
        ...material,
        upvotes: voteType === 'upvote' ? material.upvotes + 1 : material.upvotes,
        downvotes: voteType === 'downvote' ? material.downvotes + 1 : material.downvotes,
        voted: [...material.voted, 'current-user-id'],
        updatedAt: new Date().toISOString()
      };
      
      mockMaterials[materialIndex] = updatedMaterial;
      
      return updatedMaterial;
    } catch (error) {
      console.error('Vote material error:', error);
      throw error;
    }
  },
  
  report: async (id: string, reason: string) => {
    try {
      // Mock reporting
      console.log(`Material ${id} reported for reason: ${reason}`);
      return { success: true, message: 'Material reported successfully' };
    } catch (error) {
      console.error('Report material error:', error);
      throw error;
    }
  }
};

export default api;
