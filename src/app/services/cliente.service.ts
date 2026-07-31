import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cliente } from '../models/cliente';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private http = inject(HttpClient);
  private API = `${environment.apiUrl}/api/cliente`;

  constructor() { }
  findAll(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(`${this.API}/findAll`);
  }

  findById(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.API}/findById/${id}`);
  }

  create(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(`${this.API}/save`, cliente);
  }

  update(cliente: Cliente): Observable<Cliente> {
    return this.http.put<Cliente>(`${this.API}/update/${cliente.id}`, cliente);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/delete/${id}`);
  }

  // Funcao para vincular o cliente no pedido - pesquisa por nome
  findByNome(nome: string): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(`${this.API}/findByNome/${nome}`);
  }
  //Funcao para vincular o cliente no pedido - pesquisa por cpf ou cnpj
  findByCpfCnpj(cpfCnpj: string): Observable<Cliente | null> {
    return this.http.get<Cliente>(`${this.API}/findByCpfCnpj/${cpfCnpj}`);
  }
}
