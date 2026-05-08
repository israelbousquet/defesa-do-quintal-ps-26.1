import { IPoderPlantaStrategy } from "./IPoderPlantaStrategy";
import type { DefesaDoQuintal } from "../entidades/DefesaDoQuintal";
import type { Jogador } from "../entidades/Jogador";
import type { Esquadrao } from "../entidades/Esquadrao";

// Poder: Remove uma ficha de defesa de um oponente no canteiro do líder.
export class PlantaCarnivoraStrategy implements IPoderPlantaStrategy {
  executar(defesaDoQuintal: DefesaDoQuintal, jogador: Jogador, esquadrao: Esquadrao): void {
    const bioma = esquadrao.getLider().getBioma();
    const jogadores = defesaDoQuintal.getJogadores();
    const jogadorIndice = defesaDoQuintal.getIndiceJogador(jogador);
    const gramado = defesaDoQuintal.getGramado();
    const canteiro = gramado.getCanteiro(bioma);

    if (!canteiro) {
      console.log(`  🪴 Planta Carnívora: Canteiro ${bioma} não encontrado.`);
      return;
    }

    // Encontra oponentes com fichas no canteiro alvo
    const oponentesComFichas: number[] = [];
    for (let i = 0; i < jogadores.length; i++) {
      if (i !== jogadorIndice && canteiro.getFichas(i) > 0) {
        oponentesComFichas.push(i);
      }
    }

    if (oponentesComFichas.length === 0) {
      console.log(`  🪴 Planta Carnívora: Nenhum oponente tem fichas em ${bioma}.`);
      return;
    }

    // Remove ficha do primeiro oponente encontrado
    const alvoIndice = oponentesComFichas[0];
    const removido = gramado.removerFicha(bioma, alvoIndice);

    if (removido) {
      console.log(
        `  🪴 Planta Carnívora: Removeu ficha de ${jogadores[alvoIndice].getNome()} em ${bioma}!`
      );
    }
  }
}
