import { Project, BlogPost, Inquiry, AuthResponse, ApiResponse, AdminUser, StudioSettings } from '../types';

export type { StudioSettings };

// Base API URL from environment variable with smart /api normalization
const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const cleanApiUrl = rawApiUrl.replace(/\/+$/, '');
const API_URL = cleanApiUrl.endsWith('/api') ? cleanApiUrl : `${cleanApiUrl}/api`;

// ==========================================
// Authentication Storage Helpers (localStorage)
// ==========================================
const TOKEN_KEY = 'orbitly_admin_token';
const USER_KEY = 'orbitly_admin_user';

export const getAdminToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
};

export const setAdminSession = (token: string, user: AdminUser): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getStoredAdminUser = (): AdminUser | null => {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem(USER_KEY);
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

export const clearAdminSession = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

// Generic fetch wrapper with automatic JWT header attachment & error parsing
async function fetchClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAdminToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  // Attach Bearer token if user is logged in
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    const errorMessage =
      data.message ||
      (data.errors && data.errors.map((e: any) => e.message).join(', ')) ||
      'An unexpected API error occurred.';
    throw new Error(errorMessage);
  }

  return data;
}

// ==========================================
// Auth API Services
// ==========================================
export const authApi = {
  // Login admin user and save token to localStorage
  login: async (credentials: { email: string; password: string }): Promise<AuthResponse> => {
    const res = await fetchClient<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    if (res.data?.token) {
      setAdminSession(res.data.token, res.data.user);
    }
    return res;
  },

  // Verify current session with backend
  getMe: async (): Promise<{ success: boolean; data: { user: AdminUser } }> => {
    return fetchClient('/auth/me');
  },

  logout: (): void => {
    clearAdminSession();
  },
};

// ==========================================
// Projects API Services
// ==========================================
export const projectsApi = {
  // Fetch projects (public only fetches published; admin can pass all=true)
  getAll: async (all: boolean = false): Promise<ApiResponse<Project[]>> => {
    const query = all ? '?all=true' : '';
    return fetchClient<ApiResponse<Project[]>>(`/projects${query}`, {
      cache: 'no-store',
    });
  },

  // Fetch single project by slug
  getBySlug: async (slug: string): Promise<ApiResponse<Project>> => {
    return fetchClient<ApiResponse<Project>>(`/projects/${slug}`, {
      cache: 'no-store',
    });
  },

  // Admin: Create new project
  create: async (payload: Partial<Project>): Promise<ApiResponse<Project>> => {
    return fetchClient<ApiResponse<Project>>('/projects', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  // Admin: Update existing project
  update: async (id: string, payload: Partial<Project>): Promise<ApiResponse<Project>> => {
    return fetchClient<ApiResponse<Project>>(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  // Admin: Delete project
  delete: async (id: string): Promise<ApiResponse<null>> => {
    return fetchClient<ApiResponse<null>>(`/projects/${id}`, {
      method: 'DELETE',
    });
  },
};

// ==========================================
// Blog API Services
// ==========================================
export const blogApi = {
  // Fetch blog posts (featured sorted first; draft filtering enforced on backend)
  getAll: async (all: boolean = false): Promise<ApiResponse<BlogPost[]>> => {
    const query = all ? '?all=true' : '';
    return fetchClient<ApiResponse<BlogPost[]>>(`/blog${query}`, {
      cache: 'no-store',
    });
  },

  // Fetch single blog post by slug
  getBySlug: async (slug: string): Promise<ApiResponse<BlogPost>> => {
    return fetchClient<ApiResponse<BlogPost>>(`/blog/${slug}`, {
      cache: 'no-store',
    });
  },

  // Admin: Create new blog post
  create: async (payload: Partial<BlogPost>): Promise<ApiResponse<BlogPost>> => {
    return fetchClient<ApiResponse<BlogPost>>('/blog', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  // Admin: Update existing blog post
  update: async (id: string, payload: Partial<BlogPost>): Promise<ApiResponse<BlogPost>> => {
    return fetchClient<ApiResponse<BlogPost>>(`/blog/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  // Admin: Delete blog post
  delete: async (id: string): Promise<ApiResponse<null>> => {
    return fetchClient<ApiResponse<null>>(`/blog/${id}`, {
      method: 'DELETE',
    });
  },
};

// ==========================================
// Inquiries (Customer Project Briefs) API Services
// ==========================================
export const inquiriesApi = {
  // Public: Customer submits project inquiry from website
  create: async (payload: {
    name: string;
    email: string;
    service: string;
    budget: string;
    message: string;
  }): Promise<ApiResponse<Inquiry>> => {
    return fetchClient<ApiResponse<Inquiry>>('/inquiries', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  // Admin: Retrieve all client project inquiries
  getAll: async (): Promise<ApiResponse<Inquiry[]>> => {
    return fetchClient<ApiResponse<Inquiry[]>>('/inquiries', {
      cache: 'no-store',
    });
  },

  // Admin: Update lead status
  updateStatus: async (
    id: string,
    status: 'new' | 'contacted' | 'archived'
  ): Promise<ApiResponse<Inquiry>> => {
    return fetchClient<ApiResponse<Inquiry>>(`/inquiries/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },

  // Admin: Delete lead
  delete: async (id: string): Promise<ApiResponse<null>> => {
    return fetchClient<ApiResponse<null>>(`/inquiries/${id}`, {
      method: 'DELETE',
    });
  },
};

// ==========================================
// Studio Settings API Services
// ==========================================
export const settingsApi = {
  // Public / Admin: Get studio contact settings
  get: async (): Promise<ApiResponse<StudioSettings>> => {
    return fetchClient<ApiResponse<StudioSettings>>('/settings', {
      cache: 'no-store',
    });
  },

  // Admin: Update studio contact settings
  update: async (payload: {
    studioEmail: string;
    location: string;
  }): Promise<ApiResponse<StudioSettings>> => {
    return fetchClient<ApiResponse<StudioSettings>>('/settings', {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },
};

// ==========================================
// Image Upload API Services (Multer -> Cloudinary)
// ==========================================
export interface UploadedImageData {
  url: string;
  publicId: string;
  fileName: string;
  size: number;
  mimeType: string;
}

export const uploadApi = {
  // Admin: Upload an image file (JPG, PNG, WebP <= 5MB)
  uploadImage: async (file: File): Promise<ApiResponse<UploadedImageData>> => {
    const token = getAdminToken();
    const formData = new FormData();
    formData.append('image', file);

    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}/upload`, {
      method: 'POST',
      headers,
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage =
        data.message ||
        (data.errors && data.errors.map((e: any) => e.message).join(', ')) ||
        'Failed to upload image.';
      throw new Error(errorMessage);
    }

    return data;
  },

  // Admin: Delete an image from Cloudinary
  deleteImage: async (publicId: string): Promise<ApiResponse<null>> => {
    return fetchClient<ApiResponse<null>>('/upload', {
      method: 'DELETE',
      body: JSON.stringify({ publicId }),
    });
  },
};

