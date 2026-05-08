import { Carta } from "./Carta";
import { Esquadrao } from "./Esquadrao";

// Mantém a mão de cartas, o histórico de esquadrões jogados e a pontuação.
export class Jogador {
  private nome: string;
  private mao: Carta[];
  private esquadroesJogados: Esquadrao[];
  private pontuacao: number;

  constructor(nome: string) {
    this.nome = nome;
    this.mao = [];
    this.esquadroesJogados = [];
    this.pontuacao = 0;
  }

  getNome(): string {
    return this.nome;
  }

  getMao(): Carta[] {
    return [...this.mao];
  }

  getPontuacao(): number {
    return this.pontuacao;
  }

  getEsquadroesJogados(): Esquadrao[] {
    return [...this.esquadroesJogados];
  }

  adicionarCartaNaMao(carta: Carta): void {
    this.mao.push(carta);
  }

  removerCartaDaMao(carta: Carta): void {
    const indice = this.mao.indexOf(carta);
    if (indice !== -1) {
      this.mao.splice(indice, 1);
    }
  }

  // Descarta todas as cartas da mão, retornando-as para o pacote de sementes.
  descartarMao(): Carta[] {
    const descartadas = [...this.mao];
    this.mao = [];
    return descartadas;
  }

  // Registra o esquadrão e remove as cartas correspondentes da mão.
  registrarEsquadrao(esquadrao: Esquadrao): void {
    this.esquadroesJogados.push(esquadrao);

    for (const carta of esquadrao.getCartas()) {
      this.removerCartaDaMao(carta);
    }
  }

  adicionarPontos(pontos: number): void {
    this.pontuacao += pontos;
  }
}
