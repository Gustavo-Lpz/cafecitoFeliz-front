import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, combineLatest } from 'rxjs';

import { ProductService } from '../../core/services/product/product.service';
import { Product } from '../../shared/product.model';

@Component({
  standalone: true,
  selector: 'app-edit-products',
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-products.html',
})
export class EditProducts implements OnInit {

  products: Product[] = [];
  filteredProducts: Product[] = [];

  // 🔍 búsqueda reactiva
  private searchTerm$ = new BehaviorSubject<string>('');
  searchTerm = '';

  // modal
  selectedProduct: Product | null = null;

  showToast = false;
  toastMessage = '';

  constructor(
    private productService: ProductService,
    private cdr: ChangeDetectorRef
  ) {}

  // =========================
  // INIT
  // =========================
  ngOnInit(): void {

    combineLatest([
      this.productService.getProducts(),
      this.searchTerm$
    ]).subscribe(([products, term]) => {

      this.products = products;

      const value = (term || '').toLowerCase();

      this.filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(value)
      );

      // 🔥 fuerza refresco inmediato
      this.cdr.detectChanges();
    });
  }

  // =========================
  // búsqueda
  // =========================
  set search(value: string) {
    this.searchTerm$.next(value);
  }

  // =========================
  // trackBy
  // =========================
  trackById(index: number, product: Product) {
    return product._id;
  }

  // =========================
  // EDITAR
  // =========================
  edit(product: Product) {
    this.selectedProduct = { ...product };
  }

  // =========================
  // STOCK
  // =========================
  addStock(product: Product, amount: number) {
    this.productService.addStock(product._id!, amount)
      .subscribe(updated => {
        product.stock = updated.stock;
        this.toast(`Stock +${amount} agregado 📦`);
      });
  }

  // =========================
  // DELETE
  // =========================
  delete(id: string) {

    if (!confirm('¿Eliminar producto?')) return;

    this.productService.deleteProduct(id).subscribe(() => {
      this.toast('Producto eliminado 🗑');
      this.searchTerm$.next(this.searchTerm); // 🔥 refresca lista
    });
  }

  // =========================
  // TOAST
  // =========================
  private toast(message: string) {
    this.toastMessage = message;
    this.showToast = true;

    setTimeout(() => this.showToast = false, 2000);
  }
}
