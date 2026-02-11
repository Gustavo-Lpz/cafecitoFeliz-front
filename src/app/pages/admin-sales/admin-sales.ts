import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';

import { SalesService } from '../../core/services/sales/sales.service';

@Component({
  standalone: true,
  selector: 'app-admin-sales',
  imports: [CommonModule],
  templateUrl: './admin-sales.html',
})
export class AdminSales implements OnInit {

  sales: any[] = [];

  totalSales = 0;
  totalAmount = 0;

  loading = false;

  constructor(private salesService: SalesService) {}

  // =================================
  ngOnInit(): void {
    this.loadData();
  }

  // =================================
  loadData() {

    this.loading = true;

    forkJoin({
      sales: this.salesService.getAllSales(),
      summary: this.salesService.getDailySummary()
    }).subscribe({
      next: ({ sales, summary }) => {

        this.sales = sales;

        this.totalSales = summary.totalSales;
        this.totalAmount = summary.totalAmount;

        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  // botón actualizar
  refresh() {
    this.loadData();
  }
}
