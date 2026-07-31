import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { Cliente } from '../../../models/cliente';
import { ActivatedRoute, Router } from '@angular/router';
import { ClienteService } from '../../../services/cliente.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-clientedetails',
  imports: [FormsModule, MdbFormsModule],
  templateUrl: './clientedetails.component.html',
  styleUrls: ['./clientedetails.component.scss'],
  standalone: true
})
export class ClientedetailsComponent {
  @Input() cliente: Cliente = new Cliente({
    id: 0,
    nome: '',
    email: '',
    telefone: '',
    dataCadastro: ''

  });
  @Output() retorno = new EventEmitter<Cliente>();
  @Output() cancelar = new EventEmitter<void>();

  clienteService = inject(ClienteService);
  routerSaver = inject(Router);
  route = inject(ActivatedRoute);

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    console.log(id);
    if (id) {
      this.findById(parseInt(id));
    }
  }

  findById(id: number) {
    this.clienteService.findById(id).subscribe({
      next: (cliente) => {
        this.cliente = cliente;
      },
      error: (err) => {
        Swal.fire('Erro!', 'Houve um erro ao executar esta ação: ' + err.error, 'error');
      }
    });
  }

  salvar() {
    if (this.cliente.id > 0) {
      this.clienteService.update(this.cliente).subscribe({
        next: updated => {Swal.fire('Atualizado', 'Cliente atualizado!', 'success'); 
          this.routerSaver.navigate(['admin/cliente'], { state: { updatedCliente: updated } });
          this.retorno.emit(updated);
        },
        error: (err) => Swal.fire('Erro', err.message, 'error')
      });
    } else {
      this.clienteService.create(this.cliente).subscribe({
        next: (created) => Swal.fire('Criado', 'Cliente criado!', 'success').then(() => {
          this.retorno.emit(created);
          this.routerSaver.navigate(['admin/cliente'], { state: { newCliente: created } });
        }),
        error: (err) => Swal.fire('Erro', err.message, 'error')
      });
    }
  }
}
