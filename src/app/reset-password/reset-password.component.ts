import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
  private router = inject(Router);
  password = signal('');
  confirmPassword = signal('');
  showPassword = signal(false);
  showConfirmPassword = signal(false);

  // Validation rules
  hasLength = computed(() => this.password().length >= 8);
  hasSpecial = computed(() => /[!@#$%^&*(),.?":{}|<>]/.test(this.password()));
  hasNumber = computed(() => /\d/.test(this.password()));
  hasUpper = computed(() => /[A-Z]/.test(this.password()));
  hasLower = computed(() => /[a-z]/.test(this.password()));

  score = computed(() => {
    let s = 0;
    if (this.password().length > 0) s++;
    if (this.hasLength()) s++;
    if (this.hasUpper() && this.hasLower()) s++;
    if (this.hasNumber()) s++;
    if (this.hasSpecial()) s++;
    return s;
  });

  strengthText = computed(() => {
    const s = this.score();
    if (s === 0) return '';
    if (s <= 2) return 'Weak (Red)';
    if (s <= 4) return 'Medium (Yellow)';
    return 'Strong (Green)';
  });

  strengthClass = computed(() => {
    const s = this.score();
    if (s === 0) return '';
    if (s <= 2) return 'weak';
    if (s <= 4) return 'medium';
    return 'strong';
  });

  togglePasswordVisibility() {
    this.showPassword.set(!this.showPassword());
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword.set(!this.showConfirmPassword());
  }

  onSubmit() {
    if (this.password() && this.confirmPassword()) {
      if (this.password() === this.confirmPassword()) {
        if (this.score() >= 5) {
          alert('Password successfully reset!');
          this.router.navigate(['/sign-in']);
        } else {
          alert('Please ensure your password meets all requirements.');
        }
      } else {
        alert('Passwords do not match.');
      }
    } else {
      alert('Please fill in all fields.');
    }
  }
}
