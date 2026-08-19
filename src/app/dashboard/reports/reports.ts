import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="content-header">
      <h1 class="page-title">Reports</h1>
      <div class="breadcrumbs">
        <a routerLink="/dashboard">Home</a> / <span>Reports</span>
      </div>
    </div>
    <div style="color: white; padding: 20px; background: #343a40; border-radius: 4px;">
      <h2>Reports</h2>
      <p>This is a placeholder for financial reports.</p>
    </div>
  `
})
export class Reports {}
