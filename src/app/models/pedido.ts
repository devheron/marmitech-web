import { HistoricoCompras } from "./historico-compras";
import { PedidoItem } from "./pedido-item";

export class Pedido {
    id!: number;
    nomeCliente!: string;
    status!: string;
    enderecoEntrega!: string;
    dataPedido!: string;
    pedidoItems!: PedidoItem[];
    valorTotal!: number;
    historicos!: HistoricoCompras[];

    constructor(data: any) {
        this.id = data.id;
        this.nomeCliente = data.nomeCliente;
        this.status = data.status;
        this.enderecoEntrega = data.enderecoEntrega;
        this.dataPedido = data.dataPedido;
        this.pedidoItems = data.pedidoItems;
        this.valorTotal = data.valorTotal;
        this.historicos = data.historicos;
    }
}