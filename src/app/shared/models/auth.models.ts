/**
 * Structured user data envelope returned upon successful authentication
 */
export interface UserProfile {
  uid: string;
  email: string;
  adminId: string;
  fullName: string;
  role: 'SUPER_ADMIN' | 'FINANCE_ADMIN' | 'ACADEMIC_ADMIN';
  assignedCampus: string;
}

/**
 * Global API response template wrapper to keep contract responses uniform
 */
export interface ApiResponse<T> {
  success: boolean;
  timestamp: string;
  data: T | null;
  error?: {
    code: string;
    message: string;
    details?: string[];
  };
}

/**
 * Authentication token schema envelope
 */
export interface AuthTokenSession {
  accessToken: string;
  expiresInSeconds: number;
  refreshToken: string;
  user: UserProfile;
}
