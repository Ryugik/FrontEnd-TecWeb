import { Routes } from '@angular/router';
import { HomeComponent } from './homepage/home/home.component';
import { LoginComponent } from './login/login.component';
import { RegistrazioneComponent } from './registrazione/registrazione.component';

export const routes: Routes = [

  { path: '', component: HomeComponent },

  { path: 'login', component: LoginComponent },

  { path: 'registrazione', component: RegistrazioneComponent },
  
];