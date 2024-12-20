import { Component, inject } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule} from '@angular/forms';
import { AuthService } from '../services/auth/auth.service';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-registrazione',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './registrazione.component.html',
  styleUrl: './registrazione.component.scss',
  standalone: true
})
export class RegistrazioneComponent {
  isError: boolean = false;
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastr = inject(ToastrService);
  regForm = new FormGroup({
    username: new FormControl('', Validators.compose([Validators.required, Validators.minLength(1)])),
    password: new FormControl('', Validators.compose([Validators.required, Validators.minLength(1)])) 
  });


  onSubmit() {

    if (this.regForm.invalid) {
      this.toastr.error('Registrazione fallita! Riprovare.');
    } else {

    const regPayload = {
      username: this.regForm.get('username')?.value as string,
      password: this.regForm.get('password')?.value as string
    };

    this.authService.registrazione(regPayload).subscribe({
      next: () => {
      this.isError = false;
      this.router.navigateByUrl('/login');
      this.toastr.success('Registrazione avvenuta con successo!');
    },
    error: (error) => {
      this.isError = true;
      this.toastr.error(error?.error?.message || 'Errore durante la registrazione, riprovare!', 'Errore');
    }
    });
    }
  }
} 
