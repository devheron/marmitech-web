import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { Categoria } from '../../../models/categoria';
import { CategoriaService } from '../../../services/categoria.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-categoriasdetails',
  standalone: true,
  imports: [MdbFormsModule, FormsModule],
  templateUrl: './categoriasdetails.component.html',
  styleUrls: ['./categoriasdetails.component.scss']
})
export class CategoriasdetailsComponent {

  @Input('categoria') categoria: Categoria = new Categoria({
    id: 0,
    nome: '',
    descricao: ''
  });

  @Output('retorno') retorno = new EventEmitter<any>();
  @Output() cancelar = new EventEmitter<void>();

  route = inject(ActivatedRoute);
  routerSaver = inject(Router);
  categoriaService = inject(CategoriaService);

  constructor() { }
  categoriaServices = inject(CategoriaService);

  salvar() {
    this.retorno.emit(this.categoria);
  }
}
