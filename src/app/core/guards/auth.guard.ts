// src/app/core/guards/auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // If there's an active token stored, grant passage
  if (authService.getAccessToken()) {
    return true;
  }

  // Otherwise, kick them back out to login view bounds
  router.navigate(['/login']);
  return false;
};
