import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController, AlertController } from '@ionic/angular';
import { SaleService } from '../services/sale.service';
import { ProductService } from '../services/product.service';
import { CustomerService } from '../services/customer.service';
import { AuthService } from '../services/auth.service';
import { Sale, SaleItem } from '../models/sale.model';
import { Product } from '../models/product.model';
import { Customer } from '../models/customer.model';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.page.html',
  styleUrls: ['./sales.page.scss'],
  standalone: false,
})
export class SalesPage implements OnInit {
  sales: Sale[] = [];
  products: Product[] = [];
  customers: Customer[] = [];
  selectedCustomer: Customer | null = null;
  cartItems: SaleItem[] = [];

  constructor(
    private saleService: SaleService,
    private productService: ProductService,
    private customerService: CustomerService,
    private modalController: ModalController,
    private toastController: ToastController,
    private alertController: AlertController,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  ionViewWillEnter() {
    this.loadData();
  }

  loadData() {
    this.sales = this.saleService.getSales();
    this.products = this.productService.getProducts();
    this.customers = this.customerService.getCustomers();
  }

  addToCart(product: Product) {
    const existingItem = this.cartItems.find(item => item.productId === product.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
      existingItem.subtotal = existingItem.quantity * existingItem.unitPrice;
    } else {
      this.cartItems.push({
        productId: product.id,
        productName: product.name,
        quantity: 1,
        unitPrice: product.salePrice,
        subtotal: product.salePrice
      });
    }
  }

  removeFromCart(item: SaleItem) {
    const index = this.cartItems.indexOf(item);
    if (index > -1) {
      this.cartItems.splice(index, 1);
    }
  }

  updateQuantity(item: SaleItem, quantity: string | number | null | undefined) {
    const qty = typeof quantity === 'string' ? parseInt(quantity, 10) : (quantity || 0);
    if (qty > 0 && !isNaN(qty)) {
      item.quantity = qty;
      item.subtotal = item.quantity * item.unitPrice;
    }
  }

  get total(): number {
    return this.cartItems.reduce((sum, item) => sum + item.subtotal, 0);
  }

  async processSale() {
    if (!this.selectedCustomer) {
      const toast = await this.toastController.create({
        message: 'Por favor seleccione un cliente',
        duration: 2000,
        color: 'warning'
      });
      toast.present();
      return;
    }

    if (this.cartItems.length === 0) {
      const toast = await this.toastController.create({
        message: 'El carrito está vacío',
        duration: 2000,
        color: 'warning'
      });
      toast.present();
      return;
    }

    // Verificar existencias
    for (const item of this.cartItems) {
      const product = this.products.find(p => p.id === item.productId);
      if (product && product.quantity < item.quantity) {
        const toast = await this.toastController.create({
          message: `No hay suficientes existencias de ${product.name}`,
          duration: 2000,
          color: 'danger'
        });
        toast.present();
        return;
      }
    }

    const sale: Sale = {
      id: '',
      customerId: this.selectedCustomer.id,
      customerName: this.selectedCustomer.name,
      items: [...this.cartItems],
      total: this.total,
      date: new Date().toISOString()
    };

    // Actualizar existencias de productos
    for (const item of this.cartItems) {
      const product = this.products.find(p => p.id === item.productId);
      if (product) {
        product.quantity -= item.quantity;
        this.productService.updateProduct(product);
      }
    }

    this.saleService.createSale(sale);
    this.sales = this.saleService.getSales();
    this.cartItems = [];
    this.selectedCustomer = null;

    const toast = await this.toastController.create({
      message: 'Venta procesada exitosamente',
      duration: 2000,
      color: 'success'
    });
    toast.present();
  }

  clearCart() {
    this.cartItems = [];
    this.selectedCustomer = null;
  }

  logout() {
    this.authService.logout();
  }
}
