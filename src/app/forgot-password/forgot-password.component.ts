import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  private router = inject(Router);
  email = '';

  onSubmit() {
    if (this.email) {
      alert(`Reset link sent to ${this.email}!`);
      this.router.navigate(['/reset-password']);
    } else {
      alert('Please enter your email address');
    }
  }
}
