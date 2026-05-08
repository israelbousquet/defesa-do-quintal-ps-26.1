import { IEstadoDefesaDoQuintal } from "./IEstadoDefesaDoQuintal";
import { EstadoAguardandoJogador } from "./EstadoAguardandoJogador";
import { EstadoFimDeJogo } from "./EstadoFimDeJogo";
import type { DefesaDoQuintal } from "../entidades/DefesaDoQuintal";

// Ativado quando o pacote de sementes acaba. Pontua os canteiros e prepara a próxima era.
export class EstadoFimDeEra implements IEstadoDefesaDoQuintal {
  executar(defesaDoQuintal: DefesaDoQuintal): void {
    const eraAtual = defesaDoQuintal.getEraAtual();
    console.log(`\n╔══════════════════════════════════════╗`);
    console.log(`║        FIM DA ERA ${eraAtual}                 ║`);
    console.log(`╚══════════════════════════════════════╝`);

    const gramado = defesaDoQuintal.getGramado();
    const pontuacaoEra = gramado.calcularPontuacaoEra(eraAtual);
    const jogadores = defesaDoQuintal.getJogadores();

    for (let i = 0; i < jogadores.length; i++) {
      if (pontuacaoEra[i] > 0) {
        jogadores[i].adicionarPontos(pontuacaoEra[i]);
        console.log(`  🏆 ${jogadores[i].getNome()}: +${pontuacaoEra[i]} pontos (total: ${jogadores[i].getPontuacao()})`);
      }
    }

    defesaDoQuintal.prepararProximaEra();
  }

  proximoEstado(defesaDoQuintal: DefesaDoQuintal): IEstadoDefesaDoQuintal {
    if (defesaDoQuintal.verificarFimDeJogo()) {
      return new EstadoFimDeJogo();
    }
    return new EstadoAguardandoJogador();
  }
}
