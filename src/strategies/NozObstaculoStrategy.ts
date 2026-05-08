import { IPoderPlantaStrategy } from "./IPoderPlantaStrategy";
import type { DefesaDoQuintal } from "../entidades/DefesaDoQuintal";
import type { Jogador } from "../entidades/Jogador";
import type { Esquadrao } from "../entidades/Esquadrao";

// Poder passivo: o jogador NÃO descarta a mão (tratado no EstadoDescartandoMao).
export class NozObstaculoStrategy implements IPoderPlantaStrategy {
  executar(_defesaDoQuintal: DefesaDoQuintal, jogador: Jogador, _esquadrao: Esquadrao): void {
    console.log(`  🥜 Poder da Noz-Obstáculo: ${jogador.getNome()} mantém a mão!`);
  }
}
