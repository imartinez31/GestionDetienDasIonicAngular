import { Component, OnInit } from '@angular/core';
import { SaleService } from '../services/sale.service';
import { ProductService } from '../services/product.service';
import { CustomerService } from '../services/customer.service';
import { AuthService } from '../services/auth.service';
import { Sale } from '../models/sale.model';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.page.html',
  styleUrls: ['./reports.page.scss'],
  standalone: false,
})
export class ReportsPage implements OnInit {
  sales: Sale[] = [];
  totalSales: number = 0;
  totalProducts: number = 0;
  totalCustomers: number = 0;
  startDate: string = '';
  endDate: string = '';

  constructor(
    private saleService: SaleService,
    private productService: ProductService,
    private customerService: CustomerService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadReports();
  }

  ionViewWillEnter() {
    this.loadReports();
  }

  loadReports() {
    this.sales = this.saleService.getSales();
    this.totalProducts = this.productService.getProducts().length;
    this.totalCustomers = this.customerService.getCustomers().length;
    this.calculateTotals();
  }

  calculateTotals() {
    if (this.startDate && this.endDate) {
      const filteredSales = this.saleService.getSalesByDateRange(this.startDate, this.endDate);
      this.totalSales = filteredSales.reduce((sum, sale) => sum + sale.total, 0);
    } else {
      this.totalSales = this.sales.reduce((sum, sale) => sum + sale.total, 0);
    }
  }

  onDateChange() {
    this.calculateTotals();
  }

  get filteredSales(): Sale[] {
    if (this.startDate && this.endDate) {
      return this.saleService.getSalesByDateRange(this.startDate, this.endDate);
    }
    return this.sales;
  }

  get totalItemsSold(): number {
    return this.filteredSales.reduce((sum, sale) => 
      sum + sale.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
    );
  }

  logout() {
    this.authService.logout();
  }
}
