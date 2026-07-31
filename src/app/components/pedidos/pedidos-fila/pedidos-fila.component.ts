import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PedidoService } from '../../../services/pedido.service';
import { StatusPedidoEnum } from '../../../models/status-pedido.enum';
import Swal from 'sweetalert2';
import { interval, Subscription } from 'rxjs';


interface PedidoItemResponseDTO {
  id: number;
  pedidoId: number;
  produtoId: number;
  clienteNome: string;
  produtoNome: string;
  quantidade: number;
  precoUnitarioPedido: number;
  subtotal: number;
}

interface PedidoResponseDTO {
  id: number;
  nomeCliente: string;
  status: string;
  enderecoEntrega: string;
  pedidoItems: PedidoItemResponseDTO[];
  valorTotal: number;
  dataPedido: string;
}

@Component({
  selector: 'app-pedidos-fila',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pedidos-fila.component.html',
  styleUrls: ['./pedidos-fila.component.scss']
})


export class PedidosFilaComponent implements OnInit, OnDestroy {
  pedidos: PedidoResponseDTO[] = [];
  statusPedido = StatusPedidoEnum;
  private pedidoService = inject(PedidoService);
  private refreshSubscription!: Subscription;

  ngOnInit(): void {
    this.carregarPedidos();
    // Atualiza a lista a cada 30 segundos
    this.refreshSubscription = interval(30000).subscribe(() => {
      this.carregarPedidos();
    });
  }

  ngOnDestroy(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  carregarPedidos(): void {
    this.pedidoService.findAll().subscribe(
      (pedidos: any[]) => {
        this.pedidos = pedidos.filter(p =>
          // Status que NÃO queremos na fila
          p.status !== this.statusPedido.ENTREGUE &&
          p.status !== this.statusPedido.FINALIZADO &&

          // Lógica para mostrar 'CANCELADO' temporariamente
          (p.status !== this.statusPedido.CANCELADO || this.foiCanceladoRecentemente(p.dataPedido))

        ).sort((a, b) => a.id - b.id);
      },
      (error) => {
        console.error('Erro ao carregar pedidos', error);
      }
    );
  }

  // Lógica para mostrar pedidos cancelados por 3 minutos
  private foiCanceladoRecentemente(dataPedido: string): boolean {
    // O backend envia a data como 'YYYY-MM-DD'
    const dataCancelamento = new Date(dataPedido).getTime();
    const agora = new Date().getTime();
    const tresMinutos = 3 * 60 * 1000;

    return (agora - dataCancelamento) < tresMinutos;
  }

  atualizarStatus(pedido: PedidoResponseDTO, novoStatus: string): void {
    // Garante que o novoStatus é valido
    const statusValido = Object.values(this.statusPedido).includes(novoStatus as StatusPedidoEnum);

    if (!statusValido) {
      Swal.fire('Erro', 'Status inválido selecionado.', 'error');
      return;
    }

    // Cria um objeto Pedido para enviar na atualização
    // O backend irá receber isto e o PedidoService irá atualizar o status
    const pedidoParaAtualizar: any = {
      ...pedido, // Envia o pedido todo
      status: novoStatus // garante que o status novo está definido
    };

    this.pedidoService.update(pedidoParaAtualizar).subscribe(
      () => {
        pedido.status = novoStatus;
        // Se o status for 'ENTREGUE' ou 'CANCELADO', remove da fila após 15s
        if (novoStatus === this.statusPedido.ENTREGUE || novoStatus === this.statusPedido.CANCELADO) {
          Swal.fire('Atualizado!', `Pedido ${pedido.id} marcado como ${novoStatus}.`, 'success');
          setTimeout(() => {
            this.pedidos = this.pedidos.filter(p => p.id !== pedido.id);
          }, 15000);
        } else {
          Swal.fire('Atualizado!', `Status do pedido ${pedido.id} atualizado.`, 'success');
        }
      },
      (error) => {
        Swal.fire('Erro', 'Não foi possível atualizar o status do pedido.', 'error');
        console.error('Erro ao atualizar status', error);
        // Recarrega os pedidos em caso de erro para re-sincronizar
        this.carregarPedidos();
      }
    );
  }
}