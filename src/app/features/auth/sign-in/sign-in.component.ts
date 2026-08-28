import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent {
  private router = inject(Router);
  private authService = inject(AuthService);
  showPassword = signal(false);
  email = '';
  password = '';

  togglePasswordVisibility() {
    this.showPassword.set(!this.showPassword());
  }

  onSubmit() {
    if (this.email && this.password) {
      this.authService.login({ email: this.email, password: this.password }).subscribe({
        next: (response) => {
          this.router.navigate(['/dashboard']);
        }
      });
    }
  }
}
