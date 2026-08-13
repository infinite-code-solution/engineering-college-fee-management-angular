import { ApplicationConfig, provideZoneChangeDetection,provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { authInterceptor } from './shared/services/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    // enables components to map query parameters directly via inputs
    provideRouter(routes, withComponentInputBinding()), 
    provideHttpClient(
      withInterceptors([authInterceptor])
    )
  ]
};
