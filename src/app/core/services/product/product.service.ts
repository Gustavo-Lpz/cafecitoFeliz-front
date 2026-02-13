import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../../../shared/product.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {
        console.log('🌍 API URL usada:', this.apiUrl);
        console.log('🏷️ Production mode:', environment.production);
  }

  // =========================
  // 📥 GET ALL (público)
  // =========================
  getProducts(): Observable<Product[]> {
    // 🔥 SIN cache, SIN shareReplay
    // cada suscripción dispara el request correctamente
    return this.http.get<Product[]>(this.apiUrl);
  }

  // =========================
  // 📥 GET ONE (público)
  // =========================
  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  // =========================
  // ➕ CREATE (admin)
  // =========================
  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }

  // =========================
  // ✏️ UPDATE INFO (admin)
  // =========================
  updateProduct(id: string, product: Partial<Product>): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product);
  }

  // =========================
  // 📦 SET STOCK (exacto)
  // =========================
  updateStock(id: string, stock: number): Observable<Product> {
    return this.http.patch<Product>(
      `${this.apiUrl}/${id}/stock`,
      { stock }
    );
  }

  // =========================
  // ➕ ADD STOCK (+cantidad)
  // =========================
  addStock(id: string, amount: number): Observable<Product> {
    return this.http.patch<Product>(
      `${this.apiUrl}/${id}/stock/add`,
      { amount }
    );
  }

  // =========================
  // 🗑 DELETE (admin)
  // =========================
  deleteProduct(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
