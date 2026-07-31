export class Produto {
    id!: number;
    nome!: string;
    descricao!: string;
    categoria!: string;
    dataCadastro!: string;
    precoUnitario!: number;
    estoque!: number;
    sku!: string;

    constructor( data: any ) {
        this.id = data.id;
        this.nome = data.nome;
        this.descricao = data.descricao;
        this.categoria = data.categoria;
        this.dataCadastro = data.dataCadastro;
        this.precoUnitario = data.precoUnitario;
        this.estoque = data.estoque;
        this.sku = data.sku;
    }
}
