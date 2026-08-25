import { Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css'],
})
export class Sidebar {
  menu1Expanded = signal(false);
  menu2Expanded = signal(false);
  userManagementExpanded = signal(false);
  organizationsExpanded = signal(false);
  
  toggleMenu1() {
    this.menu1Expanded.update(v => !v);
  }
  
  toggleMenu2() {
    this.menu2Expanded.update(v => !v);
  }

  toggleUserManagement() {
    this.userManagementExpanded.update(v => !v);
  }

  toggleOrganizations() {
    this.organizationsExpanded.update(v => !v);
  }
}
