import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SalesService {

  private apiUrl = 'http://localhost:3001/api/sales';

  constructor(private http: HttpClient) {}

  // 🔥 todas las ventas (admin)
  getAllSales(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // 🔥 resumen diario
  getDailySummary(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/summary/daily`);
  }
}
