import { IEstadoDefesaDoQuintal } from "./IEstadoDefesaDoQuintal";
import { EstadoAguardandoJogador } from "./EstadoAguardandoJogador";
import { EstadoFimDeEra } from "./EstadoFimDeEra";
import { TipoPlanta } from "../enums/TipoPlanta";
import type { DefesaDoQuintal } from "../entidades/DefesaDoQuintal";
import type { Esquadrao } from "../entidades/Esquadrao";

// Fase de descarte da mão após baixar um esquadrão.
// Exceção: Noz-Obstáculo pula o descarte.
export class EstadoDescartandoMao implements IEstadoDefesaDoQuintal {
  private esquadrao: Esquadrao;

  constructor(esquadrao: Esquadrao) {
    this.esquadrao = esquadrao;
  }

  executar(defesaDoQuintal: DefesaDoQuintal): void {
    const jogador = defesaDoQuintal.getJogadorAtual();
    const lider = this.esquadrao.getLider();
    const tipoLider = lider.getTipoPlanta();

    // Noz-Obstáculo: poder passivo — jogador mantém a mão
    if (tipoLider === TipoPlanta.NOZ_OBSTACULO) {
      console.log(`  🥜 Noz-Obstáculo: ${jogador.getNome()} mantém a mão!`);
      return;
    }

    // Caso padrão: descarta toda a mão para o pacote de sementes
    const cartasDescartadas = jogador.descartarMao();
    const pacoteDeSementes = defesaDoQuintal.getPacoteDeSementes();

    for (const carta of cartasDescartadas) {
      pacoteDeSementes.descartarParaPacoteDeSementes(carta);
    }

    if (cartasDescartadas.length > 0) {
      console.log(`  🗑️  ${jogador.getNome()} descartou ${cartasDescartadas.length} carta(s) para o pacote de sementes.`);
    }
  }

  proximoEstado(defesaDoQuintal: DefesaDoQuintal): IEstadoDefesaDoQuintal {
    defesaDoQuintal.proximoJogador();

    if (defesaDoQuintal.verificarFimDeEra()) {
      return new EstadoFimDeEra();
    }

    return new EstadoAguardandoJogador();
  }
}
