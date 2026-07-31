import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import Swal from 'sweetalert2';
import { KeycloakService } from '../../../auth/login.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, MdbFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginData = {
    email: '',
    senha: ''
  };

  router = inject(Router);
  authService = inject(KeycloakService);

  onLogin() {
    if (!this.loginData.email || !this.loginData.senha) {
      Swal.fire('Atenção', 'Preencha o e-mail e a senha.', 'warning');
      return;
    }

    this.authService.fazerLogin(this.loginData.email, this.loginData.senha).subscribe({
      next: (res) => {
        localStorage.setItem('user', this.loginData.email);
        localStorage.setItem('token', 'session_token_' + Date.now());
        Swal.fire({
          title: 'Bem-vindo!',
          text: 'Login realizado com sucesso.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
        this.router.navigate(['/admin/pedidos/fila']);
      },
      error: (err) => {
        Swal.fire('Erro no login', 'E-mail ou senha incorretos.', 'error');
      }
    });
  }
}
