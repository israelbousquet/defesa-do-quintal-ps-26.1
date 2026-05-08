import { IEstadoDefesaDoQuintal } from "./IEstadoDefesaDoQuintal";
import type { DefesaDoQuintal } from "../entidades/DefesaDoQuintal";

// Após a última era, totaliza a pontuação final e declara o vencedor.
export class EstadoFimDeJogo implements IEstadoDefesaDoQuintal {
  executar(defesaDoQuintal: DefesaDoQuintal): void {
    const jogadores = defesaDoQuintal.getJogadores();

    console.log(`\n╔══════════════════════════════════════╗`);
    console.log(`║         FIM DE JOGO!                 ║`);
    console.log(`╚══════════════════════════════════════╝`);
    console.log(`\n  📊 Pontuação Final:`);

    let vencedor = jogadores[0];
    for (const jogador of jogadores) {
      console.log(`     ${jogador.getNome()}: ${jogador.getPontuacao()} pontos`);
      if (jogador.getPontuacao() > vencedor.getPontuacao()) {
        vencedor = jogador;
      }
    }

    console.log(`\n  🎉 Vencedor: ${vencedor.getNome()} com ${vencedor.getPontuacao()} pontos!`);
    defesaDoQuintal.setJogoTerminado(true);
  }

  proximoEstado(_defesaDoQuintal: DefesaDoQuintal): IEstadoDefesaDoQuintal {
    return this;
  }
}
