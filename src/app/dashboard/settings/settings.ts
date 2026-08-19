import { Component, signal, ElementRef, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './settings.html',
  styleUrls: ['./settings.css']
})
export class Settings {
  @ViewChild('tabsScroll') tabsScroll!: ElementRef;
  
  tabs = [
    'General', 'Profile', 'Notifications', 'Security', 
    'Billing', 'API Keys', 'Integrations', 'Team Members', 
    'Audit Logs', 'Advanced Options'
  ];
  activeTab = signal(this.tabs[0]);
  
  setActiveTab(tab: string) {
    this.activeTab.set(tab);
  }
  
  scrollTabs(amount: number) {
    if (this.tabsScroll) {
      this.tabsScroll.nativeElement.scrollLeft += amount;
    }
  }
}
