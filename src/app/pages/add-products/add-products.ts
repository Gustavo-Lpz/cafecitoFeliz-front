import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ProductService } from '../../core/services/product/product.service';
import { Product } from '../../shared/product.model';

@Component({
  standalone: true,
  selector: 'app-add-products',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './add-products.html',
})
export class AddProducts {

  // 🔥 estado del toast
  showToast = false;

  product: Partial<Product> = {
    name: '',
    description: '',
    price: 0,
    image: '',
    available: true
  };

  constructor(
    private productService: ProductService,
    private router: Router
  ) {}

  create() {
    this.productService
      .createProduct(this.product as Product)
      .subscribe({
        next: () => {

          // ✅ mostrar toast
          this.showToast = true;

          // limpiar form
          this.product = {
            name: '',
            description: '',
            price: 0,
            image: '',
            available: true
          };

          // auto cerrar + navegar
          setTimeout(() => {
            this.showToast = false;
            this.router.navigate(['/admin/edit-products']);
          }, 1500);
        }
      });
  }
}
