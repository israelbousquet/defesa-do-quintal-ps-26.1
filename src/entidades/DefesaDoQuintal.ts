import { Jogador } from "./Jogador";
import { Gramado } from "./Gramado";
import { PacoteDeSementes } from "./PacoteDeSementes";
import { Esquadrao } from "./Esquadrao";
import { Carta } from "./Carta";
import { EstadoAguardandoJogador } from "../estados/EstadoAguardandoJogador";
import { EstadoResolvendoPoder } from "../estados/EstadoResolvendoPoder";
import { Bioma } from "../enums/Bioma";
import { IEstadoDefesaDoQuintal } from "../estados/IEstadoDefesaDoQuintal";

// Controladora central do jogo. Cria e gerencia Gramado, PacoteDeSementes e Jogadores.
// Usa o padrão State para representar as fases do turno.
export class DefesaDoQuintal {
  private jogadores: Jogador[];
  private gramado: Gramado;
  private pacoteDeSementes: PacoteDeSementes;
  private estadoAtual: IEstadoDefesaDoQuintal;
  private jogadorAtualIndice: number;
  private eraAtual: number;
  private totalEras: number;
  private jogoTerminado: boolean;

  constructor(nomesDosJogadores: string[]) {
    if (nomesDosJogadores.length < 2 || nomesDosJogadores.length > 6) {
      throw new Error("A defesa do quintal requer entre 2 e 6 jogadores.");
    }

    this.jogadores = nomesDosJogadores.map((nome) => new Jogador(nome));
    this.gramado = new Gramado(this.jogadores.length);
  this.pacoteDeSementes = new PacoteDeSementes();
    this.estadoAtual = new EstadoAguardandoJogador();
    this.jogadorAtualIndice = 0;
    this.eraAtual = 1;
    this.totalEras = 3;
    this.jogoTerminado = false;
  }

  // Distribui cartas iniciais para cada jogador.
  iniciar(): void {
    console.log(`\n🌿 Plants vs. Zombies — Defesa do Quintal`);
    console.log(`   Jogadores: ${this.jogadores.map((j) => j.getNome()).join(", ")}`);
    console.log(`   Eras: ${this.totalEras}`);
    console.log(`   Cartas no pacote de sementes: ${this.pacoteDeSementes.getQuantidadeRestante()}\n`);

    const cartasIniciais = this.jogadores.length <= 3 ? 5 : 4;
    for (const jogador of this.jogadores) {
      for (let i = 0; i < cartasIniciais; i++) {
        if (!this.pacoteDeSementes.estaVazio()) {
          jogador.adicionarCartaNaMao(this.pacoteDeSementes.comprarCarta());
        }
      }
    }
  }

  getJogadorAtual(): Jogador {
    return this.jogadores[this.jogadorAtualIndice];
  }

  getJogadores(): Jogador[] {
    return this.jogadores;
  }

  getGramado(): Gramado {
    return this.gramado;
  }

  getPacoteDeSementes(): PacoteDeSementes {
    return this.pacoteDeSementes;
  }

  getEstadoAtual(): IEstadoDefesaDoQuintal {
    return this.estadoAtual;
  }

  getEraAtual(): number {
    return this.eraAtual;
  }

  getTotalEras(): number {
    return this.totalEras;
  }

  isJogoTerminado(): boolean {
    return this.jogoTerminado;
  }

  setJogoTerminado(valor: boolean): void {
    this.jogoTerminado = valor;
  }

  setEstadoAtual(estado: IEstadoDefesaDoQuintal): void {
    this.estadoAtual = estado;
  }

  getIndiceJogador(jogador: Jogador): number {
    return this.jogadores.indexOf(jogador);
  }

  proximoJogador(): void {
    this.jogadorAtualIndice = (this.jogadorAtualIndice + 1) % this.jogadores.length;
  }

  // Compra uma carta do topo do pacote de sementes e adiciona à mão do jogador atual.
  comprarCarta(): void {
    const jogador = this.getJogadorAtual();

    if (!this.pacoteDeSementes.estaVazio()) {
      const carta = this.pacoteDeSementes.comprarCarta();
      jogador.adicionarCartaNaMao(carta);
      console.log(`  📥 ${jogador.getNome()} comprou: ${carta.toString()}`);
    } else {
      console.log(`  ❌ Pacote de sementes vazio!`);
    }
  }

  // Compra uma carta específica do pacote de sementes pelo índice.
  comprarDoPacoteDeSementes(indice: number): void {
    const jogador = this.getJogadorAtual();
    const carta = this.pacoteDeSementes.comprarDoPacoteDeSementes(indice);
    jogador.adicionarCartaNaMao(carta);
    console.log(`  📥 ${jogador.getNome()} comprou do pacote de sementes: ${carta.toString()}`);
  }

  /**
   * Fluxo de baixar um esquadrão:
   * 1. Valida o esquadrão
   * 2. Registra no jogador
   * 3. Planta ficha no bioma do líder
   * 4. Resolve poder do líder (State → Strategy)
   * 5. Descarta a mão (ou não, dependendo do líder)
   * 6. Avança para o próximo jogador
   */
  baixarEsquadrao(esquadrao: Esquadrao): boolean {
    if (!esquadrao.validar()) {
      console.log("  ❌ Esquadrão inválido! As cartas devem ter o mesmo Bioma ou a mesma Planta.");
      return false;
    }

    const jogador = this.getJogadorAtual();
    const lider = esquadrao.getLider();
    const biomaLider = lider.getBioma();

    console.log(`  ✅ Esquadrão válido! Líder: ${lider.toString()} | Tamanho: ${esquadrao.getTamanho()}`);

    // Registra o esquadrão e remove as cartas da mão
    jogador.registrarEsquadrao(esquadrao);

    // Planta ficha de defesa no canteiro do bioma do líder
    const jogadorIndice = this.getIndiceJogador(jogador);
    this.gramado.plantarFicha(biomaLider, jogadorIndice);
    console.log(`  🌱 Ficha de defesa plantada em ${biomaLider}`);

    // Transiciona para EstadoResolvendoPoder e executa
    const estadoResolvendo = new EstadoResolvendoPoder(esquadrao);
    this.setEstadoAtual(estadoResolvendo);
    this.estadoAtual.executar(this);

    // Transiciona para EstadoDescartandoMao e executa
    const estadoDescarte = this.estadoAtual.proximoEstado(this);
    this.setEstadoAtual(estadoDescarte);
    this.estadoAtual.executar(this);

    // Avança para o próximo estado
    const proximoEstado = this.estadoAtual.proximoEstado(this);
    this.setEstadoAtual(proximoEstado);

    return true;
  }

  verificarFimDeEra(): boolean {
    return this.pacoteDeSementes.estaVazio();
  }

  verificarFimDeJogo(): boolean {
    return this.eraAtual >= this.totalEras;
  }

  // Prepara a próxima era: incrementa, reseta gramado e redistribui cartas.
  prepararProximaEra(): void {
    this.eraAtual++;

    if (this.eraAtual <= this.totalEras) {
      this.gramado.resetarFichas();
      this.pacoteDeSementes.reiniciar();

      const cartasIniciais = this.jogadores.length <= 3 ? 5 : 4;
      for (const jogador of this.jogadores) {
        jogador.descartarMao();
        for (let i = 0; i < cartasIniciais; i++) {
          if (!this.pacoteDeSementes.estaVazio()) {
            jogador.adicionarCartaNaMao(this.pacoteDeSementes.comprarCarta());
          }
        }
      }

      this.jogadorAtualIndice = 0;

      console.log(`\n  🔄 Era ${this.eraAtual} iniciada! Cartas redistribuídas.`);
    }
  }
}
