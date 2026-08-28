// src/app/core/constants/api-endpoints.ts

import { environment } from "../../../environments/environment";


const BASE_URL = environment.apiUrl;

export const API_ENDPOINTS = {
  auth: {
    login: `${BASE_URL}/login`,
    register: `${BASE_URL}/auth/register`,
    logout: `${BASE_URL}/auth/logout`,
  },
  users: {
    list: `${BASE_URL}/users`,
    profile: (id: string | number) => `${BASE_URL}/users/${id}`,
    update: (id: string | number) => `${BASE_URL}/users/${id}`,
  },
  products: {
    list: `${BASE_URL}/products`,
    details: (id: string | number) => `${BASE_URL}/products/${id}`,
  }
} as const; // 'as const' ensures the structure is read-only and strictly typed
