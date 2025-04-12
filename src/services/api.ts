
import axios from 'axios';
import { toast } from 'sonner';
import { User, Material, PartialUser, MongoConfig, Report } from '@/types';
import { MongoClient, ObjectId } from 'mongodb';

// Base API configuration
const API_URL = 'https://api.scholar-share.com/api';

// MongoDB configuration
const mongoConfig: MongoConfig = {
  uri: 'mongodb+srv://username:password@cluster0.mongodb.net/scholar_share?retryWrites=true&w=majority',
  dbName: 'scholar_share',
  collections: {
    users: 'users',
    materials: 'materials',
    reports: 'reports'
  }
};

// MongoDB client instance
let mongoClient: MongoClient | null = null;

// Connect to MongoDB
const connectToMongo = async (): Promise<MongoClient> => {
  if (mongoClient) return mongoClient;
  
  try {
    mongoClient = new MongoClient(mongoConfig.uri);
    await mongoClient.connect();
    console.log('Connected to MongoDB successfully');
    return mongoClient;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    toast.error('Failed to connect to database');
    throw error;
  }
};

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
    try {
      const client = await connectToMongo();
      const db = client.db(mongoConfig.dbName);
      const usersCollection = db.collection(mongoConfig.collections.users);
      
      // Check if user already exists
      const existingUser = await usersCollection.findOne({ email: userData.email });
      if (existingUser) {
        throw new Error('User already exists');
      }
      
      // Create new user
      const newUser = {
        ...userData,
        profilePicture: '',
        bio: '',
        points: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const result = await usersCollection.insertOne(newUser);
      const createdUser = {
        _id: result.insertedId.toString(),
        ...newUser
      };
      
      // Generate token (in real app, use JWT or similar)
      const token = 'mongo-token-' + Date.now();
      
      return { user: createdUser as User, token };
    } catch (error) {
      console.error('Registration error:', error);
      throw { response: { data: { message: error instanceof Error ? error.message : 'Registration failed' } } };
    }
  },
  
  login: async (credentials: { email: string; password: string }) => {
    try {
      const client = await connectToMongo();
      const db = client.db(mongoConfig.dbName);
      const usersCollection = db.collection(mongoConfig.collections.users);
      
      // Find user by email
      const user = await usersCollection.findOne({ email: credentials.email });
      if (!user) {
        throw new Error('User not found');
      }
      
      // Check password (in real app, use bcrypt or similar)
      if (user.password !== credentials.password) {
        throw new Error('Invalid password');
      }
      
      // Convert MongoDB _id to string
      const userObj = {
        ...user,
        _id: user._id.toString()
      };
      
      // Remove password from user object
      const { password, ...userWithoutPassword } = userObj;
      
      // Generate token
      const token = 'mongo-token-' + Date.now();
      
      return { user: userWithoutPassword as User, token };
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
      const client = await connectToMongo();
      const db = client.db(mongoConfig.dbName);
      const usersCollection = db.collection(mongoConfig.collections.users);
      
      // Create update object
      const updateData: any = {
        updatedAt: new Date().toISOString()
      };
      
      if (userData.name) updateData.name = userData.name;
      if (userData.bio) updateData.bio = userData.bio;
      
      // TODO: Handle profile picture upload to a real storage service
      // For now, we'll skip this since we don't have a storage solution set up
      
      // Update user in MongoDB
      await usersCollection.updateOne(
        { _id: new ObjectId(userId) },
        { $set: updateData }
      );
      
      // Get updated user
      const updatedUser = await usersCollection.findOne({ _id: new ObjectId(userId) });
      if (!updatedUser) {
        throw new Error('User not found after update');
      }
      
      // Convert MongoDB _id to string
      return {
        ...updatedUser,
        _id: updatedUser._id.toString()
      } as User;
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
      const client = await connectToMongo();
      const db = client.db(mongoConfig.dbName);
      const materialsCollection = db.collection(mongoConfig.collections.materials);
      
      // Get all materials
      const materials = await materialsCollection.find().toArray();
      
      // Convert MongoDB _id to string and populate partial user info
      const formattedMaterials = await Promise.all(materials.map(async (material) => {
        let uploadedBy: PartialUser | string = material.uploadedBy;
        
        // If uploadedBy is a string (user ID), get user info
        if (typeof material.uploadedBy === 'string') {
          try {
            const usersCollection = db.collection(mongoConfig.collections.users);
            const user = await usersCollection.findOne({ _id: new ObjectId(material.uploadedBy) });
            if (user) {
              uploadedBy = {
                _id: user._id.toString(),
                name: user.name
              };
            }
          } catch (err) {
            console.error('Error getting user info:', err);
          }
        } else if (material.uploadedBy && typeof material.uploadedBy === 'object' && material.uploadedBy._id) {
          // If uploadedBy is already an object but _id is ObjectId, convert it
          uploadedBy = {
            _id: material.uploadedBy._id.toString(),
            name: material.uploadedBy.name
          };
        }
        
        return {
          ...material,
          _id: material._id.toString(),
          uploadedBy,
          reports: material.reports || [],
          voted: material.voted || []
        } as unknown as Material;
      }));
      
      return formattedMaterials;
    } catch (error) {
      console.error('Get all materials error:', error);
      throw error;
    }
  },
  
  getById: async (id: string) => {
    try {
      const client = await connectToMongo();
      const db = client.db(mongoConfig.dbName);
      const materialsCollection = db.collection(mongoConfig.collections.materials);
      
      // Find material by ID
      const material = await materialsCollection.findOne({ _id: new ObjectId(id) });
      if (!material) {
        throw new Error('Material not found');
      }
      
      // Similar to getAll, handle the uploadedBy field
      let uploadedBy: PartialUser | string = material.uploadedBy;
      
      if (typeof material.uploadedBy === 'string') {
        try {
          const usersCollection = db.collection(mongoConfig.collections.users);
          const user = await usersCollection.findOne({ _id: new ObjectId(material.uploadedBy) });
          if (user) {
            uploadedBy = {
              _id: user._id.toString(),
              name: user.name
            };
          }
        } catch (err) {
          console.error('Error getting user info:', err);
        }
      } else if (material.uploadedBy && typeof material.uploadedBy === 'object' && material.uploadedBy._id) {
        uploadedBy = {
          _id: material.uploadedBy._id.toString(),
          name: material.uploadedBy.name
        };
      }
      
      return {
        ...material,
        _id: material._id.toString(),
        uploadedBy,
        reports: material.reports || [],
        voted: material.voted || []
      } as unknown as Material;
    } catch (error) {
      console.error('Get material by id error:', error);
      throw error;
    }
  },
  
  getUserMaterials: async (userId: string) => {
    try {
      const client = await connectToMongo();
      const db = client.db(mongoConfig.dbName);
      const materialsCollection = db.collection(mongoConfig.collections.materials);
      
      // Find materials by user ID
      const materials = await materialsCollection.find({
        $or: [
          { "uploadedBy": userId },
          { "uploadedBy._id": userId }
        ]
      }).toArray();
      
      // Format materials
      const formattedMaterials = materials.map(material => ({
        ...material,
        _id: material._id.toString(),
        reports: material.reports || [],
        voted: material.voted || []
      })) as unknown as Material[];
      
      return formattedMaterials;
    } catch (error) {
      console.error('Get user materials error:', error);
      throw error;
    }
  },
  
  create: async (materialData: FormData) => {
    try {
      const client = await connectToMongo();
      const db = client.db(mongoConfig.dbName);
      const materialsCollection = db.collection(mongoConfig.collections.materials);
      
      // Get file from FormData
      const file = materialData.get('file') as File;
      
      // Create a unique filename
      const fileExtension = file.name.split('.').pop();
      const uniqueFileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExtension}`;
      
      // TODO: In a real app, upload the file to a storage service
      // For now, we'll create blob URL for demo purposes
      const fileUrl = URL.createObjectURL(file);
      
      // Get user info from localStorage
      const userJson = localStorage.getItem('user');
      const user = userJson ? JSON.parse(userJson) : { _id: 'unknown-user', name: 'Unknown User' };
      
      const category = materialData.get('category') as Material['category'] || 'Handbooks';
      const year = materialData.get('year') as Material['year'] || '1st Year';
      
      // Create new material document
      const newMaterial = {
        title: materialData.get('title') as string,
        description: materialData.get('description') as string,
        category,
        year,
        fileUrl,
        fileName: file.name,
        uploadedBy: {
          _id: user._id,
          name: user.name
        },
        upvotes: 0,
        downvotes: 0,
        voted: [],
        reports: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Insert into MongoDB
      const result = await materialsCollection.insertOne(newMaterial);
      
      return {
        ...newMaterial,
        _id: result.insertedId.toString()
      } as unknown as Material;
    } catch (error) {
      console.error('Create material error:', error);
      throw error;
    }
  },
  
  update: async (id: string, materialData: FormData) => {
    try {
      const client = await connectToMongo();
      const db = client.db(mongoConfig.dbName);
      const materialsCollection = db.collection(mongoConfig.collections.materials);
      
      // Find existing material
      const existingMaterial = await materialsCollection.findOne({ _id: new ObjectId(id) });
      if (!existingMaterial) {
        throw new Error('Material not found');
      }
      
      // Prepare update data
      const updateData: any = {
        updatedAt: new Date().toISOString()
      };
      
      // Update fields if provided
      if (materialData.get('title')) updateData.title = materialData.get('title');
      if (materialData.get('description')) updateData.description = materialData.get('description');
      if (materialData.get('category')) updateData.category = materialData.get('category');
      if (materialData.get('year')) updateData.year = materialData.get('year');
      
      // Handle file upload if provided
      const file = materialData.get('file') as File | null;
      if (file) {
        // TODO: In a real app, upload to storage service and update URL
        updateData.fileUrl = URL.createObjectURL(file);
        updateData.fileName = file.name;
      }
      
      // Update in MongoDB
      await materialsCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
      );
      
      // Get updated material
      const updatedMaterial = await materialsCollection.findOne({ _id: new ObjectId(id) });
      if (!updatedMaterial) {
        throw new Error('Material not found after update');
      }
      
      // Format response
      return {
        ...updatedMaterial,
        _id: updatedMaterial._id.toString(),
        reports: updatedMaterial.reports || [],
        voted: updatedMaterial.voted || []
      } as unknown as Material;
    } catch (error) {
      console.error('Update material error:', error);
      throw error;
    }
  },
  
  delete: async (id: string) => {
    try {
      const client = await connectToMongo();
      const db = client.db(mongoConfig.dbName);
      const materialsCollection = db.collection(mongoConfig.collections.materials);
      
      // Find material before deletion
      const material = await materialsCollection.findOne({ _id: new ObjectId(id) });
      if (!material) {
        throw new Error('Material not found');
      }
      
      // Delete from MongoDB
      await materialsCollection.deleteOne({ _id: new ObjectId(id) });
      
      // Format response
      return {
        ...material,
        _id: material._id.toString()
      } as unknown as Material;
    } catch (error) {
      console.error('Delete material error:', error);
      throw error;
    }
  },
  
  vote: async (id: string, voteType: 'upvote' | 'downvote') => {
    try {
      const client = await connectToMongo();
      const db = client.db(mongoConfig.dbName);
      const materialsCollection = db.collection(mongoConfig.collections.materials);
      
      // Get user ID from localStorage
      const userJson = localStorage.getItem('user');
      const user = userJson ? JSON.parse(userJson) : { _id: 'unknown-user' };
      
      // Find material
      const material = await materialsCollection.findOne({ _id: new ObjectId(id) });
      if (!material) {
        throw new Error('Material not found');
      }
      
      // Check if user already voted
      const voted = material.voted || [];
      if (voted.includes(user._id)) {
        throw new Error('You have already voted on this material');
      }
      
      // Update vote count
      const updateData: any = {
        voted: [...voted, user._id]
      };
      
      if (voteType === 'upvote') {
        updateData.upvotes = (material.upvotes || 0) + 1;
      } else {
        updateData.downvotes = (material.downvotes || 0) + 1;
      }
      
      // Update in MongoDB
      await materialsCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
      );
      
      // Get updated material
      const updatedMaterial = await materialsCollection.findOne({ _id: new ObjectId(id) });
      if (!updatedMaterial) {
        throw new Error('Material not found after update');
      }
      
      // Format response
      return {
        ...updatedMaterial,
        _id: updatedMaterial._id.toString(),
        reports: updatedMaterial.reports || [],
        voted: updatedMaterial.voted || []
      } as unknown as Material;
    } catch (error) {
      console.error('Vote material error:', error);
      throw error;
    }
  },
  
  report: async (id: string, reason: string) => {
    try {
      const client = await connectToMongo();
      const db = client.db(mongoConfig.dbName);
      const materialsCollection = db.collection(mongoConfig.collections.materials);
      const reportsCollection = db.collection(mongoConfig.collections.reports);
      
      // Get user ID from localStorage
      const userJson = localStorage.getItem('user');
      const user = userJson ? JSON.parse(userJson) : { _id: 'unknown-user' };
      
      // Create report
      const report = {
        materialId: id,
        reportedBy: user._id,
        reason,
        status: 'pending' as const,
        createdAt: new Date().toISOString()
      };
      
      // Insert report
      const result = await reportsCollection.insertOne(report);
      
      // Update material with report reference
      await materialsCollection.updateOne(
        { _id: new ObjectId(id) },
        { 
          $push: { 
            reports: {
              _id: result.insertedId.toString(),
              ...report
            } 
          } 
        }
      );
      
      return { success: true, message: 'Material reported successfully' };
    } catch (error) {
      console.error('Report material error:', error);
      throw error;
    }
  }
};

export default api;
