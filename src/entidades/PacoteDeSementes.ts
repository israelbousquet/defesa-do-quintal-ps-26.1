import { Carta } from "./Carta";
import { Bioma } from "../enums/Bioma";
import { TipoPlanta } from "../enums/TipoPlanta";
import { IPoderPlantaStrategy } from "../strategies/IPoderPlantaStrategy";
import { GirassolStrategy } from "../strategies/GirassolStrategy";
import { DisparervilhaStrategy } from "../strategies/DisparervilhaStrategy";
import { NozObstaculoStrategy } from "../strategies/NozObstaculoStrategy";
import { CerejeiraStrategy } from "../strategies/CerejeiraStrategy";
import { PlantaCarnivoraStrategy } from "../strategies/PlantaCarnivoraStrategy";

// Gerencia o monte de compra e as sementes disponiveis (cartas expostas).
export class PacoteDeSementes {
  private cartas: Carta[];
  private sementesDisponiveis: Carta[];

  private static readonly TAMANHO_PACOTE = 6;

  constructor() {
    this.cartas = [];
    this.sementesDisponiveis = [];
    this.criarCartas();
    this.embaralhar();
    this.preencherPacoteDeSementes();
  }

  // Cria 50 cartas: 2 copias de cada combinacao Bioma x TipoPlanta.
  private criarCartas(): void {
    const biomas = Object.values(Bioma);
    const tipos = Object.values(TipoPlanta);

    for (const bioma of biomas) {
      for (const tipo of tipos) {
        const strategy = this.criarStrategy(tipo);
        this.cartas.push(new Carta(bioma, tipo, strategy));
        this.cartas.push(new Carta(bioma, tipo, strategy));
      }
    }
  }

  // Mapeia cada TipoPlanta a sua Strategy correspondente.
  private criarStrategy(tipo: TipoPlanta): IPoderPlantaStrategy {
    switch (tipo) {
      case TipoPlanta.GIRASSOL:
        return new GirassolStrategy();
      case TipoPlanta.DISPARERVILHA:
        return new DisparervilhaStrategy();
      case TipoPlanta.NOZ_OBSTACULO:
        return new NozObstaculoStrategy();
      case TipoPlanta.CEREJEIRA:
        return new CerejeiraStrategy();
      case TipoPlanta.PLANTA_CARNIVORA:
        return new PlantaCarnivoraStrategy();
    }
  }

  embaralhar(): void {
    for (let i = this.cartas.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cartas[i], this.cartas[j]] = [this.cartas[j], this.cartas[i]];
    }
  }

  comprarCarta(): Carta {
    const carta = this.cartas.pop();
    if (!carta) {
      throw new Error("Pacote de sementes vazio! Nao e possivel comprar carta.");
    }
    return carta;
  }

  comprarDoPacoteDeSementes(indice: number): Carta {
    if (indice < 0 || indice >= this.sementesDisponiveis.length) {
      throw new Error(`Indice invalido para as sementes disponiveis: ${indice}`);
    }
    const carta = this.sementesDisponiveis.splice(indice, 1)[0];
    return carta;
  }

  descartarParaPacoteDeSementes(carta: Carta): void {
    this.sementesDisponiveis.push(carta);
  }

  // Renova o pacote de sementes: cartas atuais voltam ao monte e novas sao compradas.
  renovarPacoteDeSementes(): void {
    this.cartas.unshift(...this.sementesDisponiveis);
    this.sementesDisponiveis = [];
    this.preencherPacoteDeSementes();
  }

  private preencherPacoteDeSementes(): void {
    while (this.sementesDisponiveis.length < PacoteDeSementes.TAMANHO_PACOTE && this.cartas.length > 0) {
      this.sementesDisponiveis.push(this.cartas.pop()!);
    }
  }

  estaVazio(): boolean {
    return this.cartas.length === 0;
  }

  getSementesDisponiveis(): Carta[] {
    return [...this.sementesDisponiveis];
  }

  getQuantidadeRestante(): number {
    return this.cartas.length;
  }

  // Reinicializa para uma nova era.
  reiniciar(): void {
    this.cartas = [];
    this.sementesDisponiveis = [];
    this.criarCartas();
    this.embaralhar();
    this.preencherPacoteDeSementes();
  }
}