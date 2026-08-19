import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-fee-collection',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="content-header">
      <h1 class="page-title">Fee Collection</h1>
      <div class="breadcrumbs">
        <a routerLink="/dashboard">Home</a> / <span>Fee Collection</span>
      </div>
    </div>
    <div style="color: white; padding: 20px; background: #343a40; border-radius: 4px;">
      <h2>Fee Collection</h2>
      <p>This is a placeholder for fee collection forms.</p>
    </div>
  `
})
export class FeeCollection {}
