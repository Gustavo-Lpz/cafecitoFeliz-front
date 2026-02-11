import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { CartService } from '../../core/services/cart/cart.service';
import { CartItem } from '../../shared/cart-item.models';
import { AuthService } from '../../core/services/auth/auth.service';
import { SaleService } from '../../core/services/sale/sale.service';

import { calculateDiscount } from '../../shared/discount.utils';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-checkout',
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.html',
})
export class Checkout implements OnInit, OnDestroy {

  cartItems: CartItem[] = [];

  paymentMethod = 'efectivo';

  // 🔥 totales
  subtotal = 0;
  discountPercent = 0;
  discountAmount = 0;
  totalConDescuento = 0;

  // ticket
  ticketItems: CartItem[] = [];
  ticketTotal = 0;
  ticketDate = new Date();

  showToast = false;
  showTicket = false;
  isProcessing = false;

  private sub!: Subscription;

  constructor(
    private cartService: CartService,
    private router: Router,
    private authService: AuthService,
    private saleService: SaleService,
    private cdr: ChangeDetectorRef
  ) {}

  // =================================================
  // INIT
  // =================================================
  ngOnInit(): void {
    this.sub = this.cartService.cart$.subscribe(items => {
      this.cartItems = items;
      this.calculateTotals();
    });
  }

  // =================================================
  // 🔥 CALCULAR TOTALES + DESCUENTO
  // =================================================
  calculateTotals() {

    this.subtotal = this.cartItems.reduce(
      (acc, item) => acc + item.subtotal,
      0
    );

    const purchasesCount =
      this.authService.getCurrentUser()?.purchasesCount ?? 0;

    this.discountPercent = calculateDiscount(purchasesCount);

    this.discountAmount =
      Number((this.subtotal * (this.discountPercent / 100)).toFixed(2));

    this.totalConDescuento =
      Number((this.subtotal - this.discountAmount).toFixed(2));
  }

  // =================================================
  // 🔥 PAY (ULTRA ESTABLE)
  // =================================================
 pay() {

  console.log('🔥 CLICK PAY');

  if (!this.cartItems.length || this.isProcessing) return;

  this.isProcessing = true;

  const items = this.cartItems.map(item => ({
    productId: item.product._id!,
    quantity: item.quantity
  }));

  const saleData = {
    items,
    paymentMethod: this.paymentMethod
  };

  const isLogged = !!this.authService.getCurrentUser();

  const request$ = isLogged
    ? this.saleService.createSale(saleData)
    : this.saleService.createGuestSale({
        ...saleData,
        guestInfo: {
          name: 'Venta mostrador',
          phone: '0000000000'
        }
      });

  request$.subscribe({

   next: (res: any) => {

  console.log('✅ Venta OK', res);

  this.ticketItems = [...this.cartItems];
  this.ticketTotal = res.sale.total;
  this.ticketDate = new Date();

  // 🔥 LIMPIAR AQUÍ (no al cerrar)
  this.cartService.clearCart();
  this.cartItems = [];

  this.isProcessing = false;
  this.showTicket = true;
  this.showToast = true;

  this.cdr.detectChanges();

  setTimeout(() => this.showToast = false, 2500);
},


    error: (err) => {
      console.error(err);
      this.isProcessing = false;
      alert('Error al procesar la venta ❌');
    }
  });
}

  // =================================================
  // CERRAR TICKET
  // =================================================
closeTicket() {
  this.cartService.clearCart(); // 👈 SOLO AQUÍ
  this.showTicket = false;
  this.router.navigate(['/']);
}


  // =================================================
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
