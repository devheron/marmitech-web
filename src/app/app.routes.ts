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

import { PedidosFilaComponent } from './components/pedidos/pedidos-fila/pedidos-fila.component';
import { MeusPedidosComponent } from './components/pedidos/meus-pedidos/meus-pedidos.component';

import { roleGuard } from './auth/role.guard';
import { LoginComponent } from './components/layout/login/login.component';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },

    // AREA DO CLIENTE
    {
        path: 'meus-pedidos',
        component: PrincipalComponent,
        children: [
            {
                path: '',
                component: MeusPedidosComponent,
                canActivate: [roleGuard],
                data: { roles: ['CLIENTE', 'ADMIN'] }
            }
        ]
    },

    // AREA INTERNA
    {
        path: 'admin',
        component: PrincipalComponent,
        children: [
            {
                path: 'produtos',
                component: ProdutoslistComponent,
                canActivate: [roleGuard],
                data: { roles: ['ADMIN', 'FUNCIONARIO'] }
            },
            {
                path: 'produtos/new',
                component: ProdutosdetailsComponent,
                canActivate: [roleGuard],
                data: { roles: ['ADMIN'] }
            },
            {
                path: 'categorias',
                component: CategoriaslistComponent,
                canActivate: [roleGuard],
                data: { roles: ['ADMIN', 'FUNCIONARIO'] }
            },
            {
                path: 'cliente',
                component: ClientelistComponent,
                canActivate: [roleGuard],
                data: { roles: ['ADMIN', 'FUNCIONARIO'] }
            },
            {
                path: 'pedidos',
                component: PedidoslistComponent,
                canActivate: [roleGuard],
                data: { roles: ['ADMIN', 'FUNCIONARIO'] }
            },
            {
                path: 'pedidos/fila',
                component: PedidosFilaComponent,
                canActivate: [roleGuard],
                data: { roles: ['ADMIN', 'FUNCIONARIO'] }
            },
            {
                path: 'pedidos/pedidosItem',
                component: PedidosItemlistComponent,
                canActivate: [roleGuard],
                data: { roles: ['ADMIN', 'FUNCIONARIO'] }
            },
            {
                path: 'historicos',
                component: HistoricolistComponent,
                canActivate: [roleGuard],
                data: { roles: ['ADMIN', 'FUNCIONARIO'] }
            },
            {
                path: 'usuarios',
                component: UsuariolistComponent,
                canActivate: [roleGuard],
                data: { roles: ['ADMIN'] }
            }
        ]
    },

    { path: '**', redirectTo: 'login' }
];