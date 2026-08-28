// src/app/core/services/loading.service.ts
import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  // 1. Tracks raw back-to-back concurrent network fly-outs
  private activeRequests = 0;
  private debounceTimer: any = null;

  // 2. The explicit visibility state read by your template layout
  readonly isSpinnerVisible = signal<boolean>(false);

  // Configuration parameter: Time window in milliseconds
  private readonly DEBOUNCE_DELAY = 200; 

  show() {
    this.activeRequests++;

    // If a request is running and no timer is active, queue the spinner display
    if (this.activeRequests === 1 && !this.debounceTimer) {
      this.debounceTimer = setTimeout(() => {
        this.isSpinnerVisible.set(true);
      }, this.DEBOUNCE_DELAY);
    }
  }

  hide() {
    this.activeRequests = Math.max(0, this.activeRequests - 1);

    // When the queue is fully cleared, reset variables and evaluate the visibility state
    if (this.activeRequests === 0) {
      this.clearDebounceTimer();
      this.isSpinnerVisible.set(false);
    }
  }

  private clearDebounceTimer() {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }
  }
}
