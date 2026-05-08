import type { DefesaDoQuintal } from "../entidades/DefesaDoQuintal";

// Interface do padrão State para as fases do turno.
export interface IEstadoDefesaDoQuintal {
  executar(defesaDoQuintal: DefesaDoQuintal): void;
  proximoEstado(defesaDoQuintal: DefesaDoQuintal): IEstadoDefesaDoQuintal;
}
