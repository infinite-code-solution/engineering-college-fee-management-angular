// src/app/core/models/api-error.model.ts

export interface ApiError {
  status: number;         // HTTP status code (e.g., 400, 401, 500)
  statusText: string;     // Friendly status name (e.g., "Bad Request")
  message: string;        // Human-readable summary error message
  code?: string;          // Specific domain error code (e.g., "INVALID_PASSWORD", "TENANT_SUSPENDED")
  errors?: Record<string, string[]>; // Field-validation errors (for forms mapping)
  timestamp: string;      // ISO string tracking when the error hit
}
