import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class SaleService {

  private api = 'http://localhost:3001/api/sales';

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) {}

  // 🔥 USER (protegida con JWT)
  createSale(data: any) {

    const token = this.auth.getToken();

    // 👉 SOLO agregar header si existe token
    const options = token
      ? {
          headers: new HttpHeaders({
            Authorization: `Bearer ${token}`
          })
        }
      : {};

    return this.http.post(`${this.api}`, data, options);
  }

  // 🔥 GUEST (sin token)
  createGuestSale(data: any) {
    return this.http.post(`${this.api}/guest`, data);
  }
}
