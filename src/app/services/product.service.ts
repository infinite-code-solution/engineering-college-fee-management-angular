import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductResponse } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  // Points directly to your local Laravel host
  private apiUrl = 'http://127.0.0'; 

  constructor(private http: HttpClient) {}

  getProducts(): Observable<ProductResponse> {
    const headers = new HttpHeaders({
      'Accept': 'application/json' // Enforces clean JSON tracking logs
    });
    return this.http.get<ProductResponse>(this.apiUrl, { headers });
  }
}
