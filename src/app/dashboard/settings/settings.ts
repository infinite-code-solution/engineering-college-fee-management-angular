import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="content-header">
      <h1 class="page-title">Settings</h1>
      <div class="breadcrumbs">
        <a routerLink="/dashboard">Home</a> / <span>Settings</span>
      </div>
    </div>
    <div style="color: white; padding: 20px; background: #343a40; border-radius: 4px;">
      <h2>Settings</h2>
      <p>This is a placeholder for system settings.</p>
    </div>
  `
})
export class Settings {}
