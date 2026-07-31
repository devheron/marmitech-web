export class Categoria {
    id!: number;
    nome!: string;
    descricao!: string;

    constructor( data: any ) {
        this.id = data?.id || data?.categoriaId;
        this.nome = data?.nome;
        this.descricao = data?.descricao;
    }
}



