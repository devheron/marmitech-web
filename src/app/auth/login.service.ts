import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import Swal from 'sweetalert2';

import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDDmPTEPTROvbNlOTFxkEdiQYY5Gqmvxcg",
  authDomain: "marmitech-504321.firebaseapp.com",
  projectId: "marmitech-504321",
  storageBucket: "marmitech-504321.firebasestorage.app",
  messagingSenderId: "771382585695",
  appId: "1:771382585695:web:a25d7de63f3dc5d4dcaeea"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

@Injectable({
  providedIn: 'root'
})
export class KeycloakService {
  private http = inject(HttpClient);

  fazerLogin(email: string, senha: string): Observable<any> {
    // Tenta autenticacao no backend (banco de dados interno)
    return this.http.post<any>(`${environment.apiUrl}/api/usuario/login`, { email, senha }).pipe(
      catchError(() => {
        // Se o usuario nao existir no banco de dados interno, tenta autenticar via Firebase Auth (usuarios externos)
        return from(signInWithEmailAndPassword(auth, email, senha)).pipe(
          switchMap((userCredential) =>
            from(userCredential.user.getIdTokenResult(true)).pipe(
              switchMap((idTokenResult) => {
                const claims = idTokenResult.claims || {};
                const cargoExtraido = (claims['cargo'] || claims['role']) as string;
                return of({
                  token: idTokenResult.token,
                  cargo: cargoExtraido,
                  nome: userCredential.user.displayName || userCredential.user.email || 'Usuário Firebase',
                  email: userCredential.user.email,
                  isFirebase: true
                });
              })
            )
          )
        );
      })
    );
  }

  getToken(): string | undefined {
    return localStorage.getItem('token') || undefined;
  }

  login(): void { }

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