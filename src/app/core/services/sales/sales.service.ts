import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SalesService {

  private apiUrl = `${environment.apiUrl}/sales`;

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
