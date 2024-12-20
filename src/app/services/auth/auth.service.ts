import { Injectable, inject, Injector } from '@angular/core';
import { RestService } from '../rest/rest.service';
import { jwtDecode } from 'jwt-decode';
import { catchError, EMPTY } from 'rxjs';

type AuthState = {
  user: string | null;
  token: string | null;
  readonly checkToken: boolean;
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private injector = inject(Injector);

  authState: AuthState = {
    user: null,
    token: null,
    get checkToken() {
      if (!this.token) return false;
      try {
        const decoded: any = jwtDecode(this.token);
        return decoded.exp && Date.now() < decoded.exp * 1000;
      } catch {
        return false;
      }
    },
  };


  constructor() {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      this.authState.token = savedToken;
      const decoded: any = jwtDecode(savedToken);
      this.authState.user = decoded.user || null;
    }
  }


  private setToken(token: string) {
    localStorage.setItem('token', token);
    this.authState.token = token;
    const decoded: any = jwtDecode(token);
    this.authState.user = decoded.user || null;
  }


  getToken() {
    return this.authState.token;
  }


  login(credentials: { username: string; password: string }) {
    const rest = this.injector.get(RestService);
    const request = rest.login(credentials);
  
    request.pipe(catchError(() => EMPTY)).subscribe((response: any) => {
      if (response && response.token) {
        this.setToken(response.token); 
      } else {
        console.error('Token non presente nella risposta');
      }
    });

    return request;
  }
  

  logout() {
    const rest = this.injector.get(RestService);
  
    const request = rest.logout(); 
    request.pipe(catchError(() => EMPTY)).subscribe(() => {
      this.authState.user = null;   
      this.authState.token = null; 
      localStorage.removeItem('token'); 
    });
  
    return request;
  }


  registrazione(credentials: { username: string; password: string }) {
    const rest = this.injector.get(RestService);
    const request = rest.registrazione(credentials);
  
    request.pipe(catchError(() => EMPTY)).subscribe((response: any) => {
      if (response && response.token) {
        this.setToken(response.token);
      } else {
        console.error('Token non presente nella risposta');
      }
    });
  
    return request;
  }
  

  checkAuth() {
    return this.authState.checkToken;
  }


  getUsername() {
    return this.authState.user ?? '';
  }

}
