import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { PedidoItem } from '../../../models/pedido-item';
import { PedidoItemService } from '../../../services/pedido-item.service';
import { PedidosItemdetailsComponent } from '../pedidos-itemdetails/pedidos-itemdetails.component';
import {MdbModalModule, MdbModalRef, MdbModalService} from 'mdb-angular-ui-kit/modal';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-pedidos-itemlist',
  imports: [MdbModalModule, PedidosItemdetailsComponent],
  templateUrl: './pedidos-itemlist.component.html',
  styleUrl: './pedidos-itemlist.component.scss'
})
export class PedidosItemlistComponent {

  pedidoItemService = inject(PedidoItemService);

  pedidoItems: PedidoItem[] = [];

  pedidoItemEdit: PedidoItem = new PedidoItem(
    { id: 0, 
      pedidoId: 0,
      produtoId: 0,
      clienteNome: '',
      produtoNome: '',
      quantidade: 0,
      precoUnitarioPedido: 0,
      subtotal: 0 });

  modalService = inject(MdbModalService);
  @ViewChild('modalPedidoItemDetalhe') modalProdutoDetalhe!: TemplateRef<any>;
  modalRef!: MdbModalRef<any>;

  constructor() {  
    this.findAll();
  }
  
  findAll() {
    this.pedidoItemService.findall().subscribe({
      next: pedidoItems => {
        this.pedidoItems = pedidoItems;
        console.log('Itens de pedido carregados:', this.pedidoItems);
      },
      error: err => {
        Swal.fire(
          'Erro!',
          'Houve um erro ao executar esta ação: ' + err.error,
          'error'
        );
      }
    });
  }
  
  new() {
    this.pedidoItemEdit = new PedidoItem(
      { id: 0, 
        pedidoId: 0,
        produtoId: 0,
        clienteNome: '',
        produtoNome: '',
        quantidade: 0,
        precoUnitarioPedido: 0,
        subtotal: 0 });
    this.modalRef = this.modalService.open(this.modalProdutoDetalhe);
  };

  retornoDetalhe(pedidoItem: PedidoItem) {
    this.findAll();
    this.modalRef.close();    
  }
  

  editById(item: PedidoItem): void {
    this.pedidoItemEdit = Object.assign({}, item);
    this.modalRef = this.modalService.open(this.modalProdutoDetalhe);
  };
  
  deleteById(pedidoItem: PedidoItem): void {
        Swal.fire({
          title: 'Confirma a exclusão do produto ' + pedidoItem.id + '?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Sim',
          cancelButtonText: 'Não'
        }).then((result) => {
          if (result.isConfirmed) {
            this.pedidoItemService.delete(pedidoItem.id!).subscribe({
              next: msg => {
                Swal.fire(
                  'Excluído!',
                  'Produto ' + pedidoItem.id + ' excluído com sucesso.',
                  'success'
                );
                this.findAll();
              },
              error: err =>{
                Swal.fire(
                  'Erro!',
                  'Houve um erro ao executar esta ação: ' + err.error,
                  'error'
                );
              }
            })
    
          }
        });
  };
}
