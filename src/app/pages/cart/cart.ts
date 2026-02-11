import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../core/services/cart/cart.service';
import { CartItem } from '../../shared/cart-item.models';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-cart',
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.html',
})
export class Cart {

  items: CartItem[] = [];
  total = 0;

  constructor(private cartService: CartService) {
    this.cartService.cart$.subscribe(items => {
      this.items = items;
      this.total = this.cartService.getTotal();
    });
  }

  remove(productId: string) {
    this.cartService.removeFromCart(productId);
  }

  update(item: CartItem, quantity: number) {
    this.cartService.updateQuantity(item.product._id!, quantity);
  }
}
