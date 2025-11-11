import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly USERS_KEY = 'store_users';
  private readonly CURRENT_USER_KEY = 'current_user';
  private readonly PRODUCTS_KEY = 'store_products';
  private readonly CUSTOMERS_KEY = 'store_customers';
  private readonly SALES_KEY = 'store_sales';

  // User methods
  getUsers(): any[] {
    const users = localStorage.getItem(this.USERS_KEY);
    return users ? JSON.parse(users) : [];
  }

  saveUsers(users: any[]): void {
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  }

  getCurrentUser(): any | null {
    const user = localStorage.getItem(this.CURRENT_USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  setCurrentUser(user: any): void {
    localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
  }

  clearCurrentUser(): void {
    localStorage.removeItem(this.CURRENT_USER_KEY);
  }

  // Product methods
  getProducts(): any[] {
    const products = localStorage.getItem(this.PRODUCTS_KEY);
    return products ? JSON.parse(products) : [];
  }

  saveProducts(products: any[]): void {
    localStorage.setItem(this.PRODUCTS_KEY, JSON.stringify(products));
  }

  // Customer methods
  getCustomers(): any[] {
    const customers = localStorage.getItem(this.CUSTOMERS_KEY);
    return customers ? JSON.parse(customers) : [];
  }

  saveCustomers(customers: any[]): void {
    localStorage.setItem(this.CUSTOMERS_KEY, JSON.stringify(customers));
  }

  // Sale methods
  getSales(): any[] {
    const sales = localStorage.getItem(this.SALES_KEY);
    return sales ? JSON.parse(sales) : [];
  }

  saveSales(sales: any[]): void {
    localStorage.setItem(this.SALES_KEY, JSON.stringify(sales));
  }
}

