// app/services/pedido.service.ts
import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pedido } from '../models/pedido';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  API = `${environment.apiUrl}/api/pedido`;
  http = inject(HttpClient);

  constructor() { }

  findAll(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(this.API);
  }

  findById(id: number): Observable<Pedido> {
    return this.http.get<Pedido>(`${this.API}/findById/${id}`);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/delete/${id}`);
  }

  save(pedido: Pedido): Observable<Pedido> {
    return this.http.post<Pedido>(`${this.API}/save`, pedido);
  }

  update(pedido: Pedido): Observable<Pedido> {
    return this.http.put<Pedido>(`${this.API}/update/${pedido.id}`, pedido);
  }

  findByStatus(status: string): Observable<Pedido[]> {
    let params = new HttpParams().set('status', status);
    return this.http.get<Pedido[]>(`${this.API}/findByStatus`, { params });
  }
}