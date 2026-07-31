import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { KeycloakService } from './login.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const keycloakService = inject(KeycloakService);
  const router = inject(Router);

  if (!keycloakService.isAuthenticated()) {
    keycloakService.logout();
    router.navigate(['/login']);
    return false;
  }

  const rolesExigidas = route.data['roles'] as Array<string>;

  if (!rolesExigidas || rolesExigidas.length === 0) {
    return true;
  }

  const temPermissao = rolesExigidas.some(role => keycloakService.hasRole(role));

  if (temPermissao) {
    return true;
  } else {
    console.warn('Acesso Negado: Você não tem as roles necessárias:', rolesExigidas);
    alert('Acesso Negado! Você não tem permissão para acessar esta tela.');
    return false;
  }
};