# Defesa do Quintal - Plants vs. Zombies

Projeto academico desenvolvido na disciplina Projeto de Software.

Defesa do Quintal e um jogo de terminal inspirado em Ethnos, com tema Plants vs. Zombies. A ideia do projeto e disputar o dominio de canteiros do gramado ao longo de 3 eras, usando cartas, esquadroes e poderes especiais de plantas.

## Visao geral

No jogo, cada participante pode comprar cartas ou baixar um esquadrao. Ao baixar um esquadrao, o jogador escolhe um lider, planta uma ficha de defesa no bioma correspondente e ativa o poder da planta escolhida.

Os poderes das plantas ajudam a mudar o ritmo da partida:

- Girassol compra uma carta extra.
- Disparervilha planta uma ficha adicional.
- Noz-Obstaculo permite manter a mao.
- Cerejeira renova as sementes disponiveis.
- Planta Carnivora remove uma ficha de um oponente.

## Tecnologias utilizadas

- Node.js
- TypeScript
- ts-node
- PlantUML

## Requisitos

- Node.js 18 ou superior
- npm instalado

## Como inicializar o projeto

Na raiz do repositorio, instale as dependencias:

```bash
npm install
```

Para executar o jogo em modo de desenvolvimento:

```bash
npm run dev
```

Tambem e possivel iniciar com:

```bash
npm start
```

Para gerar a compilacao TypeScript:

```bash
npm run build
```

## Tema do projeto

Defesa do Quintal usa o universo de Plants vs. Zombies como identidade visual e conceitual do jogo. Os biomas, as plantas e os poderes foram adaptados para um contexto de jogo de cartas e controle de territorio em terminal.