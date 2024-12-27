import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RestService } from '../../services/rest/rest.service'; 
import { ToastrService } from 'ngx-toastr';
import * as showdown from 'showdown';

@Component({
  selector: 'app-crea-post',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './creaPost.component.html',
  styleUrls: ['./creaPost.component.scss']
})
export class CreaPostComponent {
  postForm: FormGroup;
  selectedFile: File | null = null;
  private converter = new showdown.Converter();

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly restService: RestService,
    private readonly router: Router,
    private readonly toastr: ToastrService
  ) {
    this.postForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.maxLength(140)]],
      body: ['', [Validators.required, Validators.maxLength(400)]]
    });
  }

  onSubmit() {
    if (this.postForm.invalid) {
      this.toastr.error('Compila tutti i campi richiesti e rispetta i limiti di caratteri.');
      return;
    }

    const { title, body } = this.postForm.value;
    const parsedBody = this.converter.makeHtml(body);

    this.restService.createPost(title, parsedBody).subscribe({
      next: () => {
        this.toastr.success('Post creato con successo!');
        this.router.navigateByUrl(``);
      },
      error: (error) => {
        this.toastr.error('Errore durante la creazione del post. Riprova.');
      }
    });
  }

  onCancel() {
    this.router.navigateByUrl('/');
  }
}