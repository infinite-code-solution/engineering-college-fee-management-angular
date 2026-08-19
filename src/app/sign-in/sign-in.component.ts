import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent {
  private router = inject(Router);
  showPassword = signal(false);
  email = '';
  password = '';

  togglePasswordVisibility() {
    this.showPassword.set(!this.showPassword());
  }

  onSubmit() {
    if (this.email && this.password) {
      alert(`Successfully signed in with ${this.email}`);
      // this.router.navigate(['/dashboard']);
    } else {
      alert('Please enter both email and password');
    }
  }
}
