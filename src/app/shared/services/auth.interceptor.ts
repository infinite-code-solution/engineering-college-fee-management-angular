import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>, 
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const router = inject(Router);
  
  // Retrieve token from storage
  const accessToken = sessionStorage.getItem('TOKEN_KEY');

  // Clone request to add the Authorization header if a token is active
  let modifiedReq = req;
  if (accessToken) {
    modifiedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
  }

  // Handle stream pipeline errors uniformly
  return next(modifiedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Catch unauthorized/forbidden status responses from endpoints
      if (error.status === 401 || error.status === 403) {
        sessionStorage.removeItem('TOKEN_KEY');
        router.navigate(['/login'], { queryParams: { returnUrl: router.url } });
      }
      return throwError(() => error);
    })
  );
};
