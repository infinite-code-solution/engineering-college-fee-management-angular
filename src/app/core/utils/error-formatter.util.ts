// src/app/core/utils/error-formatter.util.ts
import { HttpErrorResponse } from '@angular/common/http';
import { ApiError } from '../models/api-error.model';

export function formatApiError(error: HttpErrorResponse): ApiError {
  const timestamp = new Date().toISOString();

  // Scenario A: Client-side network failures or CORS bugs
  if (error.error instanceof ErrorEvent) {
    return {
      status: 0,
      statusText: 'Network Error',
      message: error.error.message || 'Please check your internet connection.',
      timestamp
    };
  }

  // Scenario B: Backend returned a structured JSON error
  if (error.error && typeof error.error === 'object') {
    return {
      status: error.status,
      statusText: error.statusText,
      message: error.error.message || getDefaultMessage(error.status),
      code: error.error.code,
      errors: error.error.errors, // Form validator validation maps
      timestamp: error.error.timestamp || timestamp
    };
  }

  // Scenario C: Generic or HTML fallback server crashes (e.g., 502 Bad Gateway)
  return {
    status: error.status,
    statusText: error.statusText,
    message: getDefaultMessage(error.status),
    timestamp
  };
}

function getDefaultMessage(status: number): string {
  switch (status) {
    case 400: return 'The requested action is invalid.';
    case 401: return 'Your session expired. Please log in again.';
    case 403: return 'You do not have access permissions for this data.';
    case 404: return 'The requested resource was not found.';
    case 500: return 'Internal server exception occurred. Please try later.';
    default: return 'An unexpected system error occurred.';
  }
}
