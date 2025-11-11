import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { Sale } from '../models/sale.model';

@Injectable({
  providedIn: 'root'
})
export class SaleService {
  constructor(private storageService: StorageService) {}

  getSales(): Sale[] {
    return this.storageService.getSales();
  }

  getSaleById(id: string): Sale | undefined {
    const sales = this.getSales();
    return sales.find(s => s.id === id);
  }

  createSale(sale: Sale): void {
    const sales = this.getSales();
    sale.id = this.generateId();
    sale.date = new Date().toISOString();
    sales.push(sale);
    this.storageService.saveSales(sales);
  }

  getSalesByDateRange(startDate: string, endDate: string): Sale[] {
    const sales = this.getSales();
    return sales.filter(s => {
      const saleDate = new Date(s.date);
      const start = new Date(startDate);
      const end = new Date(endDate);
      return saleDate >= start && saleDate <= end;
    });
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

