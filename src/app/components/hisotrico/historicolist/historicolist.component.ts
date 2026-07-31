import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Pedido } from '../../../models/pedido';
import { PedidoService } from '../../../services/pedido.service';
import { CurrencyPipe, DatePipe, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-historicolist',
  imports: [RouterLink, CurrencyPipe, DatePipe, CommonModule, FormsModule],
  templateUrl: './historicolist.component.html',
  styleUrl: './historicolist.component.scss'
})
export class HistoricolistComponent implements OnInit {

  constructor() { }

  pedidos: Pedido[] = [];
  pedidosOriginal: Pedido[] = [];

  filtroData: string = '';
  filtroStatus: string = '';
  seletorDataAberto = false;
  seletorStatusAberto = false;
  mesAtualCalendario = new Date();

  statusOptions = [
    { value: '', label: 'Todos' },
    { value: 'FILA', label: 'Em Fila' },
    { value: 'PREPARANDO', label: 'Preparando' },
    { value: 'FINALIZADO', label: 'Finalizado' },
    { value: 'ENTREGUE', label: 'Entregue' },
    { value: 'CANCELADO', label: 'Cancelado' },
  ];

  private pedidoService = inject(PedidoService);

  ngOnInit(): void {
    this.carregarPedidos();
  }

  carregarPedidos() {
    this.pedidoService.findAll().subscribe({
      next: (listaRecebida) => {
        // Colocando os status para nao aparecer no historico todos os tipos de status
        const pedidosFiltrados = listaRecebida.filter(p =>
          p.status === 'FINALIZADO' ||
          p.status === 'CANCELADO' ||
          p.status === 'ENTREGUE'
        );

        this.pedidos = pedidosFiltrados;
        this.pedidosOriginal = pedidosFiltrados;
      },
      error: (erro) => {
        console.error('Erro ao buscar a lista de pedidos:', erro);
        Swal.fire('Erro', 'Houve um erro ao carregar o histórico de pedidos.', 'error');
      }
    });
  }

  buscar() {
    let pedidosFiltrados = [...this.pedidosOriginal];

    if (this.filtroData) {
      pedidosFiltrados = pedidosFiltrados.filter(pedido => {
        const dataPedidoFormatada = new Date(pedido.dataPedido).toISOString().split('T')[0];
        return dataPedidoFormatada === this.filtroData;
      });
    }

    if (this.filtroStatus) {
      pedidosFiltrados = pedidosFiltrados.filter(pedido =>
        pedido.status.toUpperCase() === this.filtroStatus.toUpperCase()
      );
    }

    this.pedidos = pedidosFiltrados;
  }

  // Função para limpar os filtros e restaurar a lista
  limparFiltros() {
    this.filtroData = '';
    this.filtroStatus = '';
    this.pedidos = [...this.pedidosOriginal];
  }

  get statusSelecionado() {
    return this.statusOptions.find(status => status.value === this.filtroStatus) ?? this.statusOptions[0];
  }

  get dataSelecionadaLabel(): string {
    if (!this.filtroData) {
      return 'Escolher data';
    }

    const [ano, mes, dia] = this.filtroData.split('-');
    return `${dia}/${mes}/${ano}`;
  }

  get mesAtualLabel(): string {
    return new Intl.DateTimeFormat('pt-BR', {
      month: 'long',
      year: 'numeric'
    }).format(this.mesAtualCalendario);
  }

  get diasCalendario(): Array<number | null> {
    const ano = this.mesAtualCalendario.getFullYear();
    const mes = this.mesAtualCalendario.getMonth();
    const primeiroDiaSemana = new Date(ano, mes, 1).getDay();
    const totalDias = new Date(ano, mes + 1, 0).getDate();
    const dias: Array<number | null> = Array(primeiroDiaSemana).fill(null);

    for (let dia = 1; dia <= totalDias; dia++) {
      dias.push(dia);
    }

    return dias;
  }

  alternarSeletorData() {
    this.seletorDataAberto = !this.seletorDataAberto;
    this.seletorStatusAberto = false;
  }

  alternarSeletorStatus() {
    this.seletorStatusAberto = !this.seletorStatusAberto;
    this.seletorDataAberto = false;
  }

  mudarMesCalendario(direcao: number) {
    const ano = this.mesAtualCalendario.getFullYear();
    const mes = this.mesAtualCalendario.getMonth() + direcao;
    this.mesAtualCalendario = new Date(ano, mes, 1);
  }

  selecionarDia(dia: number | null) {
    if (!dia) {
      return;
    }

    const ano = this.mesAtualCalendario.getFullYear();
    const mes = String(this.mesAtualCalendario.getMonth() + 1).padStart(2, '0');
    const diaFormatado = String(dia).padStart(2, '0');

    this.filtroData = `${ano}-${mes}-${diaFormatado}`;
    this.seletorDataAberto = false;
  }

  selecionarStatus(status: string) {
    this.filtroStatus = status;
    this.seletorStatusAberto = false;
  }

  diaEstaSelecionado(dia: number | null): boolean {
    if (!dia || !this.filtroData) {
      return false;
    }

    const ano = this.mesAtualCalendario.getFullYear();
    const mes = String(this.mesAtualCalendario.getMonth() + 1).padStart(2, '0');
    const diaFormatado = String(dia).padStart(2, '0');

    return this.filtroData === `${ano}-${mes}-${diaFormatado}`;
  }
}
