import { Bioma } from "../enums/Bioma";
import { TipoPlanta } from "../enums/TipoPlanta";
import { IPoderPlantaStrategy } from "../strategies/IPoderPlantaStrategy";
import type { Jogador } from "./Jogador";
import type { Esquadrao } from "./Esquadrao";
import { DefesaDoQuintal } from "./DefesaDoQuintal";

// Cada carta possui um Bioma, um TipoPlanta e uma Strategy de poder.
export class Carta {
  private bioma: Bioma;
  private tipoPlanta: TipoPlanta;
  private poderStrategy: IPoderPlantaStrategy;

  constructor(bioma: Bioma, tipoPlanta: TipoPlanta, poderStrategy: IPoderPlantaStrategy) {
    this.bioma = bioma;
    this.tipoPlanta = tipoPlanta;
    this.poderStrategy = poderStrategy;
  }

  getBioma(): Bioma {
    return this.bioma;
  }

  getTipoPlanta(): TipoPlanta {
    return this.tipoPlanta;
  }

  // Delega a execução do poder à strategy concreta.
  executarPoder(defesaDoQuintal: DefesaDoQuintal, jogador: Jogador, esquadrao: Esquadrao): void {
    this.poderStrategy.executar(defesaDoQuintal, jogador, esquadrao);
  }

  toString(): string {
    return `[${this.tipoPlanta} | ${this.bioma}]`;
  }
}
