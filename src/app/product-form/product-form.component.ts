import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Product } from '../models/product.model';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss'],
  standalone: false,
})
export class ProductFormComponent implements OnInit {
  @Input() product: Product | null = null;
  productForm: FormGroup;
  isEditMode = false;

  constructor(
    private formBuilder: FormBuilder,
    private modalController: ModalController
  ) {
    this.productForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      quantity: [0, [Validators.required, Validators.min(0)]],
      costPrice: [0, [Validators.required, Validators.min(0)]],
      salePrice: [0, [Validators.required, Validators.min(0)]],
      imageUrl: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    if (this.product) {
      this.isEditMode = true;
      this.productForm.patchValue(this.product);
    }
  }

  async save() {
    if (this.productForm.valid) {
      const productData = this.productForm.value;
      if (this.isEditMode && this.product) {
        productData.id = this.product.id;
      }
      await this.modalController.dismiss(productData);
    }
  }

  cancel() {
    this.modalController.dismiss();
  }
}
