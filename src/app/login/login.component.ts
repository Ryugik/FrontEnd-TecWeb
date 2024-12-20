import { Component, inject } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule} from '@angular/forms';
import { AuthService } from '../services/auth/auth.service';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink]
})
export class LoginComponent {
  isError: boolean = false;
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastr = inject(ToastrService);
  loginForm = new FormGroup({
    username: new FormControl('', Validators.compose([Validators.required, Validators.minLength(1)])),
    password: new FormControl('', Validators.compose([Validators.required, Validators.minLength(1)]))      
  });


  onSubmit() {

    if (this.loginForm.invalid) {
      this.toastr.error('Registrazione fallita! Riprovare.');
    } else {

    const loginPayload = {
      username: this.loginForm.get('username')?.value as string,
      password: this.loginForm.get('password')?.value as string
    };

    this.authService.login(loginPayload).subscribe({
      next: () => {
      this.isError = false;
      this.router.navigateByUrl('');
      this.toastr.success('Login avvenuto con successo!');
    },
    error: (error) => {
      this.isError = true;
      this.toastr.error(error?.error?.message || 'Errore durante il login, riprovare!', 'Errore');
    }
    });
    }
  }
}
