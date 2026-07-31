import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HistoricoCompras } from '../models/historico-compras';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class HistoricoComprasService {
  private http = inject(HttpClient);
  private API = `${environment.apiUrl}/historicoCompra`;

  constructor() { }

  findAll(): Observable<HistoricoCompras[]> {
    return this.http.get<HistoricoCompras[]>(this.API)
  }

  findById(id: number): Observable<HistoricoCompras> {
    return this.http.get<HistoricoCompras>(`${this.API}/findById/${id}`);
  }

  deleteById(id: number): Observable<any> {
    return this.http.delete<HistoricoCompras>(`${this.API}/${id}`);
  }

  update(historico: HistoricoCompras): Observable<HistoricoCompras> {
    return this.http.put<HistoricoCompras>(`${this.API}/${historico.id}`, historico);
  }

  save(historico: HistoricoCompras): Observable<HistoricoCompras> {
    return this.http.post<HistoricoCompras>(this.API, historico);
  }

  findByData(data: string): Observable<HistoricoCompras[]> {
    return this.http.get<HistoricoCompras[]>(`${this.API}/findByDataEvento`);
  }
}