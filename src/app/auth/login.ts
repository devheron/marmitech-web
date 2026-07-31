import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { KeycloakService } from './login.service';

export const loginGuard: CanActivateFn = (route, state) => {
  const keycloakService = inject(KeycloakService);

  if (keycloakService.isAuthenticated()) {
    return true;
  }
  alert('Você precisa fazer login!');
  window.location.reload();
  return false;
};