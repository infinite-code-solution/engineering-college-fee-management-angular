import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FeeStructure, FeeSummary } from '../models/fee.model';

// Interface representing the exact outer structure of the Laravel response
export interface FeeApiResponse {
  success: boolean;
  summary: FeeSummary;
  data: FeeStructure[];
}

@Injectable({
  providedIn: 'root'
})
export class FeeService {
  // Points to your local XAMPP Laravel development server
  private apiUrl = 'http://localhost:8000/api/fees/ledger'; // Adjust the port if necessary

  constructor(private http: HttpClient) {}

  /**
   * Fetches the complete fee ledger along with aggregated financial summaries
   * @returns Observable matching the unified API payload
   */
  getFeeLedger(): Observable<FeeApiResponse> {
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    });

    return this.http.get<FeeApiResponse>(this.apiUrl, { headers });
  }
}
