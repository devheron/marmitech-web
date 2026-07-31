export class Cliente {
 id: number;
  nome: string;
  email: string;
  telefone: string;
  cpfCnpj: string;
  endereco: string;
  dataCadastro: string;

  constructor(data: any) {
    this.id = data.id;
    this.nome = data.nome;
    this.email = data.email;
    this.telefone = data.telefone;
    this.cpfCnpj = data.cpfCnpj;
    this.endereco = data.endereco;
    this.dataCadastro = data.dataCadastro;
  }
}
