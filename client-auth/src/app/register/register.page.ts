import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar,
  IonButton,
  IonInput,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonText,
  IonSpinner
} from '@ionic/angular/standalone';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButton,
    IonInput,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonText,
    IonSpinner
  ],
})
export class RegisterPage {
  username: string = '';
  password: string = '';
  confirmPassword: string = '';
  loading: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  async register() {
    if (!this.username || !this.password || !this.confirmPassword) {
      this.errorMessage = 'Semua field harus diisi!';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Password dan konfirmasi password tidak cocok!';
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'Password minimal 6 karakter!';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    console.log('📝 Registering user:', this.username);

    this.authService.register({ username: this.username, password: this.password }).subscribe({
      next: (response: any) => {
        console.log('✅ Register berhasil:', response);
        this.successMessage = 'Registrasi berhasil! Silakan login.';
        this.username = '';
        this.password = '';
        this.confirmPassword = '';
        this.loading = false;

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err: any) => {
        console.error('❌ Register error:', err);
        console.error('Error status:', err.status);
        console.error('Error message:', err.statusText);
        console.error('Error body:', err.error);
        
        this.errorMessage = err.error?.error || err.statusText || 'Registrasi gagal!';
        this.loading = false;
      },
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
