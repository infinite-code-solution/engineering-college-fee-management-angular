// src/app/core/models/auth.model.ts

export interface LoginCredentials {
  email: string;
  password?: string; // Optional if using federated logins
}

export interface AuthResponse {
    token: string;
    role: string;
    user: string;
}
