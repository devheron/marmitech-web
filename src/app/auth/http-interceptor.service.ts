import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { KeycloakService } from './login.service';

export const httpInterceptor: HttpInterceptorFn = (request, next) => {
  const keycloak = inject(KeycloakService);
  const token = keycloak.getToken();

  let req = request;
  if (token) {
    req = request.clone({
      setHeaders: { Authorization: 'Bearer ' + token }
    });
  }

  return next(req).pipe(
    catchError((err: any) => {
      if (err instanceof HttpErrorResponse && (err.status === 401 || err.status === 403)) {
        keycloak.logout();
      }
      return throwError(() => err);
    })
  );
};