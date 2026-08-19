import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="content-header">
      <h1 class="page-title">Students</h1>
      <div class="breadcrumbs">
        <a routerLink="/dashboard">Home</a> / <span>Students</span>
      </div>
    </div>
    <div style="color: white; padding: 20px; background: #343a40; border-radius: 4px;">
      <h2>Students List</h2>
      <p>This is a placeholder for the students table.</p>
    </div>
  `
})
export class Students {}
