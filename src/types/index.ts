
export interface User {
  _id: string;
  name: string;
  email: string;
  password?: string;
  profilePicture?: string;
  bio?: string;
  points: number;
  createdAt: string;
  updatedAt: string;
}

export interface PartialUser {
  _id: string;
  name: string;
}

export interface Material {
  _id: string;
  title: string;
  description: string;
  category: 'Previous Year Papers' | 'Handwritten Notes' | 'Books' | 'Short Notes' | 'Handbooks';
  year: '1st Year' | '2nd Year' | '3rd Year' | '4th Year';
  fileUrl: string;
  fileName: string;
  uploadedBy: User | PartialUser | string;
  upvotes: number;
  downvotes: number;
  voted: string[];
  reports: Report[];
  createdAt: string;
  updatedAt: string;
}

export interface Report {
  _id: string;
  materialId: string;
  reportedBy: string;
  reason: string;
  status: 'pending' | 'reviewed' | 'resolved';
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface MaterialsState {
  materials: Material[];
  filteredMaterials: Material[];
  isLoading: boolean;
  error: string | null;
}

// MongoDB connection config interface
export interface MongoConfig {
  uri: string;
  dbName: string;
  collections: {
    users: string;
    materials: string;
    reports: string;
  };
}
