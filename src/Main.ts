import * as readline from "readline";
import { DefesaDoQuintal } from "./entidades/DefesaDoQuintal";
import { Jogador } from "./entidades/Jogador";
import { Esquadrao } from "./entidades/Esquadrao";
import { Carta } from "./entidades/Carta";
import { Bioma } from "./enums/Bioma";
import { EstadoAguardandoJogador } from "./estados/EstadoAguardandoJogador";
import { EstadoFimDeEra } from "./estados/EstadoFimDeEra";
import { EstadoFimDeJogo } from "./estados/EstadoFimDeJogo";

// Ponto de entrada — camada de apresentação via terminal.
class Main {
  private rl: readline.Interface;
  private defesaDoQuintal!: DefesaDoQuintal;

  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  async iniciar(): Promise<void> {
    console.log("╔══════════════════════════════════════════════╗");
    console.log("║     🌻 PLANTS VS. ZOMBIES — GRAMADO 🧟     ║");
    console.log("║    Adaptação de Ethnos para Terminal         ║");
    console.log("╚══════════════════════════════════════════════╝\n");

    const nomes = await this.solicitarJogadores();
    this.defesaDoQuintal = new DefesaDoQuintal(nomes);
    this.defesaDoQuintal.iniciar();

    await this.loopPrincipal();

    this.rl.close();
  }

  // Loop principal do jogo
  private async loopPrincipal(): Promise<void> {
    while (!this.defesaDoQuintal.isJogoTerminado()) {
      // Fim de era — processa automaticamente
      if (this.defesaDoQuintal.getEstadoAtual() instanceof EstadoFimDeEra) {
        this.defesaDoQuintal.getEstadoAtual().executar(this.defesaDoQuintal);
        const proximo = this.defesaDoQuintal.getEstadoAtual().proximoEstado(this.defesaDoQuintal);
        this.defesaDoQuintal.setEstadoAtual(proximo);

        if (proximo instanceof EstadoFimDeJogo) {
          proximo.executar(this.defesaDoQuintal);
          break;
        }
        continue;
      }

      // Exibe estado do turno
      this.defesaDoQuintal.getEstadoAtual().executar(this.defesaDoQuintal);

      const jogador = this.defesaDoQuintal.getJogadorAtual();

      this.exibirGramado();
      this.exibirPacoteDeSementes();
      this.exibirMaoDoJogador(jogador);

      const acao = await this.solicitarAcao(jogador);

      switch (acao) {
        case "1":
          await this.acaoComprarDoPacote();
          break;
        case "2":
          await this.acaoComprarDoPacoteDeSementes();
          break;
        case "3":
          await this.acaoBaixarEsquadrao();
          break;
        default:
          console.log("  ❌ Ação inválida. Tente novamente.");
          continue;
      }
    }
  }

  // Ações do jogador

  private async acaoComprarDoPacote(): Promise<void> {
    if (this.defesaDoQuintal.getPacoteDeSementes().estaVazio()) {
      console.log("  ❌ Pacote de sementes vazio! Compre das sementes disponíveis ou baixe um esquadrão.");
      return;
    }
    this.defesaDoQuintal.comprarCarta();
    this.defesaDoQuintal.proximoJogador();

    if (this.defesaDoQuintal.verificarFimDeEra()) {
      this.defesaDoQuintal.setEstadoAtual(new EstadoFimDeEra());
    }
  }

  private async acaoComprarDoPacoteDeSementes(): Promise<void> {
    const sementesDisponiveis = this.defesaDoQuintal.getPacoteDeSementes().getSementesDisponiveis();
    if (sementesDisponiveis.length === 0) {
      console.log("  ❌ Pacote de sementes vazio!");
      return;
    }

    const indiceStr = await this.perguntar(`  Escolha o índice da carta (0-${sementesDisponiveis.length - 1}): `);
    const indice = parseInt(indiceStr, 10);

    if (isNaN(indice) || indice < 0 || indice >= sementesDisponiveis.length) {
      console.log("  ❌ Índice inválido.");
      return;
    }

    this.defesaDoQuintal.comprarDoPacoteDeSementes(indice);
    this.defesaDoQuintal.proximoJogador();
  }

  private async acaoBaixarEsquadrao(): Promise<void> {
    const jogador = this.defesaDoQuintal.getJogadorAtual();
    const mao = jogador.getMao();

    if (mao.length === 0) {
      console.log("  ❌ Mão vazia! Compre uma carta primeiro.");
      return;
    }

    console.log("\n  Selecione as cartas para o esquadrão (índices separados por vírgula):");
    this.exibirMaoDoJogador(jogador);
    const selecaoStr = await this.perguntar("  Índices: ");
    const indices = selecaoStr.split(",").map((s) => parseInt(s.trim(), 10));

    const maoAtual = jogador.getMao();
    if (indices.some((i) => isNaN(i) || i < 0 || i >= maoAtual.length)) {
      console.log("  ❌ Índices inválidos.");
      return;
    }

    if (new Set(indices).size !== indices.length) {
      console.log("  ❌ Cada carta da mão só pode ser escolhida uma vez.");
      return;
    }

    const esquadrao = new Esquadrao();
    const cartasSelecionadas: Carta[] = indices.map((i) => maoAtual[i]);

    for (const carta of cartasSelecionadas) {
      esquadrao.adicionarCarta(carta);
    }

    console.log("\n  Cartas selecionadas para o esquadrão:");
    cartasSelecionadas.forEach((c, i) => {
      console.log(`    [${i}] ${c.toString()}`);
    });

    const liderStr = await this.perguntar(`  Escolha o líder (0-${cartasSelecionadas.length - 1}): `);
    const liderIdx = parseInt(liderStr, 10);

    if (isNaN(liderIdx) || liderIdx < 0 || liderIdx >= cartasSelecionadas.length) {
      console.log("  ❌ Índice do líder inválido.");
      return;
    }

    esquadrao.definirLider(cartasSelecionadas[liderIdx]);

    this.defesaDoQuintal.baixarEsquadrao(esquadrao);
  }

  // Exibições

  exibirGramado(): void {
    console.log("\n  ┌─────────── GRAMADO ────────────┐");

    const canteiros = this.defesaDoQuintal.getGramado().getCanteiros();
    const jogadores = this.defesaDoQuintal.getJogadores();

    for (const canteiro of canteiros) {
      const bioma = canteiro.getBioma().padEnd(8);
      let fichasStr = "";

      for (let i = 0; i < jogadores.length; i++) {
        const fichas = canteiro.getFichas(i);
        if (fichas > 0) {
          fichasStr += `${jogadores[i].getNome()}:${"🌿".repeat(fichas)} `;
        }
      }

      if (!fichasStr) fichasStr = "(vazia)";
      console.log(`  │ ${bioma} │ ${fichasStr}`);
    }

    console.log("  └─────────────────────────────────┘");
  }

  private exibirPacoteDeSementes(): void {
    const sementesDisponiveis = this.defesaDoQuintal.getPacoteDeSementes().getSementesDisponiveis();
    console.log(`\n  📦 Pacote de Sementes (${sementesDisponiveis.length} cartas):`);

    if (sementesDisponiveis.length === 0) {
      console.log("     (vazio)");
      return;
    }

    sementesDisponiveis.forEach((carta, i) => {
      console.log(`     [${i}] ${carta.toString()}`);
    });

    console.log(`  📚 Cartas no pacote: ${this.defesaDoQuintal.getPacoteDeSementes().getQuantidadeRestante()} restantes`);
  }

  exibirMaoDoJogador(jogador: Jogador): void {
    const mao = jogador.getMao();
    console.log(`\n  🃏 Mão de ${jogador.getNome()} (${mao.length} cartas):`);

    if (mao.length === 0) {
      console.log("     (vazia)");
      return;
    }

    mao.forEach((carta, i) => {
      console.log(`     [${i}] ${carta.toString()}`);
    });
  }

  exibirResultado(): void {
    console.log("\n  📊 Pontuação Final:");
    const jogadores = this.defesaDoQuintal.getJogadores();
    const ordenados = [...jogadores].sort((a, b) => b.getPontuacao() - a.getPontuacao());

    ordenados.forEach((j, i) => {
      const medalha = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : "  ";
      console.log(`  ${medalha} ${j.getNome()}: ${j.getPontuacao()} pontos`);
    });
  }

  // Configuração

  private async solicitarJogadores(): Promise<string[]> {
    const numStr = await this.perguntar("Quantos jogadores? (2-6): ");
    const num = parseInt(numStr, 10);

    if (isNaN(num) || num < 2 || num > 6) {
      console.log("Número inválido. Usando 2 jogadores padrão.");
      return ["Jogador 1", "Jogador 2"];
    }

    const nomes: string[] = [];
    for (let i = 0; i < num; i++) {
      const nome = await this.perguntar(`Nome do jogador ${i + 1}: `);
      nomes.push(nome.trim() || `Jogador ${i + 1}`);
    }

    return nomes;
  }

  solicitarAcao(jogador: Jogador): Promise<string> {
    console.log(`\n  Ações disponíveis para ${jogador.getNome()}:`);
    console.log("    [1] Comprar carta do pacote");
    console.log("    [2] Comprar carta do pacote de sementes");
    console.log("    [3] Baixar um esquadrão");

    return this.perguntar("  Escolha (1/2/3): ");
  }

  // Utilitário

  private perguntar(pergunta: string): Promise<string> {
    return new Promise((resolve) => {
      this.rl.question(pergunta, (resposta) => {
        resolve(resposta);
      });
    });
  }
}

// Execução
const main = new Main();
main.iniciar().catch((err) => {
  console.error("Erro fatal:", err);
  process.exit(1);
});
