import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private storageService: StorageService) {}

  getProducts(): Product[] {
    return this.storageService.getProducts();
  }

  getProductById(id: string): Product | undefined {
    const products = this.getProducts();
    return products.find(p => p.id === id);
  }

  createProduct(product: Product): void {
    const products = this.getProducts();
    product.id = this.generateId();
    products.push(product);
    this.storageService.saveProducts(products);
  }

  updateProduct(product: Product): void {
    const products = this.getProducts();
    const index = products.findIndex(p => p.id === product.id);
    if (index !== -1) {
      products[index] = product;
      this.storageService.saveProducts(products);
    }
  }

  deleteProduct(id: string): void {
    const products = this.getProducts();
    const filteredProducts = products.filter(p => p.id !== id);
    this.storageService.saveProducts(filteredProducts);
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

