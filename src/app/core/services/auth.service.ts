// src/app/core/services/auth.service.ts
import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { BaseHttpService } from './base-http.service';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { LoginCredentials, AuthResponse } from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = inject(BaseHttpService);
  private router = inject(Router);
  
  // Use a blank string; our apiInterceptor appends the multi-tenant base URL
  private endpoints = API_ENDPOINTS;

  // Track the logged-in user profile status reactively via a Signal
  readonly currentUser = signal<AuthResponse['user'] | null>(null);
  readonly isAuthenticated = signal<boolean>(false);

  /**
   * Triggers the authentication payload down to the multi-tenant server
   */
  login(credentials: LoginCredentials): Observable<AuthResponse> {
    return this.api.post<AuthResponse>(this.endpoints.auth.login, credentials).pipe(
      tap((response: AuthResponse) => {
        // 1. Persist the session tokens securely in the browser
        localStorage.setItem('access_token', response.token);
        // localStorage.setItem('refresh_token', response.token); // Assuming the same token is used for refresh; adjust as needed

        // 2. Synchronize our reactive UI states (Instantly forces Zoneless updates)
        this.currentUser.set(response.user);
        this.isAuthenticated.set(true);
      })
    );
  }

  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    this.router.navigate(['/login']);
  }
}
