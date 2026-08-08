import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { Cliente } from '../../../models/cliente';
import { RouterLink } from '@angular/router';
import { ClienteService } from '../../../services/cliente.service';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { ClientedetailsComponent } from '../clientedetails/clientedetails.component';
import { MdbModalModule, MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { KeycloakService } from '../../../auth/login.service';

@Component({
  selector: 'app-clientelist',
  imports: [RouterLink, MdbModalModule, ClientedetailsComponent, DatePipe],
  templateUrl: './clientelist.component.html',
  styleUrl: './clientelist.component.scss',
  standalone: true,
})


export class ClientelistComponent {
  lista: Cliente[] = [];
  clienteService = inject(ClienteService);
  loginService = inject(KeycloakService);

  clienteEdit: Cliente = new Cliente({
    clienteId: 0,
    nome: '',
    email: '',
    telefone: '',
    cpfCnpj: '',
    endereco: '',
    dataCadastro: '',
  });

  modalService = inject(MdbModalService);
  @ViewChild('modalClienteDetalhe') modalClienteDetalhe!: TemplateRef<any>;
  modalRef!: MdbModalRef<any>;

  constructor() {
    this.findAll();
  }

  get podeEditar() {
    return (localStorage.getItem('cargo') || '').toUpperCase() === 'ADMIN';
  }

  findAll() {
    this.clienteService.findAll().subscribe({
      next: (lista: Cliente[]) => {
        this.lista = lista;
      },
      error: (err: { message: any }) => {
        Swal.fire({
          title: 'Erro ao carregar lista de clientes',
          text: err.message,
          icon: 'error',
          confirmButtonText: 'Fechar',
        });
      },
    });
  }

  deleteById(cliente: Cliente) {
    if (!this.loginService.validarPermissaoEscrita()) return;

    Swal.fire({
      title: 'Você tem certeza?',
      icon: 'warning',
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, deletar!',
      cancelButtonText: 'Nao',
    }).then((result) => {
      if (result.isConfirmed) {
        this.clienteService.delete(cliente.id).subscribe({
          next: () => {
            this.lista = this.lista.filter(c => c.id !== cliente.id);
            this.findAll();
          },
          error: (err: { message: any }) => {
            Swal.fire({
              title: 'Erro ao deletar cliente',
              text: err.message,
              icon: 'error',
              confirmButtonText: 'Fechar',
            });
          },
        });
        Swal.fire({
          title: 'Deletado com sucesso!',
          icon: 'success',
          confirmButtonText: 'OK',
        });
      }
    });
  }

  new() {
    if (!this.loginService.validarPermissaoEscrita()) return;

    this.clienteEdit = new Cliente({
      id: 0,
      nome: '',
      email: '',
      telefone: '',
      cpfCnpj: '',
      endereco: '',
      dataCadastro: '',
    });
    this.modalRef = this.modalService.open(this.modalClienteDetalhe, {
      modalClass: 'modal-lg modal-dialog-centered'
    });
  }

  editById(cliente: Cliente) {
    if (!this.loginService.validarPermissaoEscrita()) return;

    this.clienteEdit = Object.assign({}, cliente);
    this.modalRef = this.modalService.open(this.modalClienteDetalhe, {
      modalClass: 'modal-lg modal-dialog-centered'
    });
  }

  retornoDetalhes(cliente: Cliente) {
    this.findAll();
    this.modalRef.close();
  }
}

