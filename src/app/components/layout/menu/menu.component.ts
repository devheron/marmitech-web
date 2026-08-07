import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MdbCollapseModule } from 'mdb-angular-ui-kit/collapse';
import { MdbDropdownModule } from 'mdb-angular-ui-kit/dropdown';
import { KeycloakService } from '../../../auth/login.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterLink, MdbCollapseModule, MdbDropdownModule, CommonModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {

  loginService = inject(KeycloakService);
  router = inject(Router);

  get isAdmin(): boolean {
    return this.loginService.hasRole('ADMIN');
  }

  get isFuncionario(): boolean {
    return this.loginService.hasRole('FUNCIONARIO');
  }

  get isCliente(): boolean {
    return this.loginService.hasRole('CLIENTE');
  }

  get isInterno(): boolean {
    return this.isAdmin || this.isFuncionario;
  }

  get nomeUsuario(): string {
    return localStorage.getItem('nome') || '';
  }

  get rotaInicial(): string {
    return this.isCliente ? '/meus-pedidos' : '/admin/pedidos/fila';
  }

  logout(): void {
    this.loginService.logout();
    this.router.navigate(['/login']);
  }
}