import { Component, OnInit } from '@angular/core';
import { ProductService } from './services/product.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-list',
  imports: [CommonModule],
  template: `
    <div class="card-container" *ngIf="products.length > 0; else loading">
      <div class="product-card" *ngFor="let item of products">
        <h3>{{ item }}</h3>
        <span class="badge-status">Active Server Item</span>
      </div>
    </div>
    <ng-template #loading><p>Querying XAMPP Database Engine...</p></ng-template>
  `
})
export class ProductListComponent implements OnInit {
  products: string[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.productService.getProducts().subscribe({
      next: (response) => {
        if(response.success) this.products = response.data;
      },
      error: (err) => console.error('Connection blocked. Verify Laravel server status.', err)
    });
  }
}
