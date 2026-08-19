import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {
  private router = inject(Router);
  showPassword = signal(false);
  showConfirmPassword = signal(false);
  
  username = '';
  email = '';
  password = '';
  confirmPassword = '';

  togglePasswordVisibility() {
    this.showPassword.set(!this.showPassword());
  }
  
  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword.set(!this.showConfirmPassword());
  }

  onSubmit() {
    if (this.username && this.email && this.password && this.confirmPassword) {
      if (this.password === this.confirmPassword) {
        alert('Account successfully created! Please sign in.');
        this.router.navigate(['/sign-in']);
      } else {
        alert('Passwords do not match');
      }
    } else {
      alert('Please fill in all fields');
    }
  }
}
