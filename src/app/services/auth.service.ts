import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ApiResponse, AuthTokenSession } from '../shared/models/auth.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  /**
   * Process incoming system administrator credential payloads against mock datasets
   * @param payload Target login credential inputs extracted from the reactive form instance
   */
  login(payload: any): Observable<ApiResponse<AuthTokenSession>> {
    const { username, password } = payload;

    // Implementation criteria simulating backend server checks
    if (username === 'admin@tadipatri.edu.in' && password === 'Admin@123') {
      const mockSuccessResponse: ApiResponse<AuthTokenSession> = {
        success: true,
        timestamp: new Date().toISOString(),
        data: {
          accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mockTokenPayloadStringForTadipatriEngineeringCollegeSystem2026',
          expiresInSeconds: 3600,
          refreshToken: 'refresh_mock_token_77a1122bde9f',
          user: {
            uid: 'usr_998124',
            email: 'admin@tadipatri.edu.in',
            adminId: 'TEC-2026-ADM01',
            fullName: 'Principal Administration Office',
            role: 'SUPER_ADMIN',
            assignedCampus: 'Main Campus - Tadipatri'
          }
        }
      };
      
      // Delays pipeline propagation by 1.5 seconds to accurately reflect server roundtrip latencies
      return of(mockSuccessResponse).pipe(delay(1500));
    }

    // Explicit error metadata model matching the API specification boundary
    const mockErrorResponse: ApiResponse<AuthTokenSession> = {
      success: false,
      timestamp: new Date().toISOString(),
      data: null,
      error: {
        code: 'AUTH_INVALID_CREDENTIALS',
        message: 'The identity ID/email or credential passcode entered is incorrect.',
        details: ['Authentication matching sequence failed against active personnel directories.']
      }
    };

    return throwError(() => mockErrorResponse).pipe(delay(1200));
  }
}
