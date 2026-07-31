import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { Categoria } from '../../../models/categoria'; // Assumindo que Categoria é a interface/classe correta
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { CategoriasdetailsComponent } from '../categoriasdetails/categoriasdetails.component';
import { CategoriaService } from '../../../services/categoria.service';
import {
  MdbModalModule,
  MdbModalRef,
  MdbModalService
} from 'mdb-angular-ui-kit/modal';


@Component({
  selector: 'app-categoriaslist',
  imports: [RouterLink, MdbModalModule, CategoriasdetailsComponent],
  templateUrl: './categoriaslist.component.html',
  styleUrl: './categoriaslist.component.scss',
  standalone: true,
})
export class CategoriaslistComponent {
  lista: Categoria[] = [];
  categoriaService = inject(CategoriaService);

  categoriaEdit: Categoria = new Categoria({
    id: 0,
    nome: '',
    descricao: '',
  });

  /****Modal*********************************************** */
  modalService = inject(MdbModalService);
  @ViewChild('modalCategoriaDetalhe') modalCategoriaDetalhe!: TemplateRef<any>;
  modalRef!: MdbModalRef<any>;
  /*************************************************** */

  constructor() {
    this.findAll()
  }

  findAll() {
    this.categoriaService.findAll().subscribe({
      next: (lista: Categoria[]) => {
        this.lista = lista;
      },
      error: (err: { message: any }) => {
        Swal.fire({
          title: 'Erro ao carregar lista de Categorias',
          text: err.message,
          icon: 'error',
          confirmButtonText: 'Fechar',
        });
      },
    });
  }

  // 🔴 Deletar categoria
  deleteById(categoria: Categoria) {
    if (!categoria.id) {
      Swal.fire({
        title: 'Categoria sem ID',
        icon: 'warning',
        confirmButtonText: 'Fechar',
      });
      return;
    }

    Swal.fire({
      title: `Confirma a exclusão da categoria ${categoria.nome}?`,
      icon: 'warning',
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, deletar!',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.categoriaService.delete(categoria.id!).subscribe({ // Use ! para garantir que o ID existe aqui
          next: () => {
            // 1. Remove o item da lista local
            this.lista = this.lista.filter((c) => c.id !== categoria.id);

            Swal.fire({
              title: 'Deletado com sucesso!',
              icon: 'success',
              confirmButtonText: 'OK',
            });
            // Não precisa de findAll() aqui, pois já manipulamos a lista local
          },
          error: (err: { message: any }) => {
            Swal.fire({
              title: 'Erro ao deletar categoria',
              text: err.message,
              icon: 'error',
              confirmButtonText: 'Fechar',
            });
            // Opcional: chamar findAll() em caso de erro para re-sincronizar a lista.
            // this.findAll(); 
          },
        });
      }
    });
  }

  // 🆕 Nova categoria
  new() {
    this.categoriaEdit = new Categoria({
      id: 0,
      nome: '',
      descricao: '',
    });
    this.modalRef = this.modalService.open(this.modalCategoriaDetalhe, {
      modalClass: 'modal-lg modal-dialog-centered'
    });
  }

  // ✏️ Editar categoria
  editById(categoria: Categoria) {
    this.categoriaEdit = Object.assign({}, categoria); // Clona o objeto para evitar referência
    this.modalRef = this.modalService.open(this.modalCategoriaDetalhe, {
      modalClass: 'modal-lg modal-dialog-centered'
    });
  }

  // 🔁 Retorno de criação ou atualização (Lógica Otimizada)
  retornoDetalhes(categoria: Categoria) {
    if (categoria.id && categoria.id > 0) {
      // Atualizar categoria existente
      this.categoriaService.update(categoria).subscribe({
        next: (categoriaAtualizada: Categoria) => {
          // 1. Atualiza a lista localmente
          const index = this.lista.findIndex(c => c.id === categoriaAtualizada.id);
          if (index !== -1) {
            this.lista[index] = categoriaAtualizada;
          }

          Swal.fire({
            title: 'Sucesso!',
            text: 'Categoria atualizada com sucesso.',
            icon: 'success',
            confirmButtonText: 'OK',
          });
          this.modalRef.close();
        },
        error: (err) => {
          Swal.fire({
            title: 'Erro ao atualizar categoria',
            text: err.message,
            icon: 'error',
            confirmButtonText: 'Fechar',
          });
        },
      });
    } else {
      // Criar nova categoria
      this.categoriaService.create(categoria).subscribe({
        next: (novaCategoria: Categoria) => {
          // 1. Adiciona o novo item à lista local (resolve a duplicação se o backend estiver OK)
          this.lista.push(novaCategoria);

          Swal.fire({
            title: 'Cadastrado com sucesso!',
            icon: 'success',
            confirmButtonText: 'OK',
          });
          this.modalRef.close();
        },
        error: (err) => {
          Swal.fire({
            title: 'Erro ao cadastrar categoria',
            text: err.message,
            icon: 'error',
            confirmButtonText: 'Fechar',
          });
        },
      });
    }
  }
}