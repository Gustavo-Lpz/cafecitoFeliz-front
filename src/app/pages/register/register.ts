import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth/auth.service';

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.html',
})
export class Register {
  displayName = '';
  email = '';
  password = '';
  phone = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  register() {
    this.authService.register({
      displayName: this.displayName,
      email: this.email,
      password: this.password,
      phone: this.phone,
    }).subscribe({
      next: () => this.router.navigate(['/login']),
    });
  }
}
