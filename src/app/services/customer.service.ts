import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { Customer } from '../models/customer.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  constructor(private storageService: StorageService) {}

  getCustomers(): Customer[] {
    return this.storageService.getCustomers();
  }

  getCustomerById(id: string): Customer | undefined {
    const customers = this.getCustomers();
    return customers.find(c => c.id === id);
  }

  createCustomer(customer: Customer): void {
    const customers = this.getCustomers();
    customer.id = this.generateId();
    customers.push(customer);
    this.storageService.saveCustomers(customers);
  }

  updateCustomer(customer: Customer): void {
    const customers = this.getCustomers();
    const index = customers.findIndex(c => c.id === customer.id);
    if (index !== -1) {
      customers[index] = customer;
      this.storageService.saveCustomers(customers);
    }
  }

  deleteCustomer(id: string): void {
    const customers = this.getCustomers();
    const filteredCustomers = customers.filter(c => c.id !== id);
    this.storageService.saveCustomers(filteredCustomers);
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

