import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { Pedido } from '../../../models/pedido';
import { PedidoService } from '../../../services/pedido.service';

@Component({
  selector: 'app-historicodetails',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './historicodetails.component.html',
  styleUrls: ['./historicodetails.component.scss']
})
export class HistoricodetailsComponent {

  pedido: Pedido = new Pedido({
    id: 0,
    nomeCliente: '',
    status: '',
    enderecoEntrega: '',
    dataPedido: '',
    pedidoItems: [],
    valorTotal: 0,
    historicos: []
  });

  private pedidoService = inject(PedidoService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = Number(idParam);
      this.findById(id);
    }
  }

  findById(id: number): void {
    this.pedidoService.findById(id).subscribe({
      next: pedidoEncontrado => {
        this.pedido = pedidoEncontrado;
      },
      error: err => {
        console.error('Erro ao buscar detalhes do pedido:', err);
        alert('Pedido não encontrado!');
        this.router.navigate(['/admin/historicos']);
      }
    });
  }
}