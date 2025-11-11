import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Customer } from '../models/customer.model';

@Component({
  selector: 'app-customer-form',
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.scss'],
  standalone: false,
})
export class CustomerFormComponent implements OnInit {
  @Input() customer: Customer | null = null;
  customerForm: FormGroup;
  isEditMode = false;

  constructor(
    private formBuilder: FormBuilder,
    private modalController: ModalController
  ) {
    this.customerForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      address: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      imageUrl: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    if (this.customer) {
      this.isEditMode = true;
      this.customerForm.patchValue(this.customer);
    }
  }

  async save() {
    if (this.customerForm.valid) {
      const customerData = this.customerForm.value;
      if (this.isEditMode && this.customer) {
        customerData.id = this.customer.id;
      }
      await this.modalController.dismiss(customerData);
    }
  }

  cancel() {
    this.modalController.dismiss();
  }
}
