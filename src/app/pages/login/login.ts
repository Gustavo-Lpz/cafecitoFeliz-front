import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth/auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email = '';
  password = '';
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.authService.login({
      email: this.email,
      password: this.password,
    }).subscribe({
      next: (res) => {
        this.authService.setSession(res.user, res.token);
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.error = err.error.message || 'Login failed';
      },
    });
  }
}