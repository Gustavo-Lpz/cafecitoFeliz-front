import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, tap } from 'rxjs';

export interface AuthUser {
  _id: string;
  displayName: string;
  email: string;
  role: 'admin' | 'customer';
  purchasesCount?: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private API = 'http://localhost:3001/api/auth';

  // 👤 estado reactivo del usuario
  private userSubject = new BehaviorSubject<AuthUser | null>(null);
  user$ = this.userSubject.asObservable();

  // ⭐ útil para navbar/guards
  isAdmin$ = this.user$.pipe(
    map(user => user?.role === 'admin')
  );

  constructor(private http: HttpClient) {

    // 🔁 restaurar sesión al recargar
    const user = localStorage.getItem('user');

    if (user) {
      this.userSubject.next(JSON.parse(user));
    }
  }

  // ======================
  // 🔐 AUTH API
  // ======================

  login(data: { email: string; password: string }) {
    return this.http.post<any>(`${this.API}/login`, data).pipe(
      tap(res => this.setSession(res.user, res.token)) // 🔥 guarda automático
    );
  }

  register(data: any) {
    return this.http.post(`${this.API}/register`, data);
  }

  // ======================
  // 🧠 SESSION
  // ======================

  setSession(user: AuthUser, token: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.userSubject.next(user);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.userSubject.next(null);
  }

  // ======================
  // 🧩 HELPERS (los que te faltaban)
  // ======================

  /** 👉 para checkout / descuentos */
  getCurrentUser(): AuthUser | null {
    return this.userSubject.value;
  }

  /** 👉 para interceptor */
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  /** 👉 saber si hay sesión */
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  /** 👉 rápido para guards */
  isAdmin(): boolean {
    return this.userSubject.value?.role === 'admin';
  }
}
