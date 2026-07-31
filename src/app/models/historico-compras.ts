import { Cliente } from "./cliente";
import { Pedido } from "./pedido";

export class HistoricoCompras {
    id!: number;
    dataEvento!: string;
    descricao!: string;
    produtos!: string;
    clientes!: Cliente[];
    pedidos!: Pedido[];
}
