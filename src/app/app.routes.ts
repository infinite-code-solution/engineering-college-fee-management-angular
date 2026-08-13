import { Routes } from '@angular/router';
import { FeeLedger } from './components/fee-ledger/fee-ledger';
import { Login } from './components/login/login';
import { authGuard } from './shared/guards/auth.guard';

export const routes: Routes = [
      // Default Application Redirect
    { 
        path: '', 
        redirectTo: 'login', 
        pathMatch: 'full' 
    },
  
  // Public Login Route
    {
        path: 'login',
        component: Login
    },
    // Protected Admin Dashboard Layout and Secondary Tabs Structure
    {
        path: 'admin',
        canActivate: [authGuard],
        loadComponent: () => import('./modules/dashboard/admin-layout/admin-layout').then(m => m.AdminLayout),
        children: [
        { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
        {
            path: 'dashboard',
            loadComponent: () => import('./modules/dashboard/overview/overview').then(m => m.Overview)
        },
        {
            path: 'fee-collection',
            loadComponent: () => import('./modules/dashboard/fee-collection/fee-collection').then(m => m.FeeCollection)
        },
        {
            path: 'reports',
            loadComponent: () => import('./modules/dashboard/reports/reports').then(m => m.Reports)
        },
        {
            path: 'settings',
            loadComponent: () => import('./modules/dashboard/settings/settings').then(m => m.Settings)
        }
        ]
    },
    {
        path: 'fee-ledger',
        component: FeeLedger
    },
    {
        path: 'products',
        loadComponent: () => import('./product-list.component').then(m => m.ProductListComponent)
    },
      // Fallback Catch-all Route redirecting to Login
    { 
        path: '**', 
        redirectTo: 'login' 
    }
    
];
