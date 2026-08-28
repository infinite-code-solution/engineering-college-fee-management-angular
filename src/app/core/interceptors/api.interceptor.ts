// src/app/core/interceptors/api.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, finalize, throwError } from 'rxjs';
import { LoadingService } from '../services/loading.service';
import { ToastService } from '../services/toast.service';
import { formatApiError } from '../utils/error-formatter.util';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);
  const toastService = inject(ToastService);

  // 1. Increment the active requests tracker immediately before the network flight
  loadingService.show();

  return next(req).pipe(
    catchError((rawError) => {
      const typedError = formatApiError(rawError);
      toastService.show(typedError.message, 'error');
      return throwError(() => typedError);
    }),
    // 2. Finalize executes on success, error, or cancel streams
    finalize(() => {
      loadingService.hide();
    })
  );
};
