import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { PedidoItemService } from '../../../services/pedido-item.service';
import { PedidoItem } from '../../../models/pedido-item';
import Swal from 'sweetalert2';
import { PedidoService } from '../../../services/pedido.service';
import { ProdutoService } from '../../../services/produto.service';
import { Pedido } from '../../../models/pedido';
import { Produto } from '../../../models/produto';

@Component({
  selector: 'app-pedidos-itemdetails',
  imports: [MdbFormsModule, FormsModule],
  templateUrl: './pedidos-itemdetails.component.html',
  styleUrl: './pedidos-itemdetails.component.scss'
})
export class PedidosItemdetailsComponent {
  router = inject(ActivatedRoute);
  routerSaver = inject(Router);


  pedidoItemService = inject(PedidoItemService);
  pedidoService = inject(PedidoService);
  produtoService = inject(ProdutoService);

  constructor() {
    const id = this.router.snapshot.paramMap.get('id');
    console.log(id);
    if (id) {
      this.findById(parseInt(id));
    }
  }

  pedidos: Pedido[] = [];
  produtos: Produto[] = [];

  @Input("pedidoItem") pedidoItem: PedidoItem = new PedidoItem(
    { id: 0, 
      pedidoId: 0,
      produtoId: 0,
      clienteNome: '',
      produtoNome: '',
      quantidade: 0,
      precoUnitarioPedido: 0,
      subtotal: 0 });
      
  @Output("retorno") retorno = new EventEmitter<PedidoItem>();

  ngOnInit(): void {
    this.carregarPedidos();
    this.carregarProdutos();
  }

    findById(id: number) {
      this.pedidoItemService.findById(id).subscribe(
        {
          next: pedidoItem => {
            this.pedidoItem = pedidoItem;
          },
          error: err => {
            Swal.fire(
              'Erro!',
              'Houve um erro ao executar esta ação: ' + err.error,
              'error'
            );
          }
        }
      )
    }
  
    salvar() {
    if(this.pedidoItem.id) {
      console.log('Enviando para atualização:', this.pedidoItem);
      this.pedidoItemService.update(this.pedidoItem).subscribe({
        next: pedidoItem => {
          Swal.fire(
            'Atualizado!',
            'Produto: ' + this.pedidoItem.id + ' atualizado com sucesso.',
            'success'
          );  
          this.retorno.emit(pedidoItem);
          this.routerSaver.navigate(['admin/pedidosItem'], {state: { pedidoItemEditado: this.pedidoItem }});
        },
        error: err => {
          Swal.fire(
            'Erro!',
            'Houve um erro ao executar esta ação: ' + err.error,
            'error'
          );
        }
      });
    } else {
      this.pedidoItemService.save(this.pedidoItem).subscribe({
        next: pedidoItem => {
          Swal.fire(
            'Salvo!',
            'Produto: ' + this.pedidoItem.id + ' atualizado com sucesso.',
            'success'
          );  
          this.retorno.emit(pedidoItem);
          this.routerSaver.navigate(['admin/pedidosItem'], {state: { pedidoItemNovo: this.pedidoItem }});
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
  }

  novoSubtotal() {
    if (this.pedidoItem.quantidade && this.pedidoItem.precoUnitarioPedido) {
      this.pedidoItem.subtotal = this.pedidoItem.quantidade * this.pedidoItem.precoUnitarioPedido;
    } else {
      this.pedidoItem.subtotal = 0;
    }
  }

    carregarPedidos() {
    this.pedidoService.findAll().subscribe({
      next: lista => {
        this.pedidos = lista;
      },
      error: err => {
        Swal.fire('Erro!', 'Não foi possível carregar a lista de pedidos.', 'error');
      }
    });
  }

  carregarProdutos() {
    this.produtoService.findAll().subscribe({
      next: lista => {
        this.produtos = lista;
      },
      error: err => {
        Swal.fire('Erro!', 'Não foi possível carregar a lista de produtos.', 'error');
      }
    });
  }
}
