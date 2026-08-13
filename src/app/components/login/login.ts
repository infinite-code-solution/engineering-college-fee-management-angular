import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ApiResponse, AuthTokenSession } from '../../shared/models/auth.models';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  loginForm: FormGroup;
  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  constructor(
    private fb: FormBuilder,
    private mockAuth: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);
    sessionStorage.setItem('TOKEN_KEY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mockTokenPayloadStringForTadipatriEngineeringCollegeSystem2026');
    this.router.navigate(['/admin/dashboard']);
    /*this.mockAuth.login(this.loginForm.value).subscribe({
      next: (response: ApiResponse<AuthTokenSession>) => {
        this.isLoading.set(false);
        if (response.success && response.data) {
          // Persist token session to secure application contexts (e.g. SessionStorage)
          sessionStorage.setItem('TOKEN_KEY', response.data.accessToken);
          
          // Re-route processing logic into administrative main workspace dashboards
          this.router.navigate(['/admin/dashboard']);
        }
      },
      error: (err: ApiResponse<AuthTokenSession>) => {
        this.isLoading.set(false);
        // Bind backend-supplied text descriptions dynamically to the UI layer
        this.errorMessage.set(err.error?.message || 'A network communication mismatch error occurred.');
      }
    });*/
  }
}
