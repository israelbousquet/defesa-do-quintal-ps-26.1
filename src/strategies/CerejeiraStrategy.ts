import { IPoderPlantaStrategy } from "./IPoderPlantaStrategy";
import type { DefesaDoQuintal } from "../entidades/DefesaDoQuintal";
import type { Jogador } from "../entidades/Jogador";
import type { Esquadrao } from "../entidades/Esquadrao";

// Poder: Descarta o pacote de sementes e repõe novas cartas do pacote.
export class CerejeiraStrategy implements IPoderPlantaStrategy {
  executar(defesaDoQuintal: DefesaDoQuintal, _jogador: Jogador, _esquadrao: Esquadrao): void {
    const pacoteDeSementes = defesaDoQuintal.getPacoteDeSementes();
    pacoteDeSementes.renovarPacoteDeSementes();
    console.log(`  🍒 Poder da Cerejeira: Pacote de sementes renovado com novas cartas!`);
  }
}
