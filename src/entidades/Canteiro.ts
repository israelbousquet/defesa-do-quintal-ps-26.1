import { Bioma } from "../enums/Bioma";

// Representa um canteiro do gramado (um Bioma).
// Rastreia fichas de defesa por jogador e a pontuação por era.
export class Canteiro {
  private bioma: Bioma;
  private fichasPorJogador: number[];
  private tabelaPontuacao: number[];

  constructor(bioma: Bioma, numJogadores: number) {
    this.bioma = bioma;
    this.fichasPorJogador = new Array(numJogadores).fill(0);
    this.tabelaPontuacao = this.definirTabelaPontuacao(bioma);
  }

  private definirTabelaPontuacao(bioma: Bioma): number[] {
    switch (bioma) {
      case Bioma.DIA:
        return [4, 6, 8];
      case Bioma.NOITE:
        return [4, 6, 9];
      case Bioma.PISCINA:
        return [5, 7, 9];
      case Bioma.TELHADO:
        return [5, 7, 10];
      case Bioma.NEVOA:
        return [6, 8, 10];
    }
  }

  getBioma(): Bioma {
    return this.bioma;
  }

  getFichas(jogadorIndice: number): number {
    return this.fichasPorJogador[jogadorIndice] || 0;
  }

  plantarFicha(jogadorIndice: number): void {
    this.fichasPorJogador[jogadorIndice]++;
  }

  removerFicha(jogadorIndice: number): boolean {
    if (this.fichasPorJogador[jogadorIndice] > 0) {
      this.fichasPorJogador[jogadorIndice]--;
      return true;
    }
    return false;
  }

  // Retorna o índice do jogador com mais fichas. Empates e ausência de fichas retornam -1.
  calcularDominante(): number {
    let maxFichas = 0;
    let dominante = -1;
    let houveEmpate = false;

    for (let i = 0; i < this.fichasPorJogador.length; i++) {
      const fichasJogador = this.fichasPorJogador[i];

      if (fichasJogador > maxFichas) {
        maxFichas = fichasJogador;
        dominante = i;
        houveEmpate = false;
        continue;
      }

      if (fichasJogador > 0 && fichasJogador === maxFichas) {
        houveEmpate = true;
      }
    }

    return houveEmpate ? -1 : dominante;
  }

  getPontuacaoEra(era: number): number {
    const indice = era - 1;
    if (indice >= 0 && indice < this.tabelaPontuacao.length) {
      return this.tabelaPontuacao[indice];
    }
    return 0;
  }

  resetarFichas(): void {
    this.fichasPorJogador.fill(0);
  }
}
