import { Routes } from '@angular/router';
import { PrincipalComponent } from './components/layout/principal/principal.component';

import { ProdutoslistComponent } from './components/produtos/produtoslist/produtoslist.component';
import { ProdutosdetailsComponent } from './components/produtos/produtosdetails/produtosdetails.component';

import { CategoriaslistComponent } from './components/categorias/categoriaslist/categoriaslist.component';
import { CategoriasdetailsComponent } from './components/categorias/categoriasdetails/categoriasdetails.component';

import { PedidoslistComponent } from './components/pedidos/pedidoslist/pedidoslist.component';
import { PedidosdetailsComponent } from './components/pedidos/pedidosdetails/pedidosdetails.component';
import { PedidosItemlistComponent } from './components/pedidosItem/pedidos-itemlist/pedidos-itemlist.component';

import { PedidosItemdetailsComponent } from './components/pedidosItem/pedidos-itemdetails/pedidos-itemdetails.component';

import { HistoricolistComponent } from './components/hisotrico/historicolist/historicolist.component';
import { HistoricodetailsComponent } from './components/hisotrico/historicodetails/historicodetails.component';


import { ClientelistComponent } from './components/cliente/clientelist/clientelist.component';
import { ClientedetailsComponent } from './components/cliente/clientedetails/clientedetails.component';

import { UsuariolistComponent } from './components/usuario/usuariolist/usuariolist.component';
import { UsuariodetailsComponent } from './components/usuario/usuariodetails/usuariodetails.component';
import { PedidosFilaComponent } from './components/pedidos/pedidos-fila/pedidos-fila.component'; // Importe o novo componente
import { roleGuard } from './auth/role.guard';

import { LoginComponent } from './components/layout/login/login.component';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    {
        path: 'admin',
        component: PrincipalComponent,
        children: [
            // PRODUTOS (Só ADMIN)
            {
                path: 'produtos',
                component: ProdutoslistComponent,
                canActivate: [roleGuard],
                data: { roles: ['ADMIN'] }
            },
            {
                path: 'produtos/new',
                component: ProdutosdetailsComponent,
                canActivate: [roleGuard],
                data: { roles: ['ADMIN'] }
            },

            // PEDIDOS (ADMIN e CAIXA)
            {
                path: 'pedidos',
                component: PedidoslistComponent,
                canActivate: [roleGuard],
                data: { roles: ['ADMIN', 'CAIXA'] }
            },

            // FILA (ADMIN, CAIXA e COZINHA)
            {
                path: 'pedidos/fila',
                component: PedidosFilaComponent,
                canActivate: [roleGuard],
                data: { roles: ['ADMIN', 'CAIXA', 'COZINHA'] }
            },

            {
                path: 'pedidos/pedidosItem',
                component: PedidosItemlistComponent,
                canActivate: [roleGuard],
                data: { roles: ['ADMIN', 'CAIXA'] }
            },

            // HISTÓRICOS (ADMIN, CAIXA e COZINHA)
            {
                path: 'historicos',
                component: HistoricolistComponent,
                canActivate: [roleGuard],
                data: { roles: ['ADMIN', 'CAIXA', 'COZINHA'] }
            },

            // CLIENTES
            {
                path: 'cliente',
                component: ClientelistComponent,
                canActivate: [roleGuard],
                data: { roles: ['ADMIN', 'CAIXA'] }
            },

            // CATEGORIAS (Só ADMIN)
            {
                path: 'categorias',
                component: CategoriaslistComponent,
                canActivate: [roleGuard],
                data: { roles: ['ADMIN'] }
            },

            // USUÁRIOS (ADMIN e CAIXA - conforme seu pedido)
            {
                path: 'usuarios',
                component: UsuariolistComponent,
                canActivate: [roleGuard],
                data: { roles: ['ADMIN', 'CAIXA'] }
            },

        ]
    }
];