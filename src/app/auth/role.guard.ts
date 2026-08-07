import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { KeycloakService } from './login.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const loginService = inject(KeycloakService);
  const router = inject(Router);

  if (!loginService.isAuthenticated()) {
    loginService.logout();
    router.navigate(['/login']);
    return false;
  }

  const rolesExigidas = route.data['roles'] as Array<string>;

  if (!rolesExigidas || rolesExigidas.length === 0) {
    return true;
  }

  const cargo = loginService.getUserCargo();
  const temPermissao = rolesExigidas.some(r => r.toUpperCase() === cargo);

  console.log('[guard]', state.url, '| cargo:', cargo, '| exigidas:', rolesExigidas, '| permitido:', temPermissao);

  if (temPermissao) {
    return true;
  }

  // nao redireciona para outra rota guardada: evita laco infinito
  router.navigate(['/login']);
  return false;
};