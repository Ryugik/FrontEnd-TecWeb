import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../!services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';

export const authGuard: CanActivateFn = (route, state) => {
  const toastr = inject(ToastrService);
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.checkAuth()) {
    return true;
  } else {
    toastr.error("Effettua prima il login");
    return router.parseUrl("/login");
  }
};