import { IPoderPlantaStrategy } from "./IPoderPlantaStrategy";
import type { DefesaDoQuintal } from "../entidades/DefesaDoQuintal";
import type { Jogador } from "../entidades/Jogador";
import type { Esquadrao } from "../entidades/Esquadrao";

// Poder: Planta uma ficha de defesa adicional no mesmo canteiro.
export class DisparervilhaStrategy implements IPoderPlantaStrategy {
  executar(defesaDoQuintal: DefesaDoQuintal, jogador: Jogador, esquadrao: Esquadrao): void {
    const bioma = esquadrao.getLider().getBioma();
    const jogadorIndice = defesaDoQuintal.getIndiceJogador(jogador);

    defesaDoQuintal.getGramado().plantarFicha(bioma, jogadorIndice);
    console.log(`  🌱 Poder da Disparervilha: Ficha de defesa adicional em ${bioma}!`);
  }
}
