import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const isAuthenticated = !!sessionStorage.getItem('TOKEN_KEY');

  if (isAuthenticated) {
    return true;
  }

  // Redirect to login component, recording previous target route parameters
  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};
