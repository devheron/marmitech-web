import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PedidoItem } from '../models/pedido-item';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PedidoItemService {

  http = inject(HttpClient);

  API = `${environment.apiUrl}/pedidoItem`;

  constructor() { }

  findall(): Observable<PedidoItem[]> {
    return this.http.get<PedidoItem[]>(`${this.API}/findAll`);
  }

  findById(id: number): Observable<PedidoItem>{
    return this.http.get<PedidoItem>(`${this.API}/${id}`);
  }

  save (pedidoItem: PedidoItem): Observable<PedidoItem>{
    return this.http.post<PedidoItem>(`${this.API}/save`, pedidoItem);
  }

  delete (id: number): Observable<string>{
    return this.http.delete<string>(`${this.API}/delete/${id}`, {responseType: 'text' as 'json'});
  }

  update(pedidoItem: PedidoItem): Observable<PedidoItem>{
    return this.http.put<PedidoItem>(`${this.API}/update/${pedidoItem.id}`, pedidoItem);
  }
}
