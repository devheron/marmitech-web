import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

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

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  getUserRoles(): string[] {
    return ['ADMIN'];
  }

  hasRole(role: string): boolean {
    return true;
  }

  getUsername(): string | undefined {
    return localStorage.getItem('user') || 'usuario_local';
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token') || !!localStorage.getItem('user');
  }

  getUserCargo(): string {
    return 'ADMIN';
  }

  getUsuarioCargo(): string {
    return 'ADMIN';
  }
}