import { Routes } from '@angular/router';
import { HomeComponent } from './homepage/home/home.component';
import { LoginComponent } from './login/login.component';
import { RegistrazioneComponent } from './registrazione/registrazione.component';
import { CreaPostComponent } from './posts/creaPost/creaPost.component';
import { LogoutComponent } from './logout/logout.component';

export const routes: Routes = [

  { path: '', component: HomeComponent },

  { path: 'login', component: LoginComponent },

  { path: 'registrazione', component: RegistrazioneComponent },

  { path: 'crea-post', component: CreaPostComponent },

  { path: 'logout', component: LogoutComponent },
  
  { path: 'post/:idPost', component: CreaPostComponent }
];