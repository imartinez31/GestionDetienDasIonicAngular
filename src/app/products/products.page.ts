import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController, AlertController } from '@ionic/angular';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product.model';
import { ProductFormComponent } from '../product-form/product-form.component';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
  standalone: false,
})
export class ProductsPage implements OnInit {
  products: Product[] = [];
  searchTerm: string = '';

  constructor(
    private productService: ProductService,
    private modalController: ModalController,
    private toastController: ToastController,
    private alertController: AlertController,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadProducts();
  }

  ionViewWillEnter() {
    this.loadProducts();
  }

  loadProducts() {
    this.products = this.productService.getProducts();
  }

  async openProductForm(product?: Product) {
    const modal = await this.modalController.create({
      component: ProductFormComponent,
      componentProps: {
        product: product || null
      }
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      if (product) {
        this.productService.updateProduct(data);
        const toast = await this.toastController.create({
          message: 'Producto actualizado exitosamente',
          duration: 2000,
          color: 'success'
        });
        toast.present();
      } else {
        this.productService.createProduct(data);
        const toast = await this.toastController.create({
          message: 'Producto creado exitosamente',
          duration: 2000,
          color: 'success'
        });
        toast.present();
      }
      this.loadProducts();
    }
  }

  async deleteProduct(product: Product) {
    const alert = await this.alertController.create({
      header: 'Confirmar Eliminación',
      message: `¿Está seguro de eliminar el producto "${product.name}"?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.productService.deleteProduct(product.id);
            this.loadProducts();
            this.toastController.create({
              message: 'Producto eliminado exitosamente',
              duration: 2000,
              color: 'success'
            }).then(toast => toast.present());
          }
        }
      ]
    });

    await alert.present();
  }

  get filteredProducts(): Product[] {
    if (!this.searchTerm) {
      return this.products;
    }
    return this.products.filter(p => 
      p.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  logout() {
    this.authService.logout();
  }
}
