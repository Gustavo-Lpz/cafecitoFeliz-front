import { Routes } from '@angular/router';

export const routes: Routes = [

  // 🏠 Home
  {
    path: '',
    loadComponent: () =>
      import('./pages/products/products').then(m => m.Products)
  },

  // 🛒 Carrito
  {
    path: 'cart',
    loadComponent: () =>
      import('./pages/cart/cart').then(m => m.Cart)
  },

  // 🔐 Auth
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login').then(m => m.Login)
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register').then(m => m.Register)
  },

  // 💳 Checkout
  {
    path: 'checkout',
    loadComponent: () =>
      import('./pages/checkout/checkout').then(m => m.Checkout)
  },

  // 🛠 Admin
  {
    path: 'admin/add-product',
    loadComponent: () =>
      import('./pages/add-products/add-products').then(m => m.AddProducts)
  },
  {
    path: 'admin/edit-products',
    loadComponent: () =>
      import('./pages/edit-products/edit-products').then(m => m.EditProducts)
  },  
  {
  path: 'admin/admin-sales',
  loadComponent: () =>
    import('./pages/admin-sales/admin-sales').then(m => m.AdminSales)
},

  // 🚫 fallback
  {
    path: '**',
    redirectTo: ''
  }


];
