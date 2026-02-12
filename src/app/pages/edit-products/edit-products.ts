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

  private searchTerm$ = new BehaviorSubject<string>('');
  searchTerm = '';

  selectedProduct: Product | null = null;

  showToast = false;
  toastMessage = '';

  constructor(
    private productService: ProductService,
    private cdr: ChangeDetectorRef
  ) {}

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

      this.cdr.detectChanges();
    });
  }

  set search(value: string) {
    this.searchTerm$.next(value);
  }

  trackById(index: number, product: Product) {
    return product._id;
  }

  edit(product: Product) {
    this.selectedProduct = { ...product };
  }

  // 🔥 NUEVO — GUARDAR CAMBIOS
save() {
  if (!this.selectedProduct) return;

  this.productService.updateProduct(
    this.selectedProduct._id!,
    this.selectedProduct
  ).subscribe(() => {

    this.toast('Producto actualizado ✨');

    this.selectedProduct = null;

    this.searchTerm$.next(this.searchTerm);
  });
}

  addStock(product: Product, amount: number) {
    this.productService.addStock(product._id!, amount)
      .subscribe(updated => {
        product.stock = updated.stock;
        this.toast(`Stock +${amount} agregado 📦`);
      });
  }

  delete(id: string) {

    if (!confirm('¿Eliminar producto?')) return;

    this.productService.deleteProduct(id).subscribe(() => {
      this.toast('Producto eliminado 🗑');
      this.searchTerm$.next(this.searchTerm);
    });
  }

  private toast(message: string) {
    this.toastMessage = message;
    this.showToast = true;

    setTimeout(() => this.showToast = false, 2000);
  }
}
