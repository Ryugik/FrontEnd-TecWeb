import { Component, OnInit, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../!services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { RestService } from '../../!services/rest/rest.service';

@Component({
  selector: 'app-crea-commento',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './crea-commento.component.html',
  styleUrl: './crea-commento.component.scss'
})
export class CreaCommentoComponent implements OnInit {
  commentForm: FormGroup;
  idPost: number = 0;
  title: string = '';
  username: string = '';

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly restService: RestService,
    private readonly router: Router,
    private readonly toastr: ToastrService,
    private readonly route: ActivatedRoute,
    private readonly auth: AuthService,
  ) {
    this.commentForm = this.formBuilder.group({
      body: ['', [Validators.required, Validators.maxLength(400)]],
    });
  }

  ngOnInit() {
    if(!this.auth.checkAuth()) {
      this.toastr.error('Devi fare il login per commentare un post.');
      this.router.navigateByUrl('/login');
    }

    if(this.idPost === 0) {
    this.route.params.subscribe(params => {
      this.idPost = Number(params['idPost']);
    });
    }
    this.restService.getPostById(this.idPost).subscribe({
      next: (post) => {
        this.title = post.title;
        this.username = post.author.toString();
      },
      error: (error) => {
        this.toastr.error('Errore durante il recupero del post. Riprova.');
        this.router.navigateByUrl('/');
      }
    });
  }

  onSubmit() {
    if (this.commentForm.invalid) {
      this.toastr.error('Compila tutti i campi richiesti e rispetta i limiti di caratteri.');
      return;
    }

    const body = this.commentForm.value.body as string;
    this.restService.addComment(this.idPost, body).subscribe({
      next: () => {
        this.toastr.success('Commento creato con successo!');
        this.router.navigateByUrl(``); ///aggiurna url
      },
      error: (error) => {
        this.toastr.error('Errore durante la creazione del commento. Riprova.');
      }
    });
  }


  onCancel() {
    this.router.navigateByUrl(``);
  }
}