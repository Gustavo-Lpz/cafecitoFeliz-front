import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class SaleService {

  private api = 'http://localhost:3001/api/sales';

  constructor(private http: HttpClient) {}

  // 🔥 USER (protegida con JWT)
  createSale(data: any) {

    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.post(`${this.api}`, data, { headers });
  }

  // 🔥 GUEST (sin token)
  createGuestSale(data: any) {
    return this.http.post(`${this.api}/guest`, data);
  }
}
