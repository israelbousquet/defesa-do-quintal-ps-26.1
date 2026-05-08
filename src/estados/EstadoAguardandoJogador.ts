import { IEstadoDefesaDoQuintal } from "./IEstadoDefesaDoQuintal";
import type { DefesaDoQuintal } from "../entidades/DefesaDoQuintal";

// Estado inicial do turno. Sinaliza que a defesa do quintal aguarda a ação do jogador.
export class EstadoAguardandoJogador implements IEstadoDefesaDoQuintal {
  executar(defesaDoQuintal: DefesaDoQuintal): void {
    const jogador = defesaDoQuintal.getJogadorAtual();
    console.log(`\n═══════════════════════════════════════`);
    console.log(`  Turno de: ${jogador.getNome()}`);
    console.log(`  Era: ${defesaDoQuintal.getEraAtual()} / ${defesaDoQuintal.getTotalEras()}`);
    console.log(`═══════════════════════════════════════`);
  }

  proximoEstado(_defesaDoQuintal: DefesaDoQuintal): IEstadoDefesaDoQuintal {
    return this;
  }
}
