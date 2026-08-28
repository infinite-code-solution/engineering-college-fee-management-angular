// src/app/core/services/base-http.service.ts
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// Define standard types matching Angular's internal option payloads exactly
export interface HttpOptions {
  params?: HttpParams | { [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean> };
  headers?: HttpHeaders | { [header: string]: string | string[] };
  // Enforcing 'json' explicitly tells TypeScript to expect the data payload type T
  responseType?: 'json'; 
  context?: any;
}

@Injectable({
  providedIn: 'root',
})
export class BaseHttpService {
  protected http = inject(HttpClient);

  /**
   * Common GET Request
   */
  get<T>(url: string, options?: HttpOptions): Observable<T> {
    // Providing 'responseType: "json"' explicitly matches the correct method overload
    return this.http.get<T>(url, { responseType: 'json', ...options });
  }

  /**
   * Common POST Request
   */
  post<T>(url: string, body: any | null, options?: HttpOptions): Observable<T> {
    return this.http.post<T>(url, body, { responseType: 'json', ...options });
  }

  /**
   * Common PUT Request
   */
  put<T>(url: string, body: any | null, options?: HttpOptions): Observable<T> {
    return this.http.put<T>(url, body, { responseType: 'json', ...options });
  }

  /**
   * Common PATCH Request
   */
  patch<T>(url: string, body: any | null, options?: HttpOptions): Observable<T> {
    return this.http.patch<T>(url, body, { responseType: 'json', ...options });
  }

  /**
   * Common DELETE Request
   */
  delete<T>(url: string, options?: HttpOptions): Observable<T> {
    return this.http.delete<T>(url, { responseType: 'json', ...options });
  }
}
