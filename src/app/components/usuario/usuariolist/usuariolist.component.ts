import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { Usuario } from '../../../models/usuario';
import { RouterLink } from '@angular/router';
import { UsuariosService } from '../../../services/usuario.service';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
//import { MdbModalModule } from 'mdb-angular-ui-kit/modal';
import { UsuariodetailsComponent } from '../usuariodetails/usuariodetails.component';
//import { UsuariodetailsComponent } from '../usuariodetails/usuariodetails.component';
import {
  MdbModalModule,
  MdbModalRef,
  MdbModalService,
} from 'mdb-angular-ui-kit/modal';
@Component({
  selector: 'app-usuariolist',
  imports: [RouterLink, MdbModalModule, UsuariodetailsComponent, DatePipe],
  templateUrl: './usuariolist.component.html',
  styleUrl: './usuariolist.component.scss',
  standalone: true,
})
export class UsuariolistComponent {
  lista: Usuario[] = [];
  usuarioService = inject(UsuariosService);
  usuarioEdit: Usuario = new Usuario({
    id: 0,
    nome: '',
    email: '',
    senha: '',
    cargo: '',
    dataCriacao: '',
  });
  /****Modal*********************************************** */
  modalService = inject(MdbModalService);
  @ViewChild('modalUsuariosDetalhe') modalUsuariosDetalhe!: TemplateRef<any>;
  modalRef!: MdbModalRef<any>;
  /*************************************************** */

  constructor() {
    this.findAll();
  }

  findAll() {
    this.usuarioService.findAll().subscribe({
      next: (lista: Usuario[]) => {
        console.log(lista);
        this.lista = lista;
      },
      error: (err) => {
        Swal.fire({
          title: 'Erro ao carregar lista de usuários',
          text: err.message,
          icon: 'error',
          confirmButtonText: 'Fechar',
        });
      },
    });
  }

  deleteById(usuario: Usuario) {
    // 1. Apresenta o SweetAlert para confirmação
    Swal.fire({
      title: `Confirma a exclusão do usuário ${usuario.nome}?`, // Corrigido para "usuário"
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, excluir!',
      cancelButtonText: 'Não, cancelar',
    }).then((result) => {
      // 2. Verifica se o usuário confirmou a ação
      if (result.isConfirmed) {
        // 3. Se confirmado, chama o serviço de exclusão
        this.usuarioService.delete(usuario.id!).subscribe({
          next: () => {
            // 4. Sucesso na exclusão: Notifica o usuário e recarrega a lista
            Swal.fire(
              'Excluído!',
              `Usuário ${usuario.nome} excluído com sucesso.`, // Corrigido para "Usuário"
              'success'
            );
            this.findAll(); // Recarrega a lista para remover o item da view
          },
          error: (err) => {
            // 5. Erro na exclusão: Notifica o usuário
            Swal.fire(
              'Erro!',
              `Houve um erro ao executar esta ação: ${err.message || err.error}`,
              'error'
            );
          },
        });
      }
    });
  }

  new() {
    this.usuarioEdit = new Usuario({
      id: 0,
      nome: '',
      email: '',
      senha: '',
      cargo: '',
      dataCriacao: '',
    });
    this.modalRef = this.modalService.open(this.modalUsuariosDetalhe, {
      modalClass: 'modal-lg modal-dialog-centered'
    });
  }
  editById(usuario: Usuario) {
    this.usuarioEdit = Object.assign({}, usuario); //clonando pra evitar referencia de objeto
    this.modalRef = this.modalService.open(this.modalUsuariosDetalhe, {
      modalClass: 'modal-lg modal-dialog-centered'
    });
  }
  retornoDetalhes(usuario: Usuario) {
    this.findAll();
    this.modalRef.close();
  }
}

