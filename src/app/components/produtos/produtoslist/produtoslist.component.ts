import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { Produto } from '../../../models/produto';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import {MdbModalModule, MdbModalRef, MdbModalService} from 'mdb-angular-ui-kit/modal';
import { ProdutosdetailsComponent } from "../produtosdetails/produtosdetails.component";
import { ProdutoService } from '../../../services/produto.service';
import { KeycloakService } from '../../../auth/login.service';

@Component({
  selector: 'app-produtoslist',
  imports: [RouterLink, MdbModalModule, ProdutosdetailsComponent],
  templateUrl: './produtoslist.component.html',
  styleUrl: './produtoslist.component.scss'
})
export class ProdutoslistComponent {
  lista: Produto[] = [];
  produtoEdit: Produto = new Produto(
    { id: 0, 
      nome: '', 
      descricao: '', 
      categoria: '',
      dataCadastro: '', 
      precoUnitario: 0, 
      estoque: 0, 
      sku: '' });

  modalService = inject(MdbModalService);
  @ViewChild('modalProdutoDetalhe') modalProdutoDetalhe!: TemplateRef<any>;
  modalRef!: MdbModalRef<any>;

  produtoService = inject(ProdutoService);
  loginService = inject(KeycloakService);

  constructor() {
    this.findAll();
  }

  findAll() {
    this.produtoService.findAll().subscribe({
      next: lista => {
        this.lista = lista;
      },
      error: (err) => {
        Swal.fire(
          'Erro!',
          'Houve um erro ao executar esta ação: ' + err.error,
          'error'
        );
      }
    });
  }

  editById(produto: Produto) {
    if (!this.loginService.validarPermissaoEscrita()) return;

    this.produtoEdit = Object.assign({}, produto);
    this.modalRef = this.modalService.open(this.modalProdutoDetalhe, {
      modalClass: 'modal-lg modal-dialog-centered'
    });
  }

  new() {
    if (!this.loginService.validarPermissaoEscrita()) return;

    this.produtoEdit = new Produto(
      { id: 0, 
        nome: '', 
        descricao: '', 
        categoria: '',
        dataCadastro: '', 
        precoUnitario: 0, 
        estoque: 0, 
        sku: '' });
    this.modalRef = this.modalService.open(this.modalProdutoDetalhe, {
      modalClass: 'modal-lg modal-dialog-centered'
    });
  }


  retornoDetalhe(produto: Produto) {
    this.findAll();
    this.modalRef.close();    
  }


  deleteById(produto: Produto) {
    if (!this.loginService.validarPermissaoEscrita()) return;

    Swal.fire({
      title: 'Confirma a exclusão do produto ' + produto.nome + '?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não'
    }).then((result) => {
      if (result.isConfirmed) {
        this.produtoService.delete(produto.id!).subscribe({
          next: msg => {
            Swal.fire(
              'Excluído!',
              'Produto ' + produto.nome + ' excluído com sucesso.',
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
  }
}
