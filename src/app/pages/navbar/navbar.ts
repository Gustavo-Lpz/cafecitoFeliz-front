import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

import { CartService } from '../../core/services/cart/cart.service';
import { SearchService } from '../../core/services/search/search.service.ts';
import { AuthService } from '../../core/services/auth/auth.service';

@Component({
  standalone: true,
  selector: 'app-navbar',
  imports: [CommonModule, RouterModule, FormsModule, RouterLink],
  templateUrl: './navbar.html',
})
export class Navbar implements OnInit, OnDestroy {

  user: any = null;
  isAdmin = false;
  searchTerm = '';
  cartCount = 0;

  private sub = new Subscription();

  constructor(
    private cartService: CartService,
    private searchService: SearchService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  // ====================================
  ngOnInit(): void {

    // 👤 usuario
    this.sub.add(
      this.authService.user$.subscribe(user => {
        this.user = user;
        this.isAdmin = user?.role === 'admin';
      })
    );

    // 🛒 contador carrito (🔥 FIX NG0100)
    this.sub.add(
      this.cartService.cart$.subscribe(items => {

        this.cartCount = items.reduce(
          (total, item) => total + item.quantity,
          0
        );

        // mover al siguiente ciclo
        setTimeout(() => this.cdr.detectChanges());
      })
    );
  }

  // ====================================
  search() {
    this.searchService.setSearch(this.searchTerm);
  }

  logout() {
    this.authService.logout();
  }

  // ====================================
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
