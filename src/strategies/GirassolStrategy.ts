import { IPoderPlantaStrategy } from "./IPoderPlantaStrategy";
import type { DefesaDoQuintal } from "../entidades/DefesaDoQuintal";
import type { Jogador } from "../entidades/Jogador";
import type { Esquadrao } from "../entidades/Esquadrao";

// Poder: Compra uma carta extra do pacote de sementes.
export class GirassolStrategy implements IPoderPlantaStrategy {
  executar(defesaDoQuintal: DefesaDoQuintal, jogador: Jogador, _esquadrao: Esquadrao): void {
    const pacoteDeSementes = defesaDoQuintal.getPacoteDeSementes();

    if (!pacoteDeSementes.estaVazio()) {
      const cartaExtra = pacoteDeSementes.comprarCarta();
      jogador.adicionarCartaNaMao(cartaExtra);
      console.log(`  🌻 Poder do Girassol: ${jogador.getNome()} comprou uma carta extra!`);
    } else {
      console.log(`  🌻 Poder do Girassol: Pacote de sementes vazio, sem carta extra.`);
    }
  }
}
