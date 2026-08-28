import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core'; // <-- Change here
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes'; 
import { apiInterceptor } from './core/interceptors/api.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    //  Stable, high-performance Zoneless execution (Replaced the experimental function)
    provideZonelessChangeDetection(), // <-- Change here

    //  Configure routing engine with modern component input binding
    provideRouter(routes, withComponentInputBinding()),

    //  Register your centralized interceptor pipeline
    provideHttpClient(
      withInterceptors([
        apiInterceptor
      ])
    )
  ]
};
