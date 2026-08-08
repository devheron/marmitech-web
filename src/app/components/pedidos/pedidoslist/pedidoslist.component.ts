import { Component, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { MdbModalModule, MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';

import { Pedido } from '../../../models/pedido';
import { Produto } from '../../../models/produto';
import { Cliente } from '../../../models/cliente';
import { Categoria } from '../../../models/categoria';

import { PedidoService } from '../../../services/pedido.service';
import { ProdutoService } from '../../../services/produto.service';
import { ClienteService } from '../../../services/cliente.service';
import { CategoriaService } from '../../../services/categoria.service';

import { KeycloakService } from '../../../auth/login.service';

@Component({
  selector: 'app-pedidoslist',
  imports: [CommonModule, FormsModule, MdbModalModule],
  templateUrl: './pedidoslist.component.html',
  styleUrls: ['./pedidoslist.component.scss'],
})
export class PedidoslistComponent implements OnInit {

  private pedidoService = inject(PedidoService);
  private produtoService = inject(ProdutoService);
  private clienteService = inject(ClienteService);
  private categoriaService = inject(CategoriaService);
  private modalService = inject(MdbModalService);
  private router = inject(Router);
  public loginService = inject(KeycloakService);


  vistaAtual: 'categorias' | 'produtos' = 'categorias';
  categorias: Categoria[] = [];
  produtos: Produto[] = [];
  produtosDaCategoria: Produto[] = [];
  categoriaSelecionada: any = null;


  carrinho: { produto: Produto, quantidade: number }[] = [];
  valorTotalPedido: number = 0;


  todosOsClientes: Cliente[] = [];
  clienteIdSelecionado: number | null = null;
  termoBuscaCliente: string = '';

  constructor() { }

  ngOnInit(): void {
    this.carregarDadosIniciais();
  }


  carregarDadosIniciais() {
    this.carregarTodasCategorias();
    this.carregarTodosProdutos();
    this.carregarTodosClientes();
  }

  carregarTodasCategorias() {
    this.categoriaService.findAll().subscribe({
      next: (categoriasRecebidas) => {
        this.categorias = categoriasRecebidas;
      },
      error: (err) => {
        console.error('Erro ao carregar categorias:', err);
      }
    });
  }

  carregarTodosProdutos() {
    this.produtoService.findAll().subscribe({
      next: (produtosRecebidos) => {
        this.produtos = produtosRecebidos;
      },
      error: (err) => {
        console.error('Erro ao buscar produtos:', err);
        Swal.fire('Erro', 'Houve um problema ao carregar os produtos.', 'error');
      }
    });
  }

  carregarTodosClientes() {
    this.clienteService.findAll().subscribe({
      next: (clientes) => {
        this.todosOsClientes = clientes;
      },
      error: (err) => {
        console.error('Erro ao carregar a lista de clientes:', err);
      }
    });
  }


  selecionarCategoria(categoria: any) {
    this.categoriaSelecionada = categoria;
    console.log('Categoria Selecionada:', categoria);
    console.log('Todos os Produtos:', this.produtos);

    const normalizar = (str: string) =>
      (str || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim()
        .toUpperCase();

    const catId = categoria.id || categoria.categoriaId;
    const nomeCategoria = normalizar(categoria.nome);

    this.produtosDaCategoria = this.produtos.filter(p => {
      const pCat: any = p.categoria;

      // Se produto tiver categoriaId
      const pCatId = (p as any).categoriaId || (pCat && typeof pCat === 'object' ? pCat.id : null);
      if (catId && pCatId && Number(catId) === Number(pCatId)) {
        return true;
      }

      // Se produto tiver categoriaNome / categoria como string / objeto com nome
      const pCatNome = (p as any).categoriaNome || (typeof pCat === 'string' ? pCat : (pCat?.nome || ''));
      if (nomeCategoria && normalizar(pCatNome) === nomeCategoria) {
        return true;
      }

      return false;
    });

    console.log('Produtos da Categoria filtrados:', this.produtosDaCategoria);
    this.vistaAtual = 'produtos';
  }

  voltarParaCategorias() {
    this.vistaAtual = 'categorias';
    this.categoriaSelecionada = null;
    this.produtosDaCategoria = [];
  }


  adicionarAoCarrinho(produto: Produto) {
    const itemExistente = this.carrinho.find(item => item.produto.id === produto.id);

    if (itemExistente) {
      itemExistente.quantidade++;
    } else {
      this.carrinho.push({ produto: produto, quantidade: 1 });
    }
    this.calcularTotal();
  }

  removerDoCarrinho(index: number) {
    this.carrinho.splice(index, 1);
    this.calcularTotal();
  }

  calcularTotal() {
    this.valorTotalPedido = this.carrinho.reduce((total, item) => {
      return total + (item.produto.precoUnitario * item.quantidade);
    }, 0);
  }

  limparCarrinho() {
    this.carrinho = [];
    this.valorTotalPedido = 0;
    this.clienteIdSelecionado = null;
    this.termoBuscaCliente = '';
  }


  buscarCliente() {
    if (!this.termoBuscaCliente || this.termoBuscaCliente.trim() === '') {
      Swal.fire('Atenção', 'Digite um nome ou CPF/CNPJ para buscar.', 'warning');
      return;
    }

    const buscaPorCpf = /^\d+$/.test(this.termoBuscaCliente);

    if (buscaPorCpf) {
      this.clienteService.findByCpfCnpj(this.termoBuscaCliente).subscribe({
        next: (cliente) => this.handleResultadoBusca(cliente ? [cliente] : []),
        error: (err) => this.handleErroBusca('CPF/CNPJ', err)
      });
    } else {
      this.clienteService.findByNome(this.termoBuscaCliente).subscribe({
        next: (clientes) => this.handleResultadoBusca(clientes),
        error: (err) => this.handleErroBusca('nome', err)
      });
    }
  }

  private handleResultadoBusca(clientes: Cliente[]) {
    if (clientes && clientes.length > 0) {
      const clienteEncontrado = clientes[0];
      this.clienteIdSelecionado = clienteEncontrado.id;
      Swal.fire('Sucesso', `Cliente "${clienteEncontrado.nome}" encontrado e selecionado!`, 'success');
    } else {
      Swal.fire('Não encontrado', 'Nenhum cliente encontrado com o termo informado.', 'info');
    }
  }

  private handleErroBusca(tipo: string, err: any) {
    console.error(`Erro ao buscar por ${tipo}:`, err);
    Swal.fire('Erro', `Ocorreu um problema ao buscar o cliente por ${tipo}.`, 'error');
  }


  finalizarPedido() {
    if (this.carrinho.length === 0) {
      Swal.fire('Carrinho Vazio', 'Adicione itens ao carrinho antes de finalizar.', 'warning');
      return;
    }
    if (!this.clienteIdSelecionado) {
      Swal.fire('Cliente não selecionado', 'Por favor, selecione um cliente para o pedido.', 'warning');
      return;
    }

    const itensDoPedido = this.carrinho.map(item => ({
      quantidade: item.quantidade,
      produto: { id: item.produto.id }
    }));

    const novoPedido: any = {
      status: 'FILA',
      enderecoEntrega: 'Balcão',
      valorTotal: this.valorTotalPedido,
      cliente: { id: this.clienteIdSelecionado },
      pedidoItems: itensDoPedido,
    };

    this.pedidoService.save(novoPedido).subscribe({
      next: (pedidoSalvo) => {
        Swal.fire('Sucesso!', `Pedido #${pedidoSalvo.id} finalizado com sucesso!`, 'success');
        this.limparCarrinho();
      },
      error: (err) => {
        console.error('Erro ao finalizar pedido:', err);
        Swal.fire('Erro!', 'Não foi possível finalizar o pedido. Verifique o console para mais detalhes.', 'error');
      }
    });
  }
}