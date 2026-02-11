import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../../../shared/cart-item.models';
import { Product } from '../../../shared/product.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {

  private items: CartItem[] = [];

  // 🔥 nunca pasar referencia directa
  private cartSubject = new BehaviorSubject<CartItem[]>([]);

  cart$ = this.cartSubject.asObservable();

  constructor() {
    this.loadFromStorage();
  }

  // =========================
  // ADD
  // =========================
  addToCart(product: Product) {

    const item = this.items.find(i => i.product._id === product._id);

    if (item) {
      item.quantity++;
    } else {
      this.items.push({
        product,
        quantity: 1,
        subtotal: product.price,
      });
    }

    this.recalculate();
  }

  // =========================
  // REMOVE
  // =========================
  removeFromCart(productId: string) {
    this.items = this.items.filter(i => i.product._id !== productId);
    this.recalculate();
  }

  // =========================
  // UPDATE
  // =========================
  updateQuantity(productId: string, quantity: number) {

    const item = this.items.find(i => i.product._id === productId);
    if (!item) return;

    item.quantity = quantity > 0 ? quantity : 1;

    this.recalculate();
  }

  // =========================
  // CLEAR
  // =========================
  clearCart() {
    this.items = [];
    this.save();
    this.cartSubject.next([]);
  }

  // =========================
  // TOTAL (dinámico)
  // =========================
  getTotal(): number {
    return this.items.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    );
  }

  // =========================
  // INTERNAL
  // =========================
  private recalculate() {

    this.items = this.items.map(i => ({
      ...i,
      subtotal: i.product.price * i.quantity
    }));

    this.save();
    this.cartSubject.next([...this.items]);
  }

  // =========================
  // STORAGE
  // =========================
  private save() {
    localStorage.setItem('cart', JSON.stringify(this.items));
  }

  private loadFromStorage() {
    const saved = localStorage.getItem('cart');
    if (saved) {
      this.items = JSON.parse(saved);
      this.cartSubject.next([...this.items]);
    }
  }
}
