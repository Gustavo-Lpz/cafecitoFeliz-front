import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

import { ProductService } from '../../core/services/product/product.service';
import { CartService } from '../../core/services/cart/cart.service';
import { SearchService } from '../../core/services/search/search.service.ts';

import { Product } from '../../shared/product.model';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-products',
  imports: [CommonModule, RouterLink],
  templateUrl: './products.html',
})
export class Products implements OnInit, OnDestroy {

  products: Product[] = [];
  allProducts: Product[] = [];

  cartCount = 0;

  private subs = new Subscription();

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private searchService: SearchService,
    private cdr: ChangeDetectorRef // 👈 agregado
  ) {}

  ngOnInit(): void {

    // ✅ CARGA INICIAL DE PRODUCTOS (independiente)
    this.subs.add(
      this.productService.getProducts().subscribe(products => {
        this.allProducts = products;
        this.products = products;
        this.cdr.detectChanges(); // 👈 fuerza render inmediato
      })
    );

    // ✅ FILTRO DE BÚSQUEDA (solo filtra)
    this.subs.add(
      this.searchService.searchTerm$.subscribe(term => {
        const value = (term || '').toLowerCase();

        this.products = this.allProducts.filter(p =>
          p.name.toLowerCase().includes(value) ||
          p.description?.toLowerCase().includes(value)
        );
      })
    );

    // ✅ contador carrito
    this.subs.add(
      this.cartService.cart$.subscribe(items => {
        this.cartCount = items.reduce(
          (total, item) => total + item.quantity,
          0
        );
      })
    );
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
