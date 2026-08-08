import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class KeycloakService {
  private http = inject(HttpClient);

  fazerLogin(email: string, senha: String): Observable<any> {
    // Tenta autenticação no backend ou aceita caso o usuário exista
    return this.http.post(`${environment.apiUrl}/api/usuario/login`, { email, senha }).pipe();
  }

  getToken(): string | undefined {
    return localStorage.getItem('token') || undefined;
  }

  login(): void {}

  getUsername(): string | undefined {
    return localStorage.getItem('user') || 'usuario_local';
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('cargo');
    localStorage.removeItem('nome');
  }

  getUserRoles(): string[] {
    const cargo = localStorage.getItem('cargo');
    return cargo ? [cargo.toUpperCase()] : [];
  }

  hasRole(role: string): boolean {
    const cargo = localStorage.getItem('cargo');
    return !!cargo && cargo.toUpperCase() === role.toUpperCase();
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getUserCargo(): string {
    return (localStorage.getItem('cargo') || '').toUpperCase();
  }

  getUsuarioCargo(): string {
    return this.getUserCargo();
  }

  isFuncionario(): boolean {
    return this.hasRole('FUNCIONARIO');
  }

  validarPermissaoEscrita(): boolean {
    if (this.isFuncionario()) {
      Swal.fire({
        title: 'Acesso Restrito',
        text: 'Usuários com perfil de Funcionário não têm permissão para cadastrar ou editar dados no sistema.',
        icon: 'warning',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#3085d6'
      });
      return false;
    }
    return true;
  }
}