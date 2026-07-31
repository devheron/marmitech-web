export class PedidoItem {
    id!: number;
    pedidoId!: number;
    produtoId!: number;
    clienteNome!: string;
    produtoNome!: string;
    quantidade!: number;
    precoUnitarioPedido!: number;
    subtotal!: number; 

    constructor(data : any) {
        this.id = data.id;  
        this.pedidoId = data.pedidoId;
        this.produtoId = data.produtoId;
        this.clienteNome = data.clienteNome;
        this.produtoNome = data.produtoNome;
        this.quantidade = data.quantidade;
        this.precoUnitarioPedido = data.precoUnitarioPedido;
        this.subtotal = data.subtotal;
    }
}
