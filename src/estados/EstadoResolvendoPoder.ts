import { IEstadoDefesaDoQuintal } from "./IEstadoDefesaDoQuintal";
import { EstadoDescartandoMao } from "./EstadoDescartandoMao";
import type { DefesaDoQuintal } from "../entidades/DefesaDoQuintal";
import type { Esquadrao } from "../entidades/Esquadrao";

// Ativado após o jogador baixar um esquadrão. Executa o poder do líder via Strategy.
export class EstadoResolvendoPoder implements IEstadoDefesaDoQuintal {
  private esquadrao: Esquadrao;

  constructor(esquadrao: Esquadrao) {
    this.esquadrao = esquadrao;
  }

  executar(defesaDoQuintal: DefesaDoQuintal): void {
    const jogador = defesaDoQuintal.getJogadorAtual();
    const lider = this.esquadrao.getLider();

    console.log(`\n  ⚡ Resolvendo poder do líder: ${lider.toString()}`);
    lider.executarPoder(defesaDoQuintal, jogador, this.esquadrao);
  }

  proximoEstado(_defesaDoQuintal: DefesaDoQuintal): IEstadoDefesaDoQuintal {
    return new EstadoDescartandoMao(this.esquadrao);
  }
}
