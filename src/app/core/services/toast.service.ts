// src/app/core/services/toast.service.ts
import { Injectable, signal } from '@angular/core';

export interface ToastMessage {
  message: string;
  type: 'success' | 'error' | 'info';
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  // Use a signal so your UI components can reactively listen to changes
  toast = signal<ToastMessage | null>(null);

  show(message: string, type: 'success' | 'error' | 'info' = 'info') {
    this.toast.set({ message, type });
    
    // Auto-dismiss after 4 seconds
    setTimeout(() => this.clear(), 4000);
  }

  clear() {
    this.toast.set(null);
  }
}
