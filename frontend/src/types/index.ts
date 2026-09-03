// TypeScript Interface Definitions for Orbitly Studio

// Project data structure
export interface Project {
  _id: string;
  title: string;
  slug: string;
  thumbnail: string;
  shortDescription: string;
  description: string;
  tags: string[];
  client?: string;
  year?: string;
  deliverables?: string[];
  challenge?: string;
  solution?: string;
  results?: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

// Blog Post data structure
export interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  thumbnail: string;
  excerpt: string;
  content: string;
  author: string;
  readTime: string;
  tags: string[];
  featured: boolean;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

// Client Project Inquiry submitted from website
export interface Inquiry {
  _id: string;
  name: string;
  email: string;
  service: string;
  budget: string;
  message: string;
  status: 'new' | 'contacted' | 'archived';
  createdAt: string;
  updatedAt: string;
}

// Admin User Profile
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

// Authentication response returned upon login
export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: AdminUser;
  };
}

// Generic API response structure
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  count?: number;
  data: T;
  errors?: Array<{ field: string; message: string }>;
}
