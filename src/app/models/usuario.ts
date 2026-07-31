

export class Usuario {
    id!: number;
    nome!: string;
    email!: string;
    senha!: string;
    cargo!: string;
    dataCriacao!: string;

    constructor(data: any) {
        this.id = data.id || data.usuarioId || 0;
        this.nome = data.nome || '';
        this.email = data.email || '';
        this.senha = data.senha || '';
        this.cargo = data.cargo || '';
        this.dataCriacao = data.dataCriacao || data.data_criacao || '';
    }

}
