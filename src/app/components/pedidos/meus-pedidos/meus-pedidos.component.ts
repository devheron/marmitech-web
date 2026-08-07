import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PedidoService } from '../../../services/pedido.service';

@Component({
  selector: 'app-meus-pedidos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './meus-pedidos.component.html',
  styleUrl: './meus-pedidos.component.scss'
})
export class MeusPedidosComponent implements OnInit {

  pedidoService = inject(PedidoService);

  pedidos: any[] = [];
  carregando = true;
  erro = '';

  get nomeUsuario() {
    return localStorage.getItem('nome') || 'Cliente';
  }

  get emAndamento() {
    return this.pedidos.filter(p => p.status !== 'ENTREGUE');
  }

  get concluidos() {
    return this.pedidos.filter(p => p.status === 'ENTREGUE');
  }

  ngOnInit(): void {
    this.carregar();
  }

  carregar() {
    this.carregando = true;
    this.erro = '';

    this.pedidoService.meusPedidos().subscribe({
      next: (lista) => {
        this.pedidos = lista || [];
        this.carregando = false;
      },
      error: () => {
        this.erro = 'Nao foi possivel carregar seus pedidos. Tente novamente.';
        this.carregando = false;
      }
    });
  }

  classeStatus(status: string): string {
    switch ((status || '').toUpperCase()) {
      case 'FILA':        return 'badge-fila';
      case 'PREPARANDO':  return 'badge-preparando';
      case 'FINALIZADO':  return 'badge-finalizado';
      case 'ENTREGUE':    return 'badge-entregue';
      default:            return 'badge-fila';
    }
  }
}