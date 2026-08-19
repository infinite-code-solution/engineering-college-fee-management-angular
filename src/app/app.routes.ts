import { Routes } from '@angular/router';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { Dashboard } from './dashboard/dashboard';
import { Home } from './dashboard/home/home';
import { Students } from './dashboard/students/students';
import { FeeCollection } from './dashboard/fee-collection/fee-collection';
import { Reports } from './dashboard/reports/reports';
import { Settings } from './dashboard/settings/settings';

export const routes: Routes = [
  { path: 'sign-in', component: SignInComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { 
    path: 'dashboard', 
    component: Dashboard,
    children: [
      { path: '', component: Home },
      { path: 'students', component: Students },
      { path: 'fee-collection', component: FeeCollection },
      { path: 'reports', component: Reports },
      { path: 'settings', component: Settings }
    ]
  },
  { path: '', redirectTo: '/sign-in', pathMatch: 'full' }
];
