import type { DefesaDoQuintal } from "../entidades/DefesaDoQuintal";
import type { Jogador } from "../entidades/Jogador";
import type { Esquadrao } from "../entidades/Esquadrao";

// Interface Strategy para os poderes das plantas.
export interface IPoderPlantaStrategy {
  executar(defesaDoQuintal: DefesaDoQuintal, jogador: Jogador, esquadrao: Esquadrao): void;
}
