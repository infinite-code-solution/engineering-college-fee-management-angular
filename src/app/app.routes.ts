import { Routes } from '@angular/router';
import { SignInComponent } from './features/auth/sign-in/sign-in.component';
import { SignUpComponent } from './features/auth/sign-up/sign-up.component';
import { ForgotPasswordComponent } from './features/auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './features/auth/reset-password/reset-password.component';
import { Dashboard } from './dashboard/dashboard';
import { Home } from './dashboard/home/home';
import { Students } from './dashboard/students/students';
import { FeeCollection } from './dashboard/fee-collection/fee-collection';
import { Reports } from './dashboard/reports/reports';
import { Settings } from './dashboard/settings/settings';
import { RolesComponent } from './dashboard/roles/roles';
import { StaffComponent } from './dashboard/staff/staff';
import { AdminsComponent } from './dashboard/admins/admins';
import { AccountsComponent } from './dashboard/accounts/accounts';
import { SuperAdminsComponent } from './dashboard/super-admins/super-admins';
import { CollegesComponent } from './dashboard/colleges/colleges';
import { TrainingInstitutesComponent } from './dashboard/training-institutes/training-institutes';
import { ShopsComponent } from './dashboard/shops/shops';
import { CompaniesComponent } from './dashboard/companies/companies';
import { HotelsComponent } from './dashboard/hotels/hotels';
import { RestaurantsComponent } from './dashboard/restaurants/restaurants';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: 'sign-in', component: SignInComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { 
    path: 'dashboard', 
    component: Dashboard,
    canActivate: [authGuard], // Add any route guards if needed
    children: [
      { path: '', component: Home },
      { path: 'students', component: Students },
      { path: 'fee-collection', component: FeeCollection },
      { path: 'reports', component: Reports },
      { path: 'settings', component: Settings },
      { path: 'roles', component: RolesComponent },
      { path: 'staff', component: StaffComponent },
      { path: 'admins', component: AdminsComponent },
      { path: 'accounts', component: AccountsComponent },
      { path: 'super-admins', component: SuperAdminsComponent },
      { path: 'colleges', component: CollegesComponent },
      { path: 'training-institutes', component: TrainingInstitutesComponent },
      { path: 'shops', component: ShopsComponent },
      { path: 'companies', component: CompaniesComponent },
      { path: 'hotels', component: HotelsComponent },
      { path: 'restaurants', component: RestaurantsComponent },
      { path: '**', redirectTo: '/sign-in', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: '/sign-in', pathMatch: 'full' }
];
