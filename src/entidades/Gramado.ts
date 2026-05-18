import { Bioma } from "../enums/Bioma";
import { Canteiro } from "./Canteiro";

// Contém os 5 canteiros (um por Bioma) e gerencia fichas e pontuação.
export class Gramado {
  private canteiros: Canteiro[];
  private readonly numJogadores: number;

  constructor(numJogadores: number) {
    this.numJogadores = numJogadores;
    const biomas = Object.values(Bioma);
    this.canteiros = biomas.map((bioma) => new Canteiro(bioma, numJogadores));
  }

  getCanteiro(bioma: Bioma): Canteiro | undefined {
    return this.canteiros.find((c) => c.getBioma() === bioma);
  }

  getCanteiros(): Canteiro[] {
    return [...this.canteiros];
  }

  plantarFicha(bioma: Bioma, jogadorIndice: number): void {
    const canteiro = this.getCanteiro(bioma);
    if (canteiro) {
      canteiro.plantarFicha(jogadorIndice);
    }
  }

  removerFicha(bioma: Bioma, jogadorIndice: number): boolean {
    const canteiro = this.getCanteiro(bioma);
    if (canteiro) {
      return canteiro.removerFicha(jogadorIndice);
    }
    return false;
  }

  // Calcula a pontuação de uma era baseada na dominância de cada canteiro.
  calcularPontuacaoEra(era: number): number[] {
    const pontos = new Array(this.numJogadores).fill(0);

    for (const canteiro of this.canteiros) {
      const dominante = canteiro.calcularDominante();
      if (dominante >= 0) {
        pontos[dominante] += canteiro.getPontuacaoEra(era);
      }
    }

    return pontos;
  }

  resetarFichas(): void {
    for (const canteiro of this.canteiros) {
      canteiro.resetarFichas();
    }
  }
}
