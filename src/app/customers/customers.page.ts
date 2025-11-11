import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController, AlertController } from '@ionic/angular';
import { CustomerService } from '../services/customer.service';
import { Customer } from '../models/customer.model';
import { CustomerFormComponent } from '../customer-form/customer-form.component';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.page.html',
  styleUrls: ['./customers.page.scss'],
  standalone: false,
})
export class CustomersPage implements OnInit {
  customers: Customer[] = [];
  searchTerm: string = '';

  constructor(
    private customerService: CustomerService,
    private modalController: ModalController,
    private toastController: ToastController,
    private alertController: AlertController,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadCustomers();
  }

  ionViewWillEnter() {
    this.loadCustomers();
  }

  loadCustomers() {
    this.customers = this.customerService.getCustomers();
  }

  async openCustomerForm(customer?: Customer) {
    const modal = await this.modalController.create({
      component: CustomerFormComponent,
      componentProps: {
        customer: customer || null
      }
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      if (customer) {
        this.customerService.updateCustomer(data);
        const toast = await this.toastController.create({
          message: 'Cliente actualizado exitosamente',
          duration: 2000,
          color: 'success'
        });
        toast.present();
      } else {
        this.customerService.createCustomer(data);
        const toast = await this.toastController.create({
          message: 'Cliente creado exitosamente',
          duration: 2000,
          color: 'success'
        });
        toast.present();
      }
      this.loadCustomers();
    }
  }

  async deleteCustomer(customer: Customer) {
    const alert = await this.alertController.create({
      header: 'Confirmar Eliminación',
      message: `¿Está seguro de eliminar el cliente "${customer.name}"?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.customerService.deleteCustomer(customer.id);
            this.loadCustomers();
            this.toastController.create({
              message: 'Cliente eliminado exitosamente',
              duration: 2000,
              color: 'success'
            }).then(toast => toast.present());
          }
        }
      ]
    });

    await alert.present();
  }

  get filteredCustomers(): Customer[] {
    if (!this.searchTerm) {
      return this.customers;
    }
    return this.customers.filter(c => 
      c.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      c.phone.includes(this.searchTerm)
    );
  }

  logout() {
    this.authService.logout();
  }
}
