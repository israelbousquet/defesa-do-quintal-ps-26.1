import { Carta } from "./Carta";

// Agrupamento de cartas jogado pelo jogador.
// Valida se todas as cartas compartilham o mesmo Bioma ou o mesmo TipoPlanta.
export class Esquadrao {
  private cartas: Carta[];
  private lider!: Carta;

  constructor() {
    this.cartas = [];
  }

  adicionarCarta(carta: Carta): void {
    this.cartas.push(carta);
  }

  definirLider(carta: Carta): void {
    if (!this.cartas.includes(carta)) {
      throw new Error("O líder precisa ser uma das cartas do esquadrão.");
    }
    this.lider = carta;
  }

  getLider(): Carta {
    return this.lider;
  }

  getCartas(): Carta[] {
    return [...this.cartas];
  }

  getTamanho(): number {
    return this.cartas.length;
  }

  // Valida o esquadrão: todas as cartas devem ter o mesmo Bioma OU o mesmo TipoPlanta.
  validar(): boolean {
    if (this.cartas.length === 0 || !this.lider) {
      return false;
    }

    const primeiroBioma = this.cartas[0].getBioma();
    const mesmoBioma = this.cartas.every((c) => c.getBioma() === primeiroBioma);
    if (mesmoBioma) return true;

    const primeiroTipo = this.cartas[0].getTipoPlanta();
    const mesmoTipo = this.cartas.every((c) => c.getTipoPlanta() === primeiroTipo);
    return mesmoTipo;
  }
}
