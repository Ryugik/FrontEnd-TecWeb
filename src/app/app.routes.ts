import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegistrazioneComponent } from './registrazione/registrazione.component';

export const routes: Routes = [

  { path: '', component: HomeComponent },


  { path: '/login',title: "Login", component: LoginComponent },

  { path: '/registrazione',title: "Registrazione", component: RegistrazioneComponent },

]