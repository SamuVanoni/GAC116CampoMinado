# 💣 Campo Minado

## 🚀 Sobre o Projeto

Uma releitura moderna do clássico Campo Minado, desenvolvida do zero com HTML, CSS e JavaScript puros (Vanilla). 

Criado como um laboratório prático para aplicar lógica de programação e **Metodologias Ágeis**, o projeto foi construído em ciclos iterativos (Sprints). O jogo oferece uma experiência completa com design em *Dark Mode*, três níveis de dificuldade, algoritmo de abertura em cadeia (*Flood Fill*), sistema de dicas limitadas, um placar de recordes (Top 5) salvo localmente no navegador e acessibilidade total para dispositivos móveis.

## ✨ Funcionalidades

* **Design Responsivo e Dark Mode:** Interface moderna e adaptável para telas menores.
* **3 Níveis de Dificuldade:** Fácil (8x8 - 10 Minas), Médio (16x16 - 40 Minas) e Difícil (16x30 - 99 Minas).
* **Algoritmo de *Flood Fill*:** Abertura automática de áreas vazias em cadeia.
* **Sistema de Bandeiras Clássico:** Marcação de possíveis minas com o botão direito do mouse.
* **Modo Bandeira (Mobile):** Botão de alternância (ON/OFF) na interface que adapta o clique principal para colocar bandeiras, permitindo que usuários de smartphones e tablets joguem perfeitamente.
* **Sistema de Dicas:** Botão com limite de 3 usos por partida que revela uma casa segura aleatória.
* **Cronômetro e Ranking:** Contagem de tempo em tempo real e salvamento dos melhores tempos no Local Storage.

## 📂 Estrutura do Projeto

O código foi organizado separando as responsabilidades para facilitar a manutenção e o estudo:

* **`index.html`**: Responsável pela estrutura semântica da página, abrigando a interface de controles, a barra de status, o contêiner vazio do tabuleiro e a lista de recordes.
* **`style.css`**: Contém toda a estilização visual, incluindo variáveis de cor para o *Dark Mode*, layout responsivo utilizando Flexbox e CSS Grid, e feedbacks visuais de interação (hover e active).
* **`script.js`**: O "motor" do jogo. Gerencia a lógica das matrizes bidimensionais, distribuição randômica de minas, manipulação do DOM, eventos de clique, cronômetro, algoritmo de recursividade e persistência de dados no `localStorage`.

## 🔄 Abordagem de Desenvolvimento (Sprints)

O jogo foi construído utilizando conceitos ágeis, com entregas focadas em evolução contínua:

* **Sprint 1:** MVP visual estático (HTML/CSS) com o tabuleiro base e aplicação do *Dark Mode*.
* **Sprint 2:** Implementação do motor lógico no JS (geração do tabuleiro, distribuição de bombas, contagem de vizinhos).
* **Sprint 3:** Adição da mecânica de bandeiras via clique direito e contador numérico.
* **Sprint 4:** Expansão para múltiplos níveis de dificuldade com recálculo dinâmico do grid.
* **Sprint 5:** Implementação do cronômetro lógico e persistência de dados (Sistema de Ranking).
* **Sprint 6:** Refinamento da experiência do usuário com o sistema de "Dicas" limitadas.
* **Sprint 7:** Adaptação de acessibilidade Mobile com a criação do botão de alternância "Modo Bandeira".

## 🎮 Como Jogar

Você pode jogar a versão final do projeto diretamente no seu navegador de computador ou celular, sem precisar baixar nada!

👉 **[Jogue o Campo Minado aqui!](https://samuvanoni.github.io/GAC116CampoMinado/code/)**

**Instruções:**
1. Escolha a dificuldade no menu superior.
2. Clique/Toque em uma célula para revelá-la (o primeiro clique é sempre seguro!).
3. Use o **botão direito do mouse** para marcar uma mina com uma bandeira 🚩.
4. **Jogando no celular?** Ative o botão **Modo Bandeira: ON** na tela. Com ele ativado, seus toques normais colocarão bandeiras em vez de abrir as casas.
5. Limpe todas as áreas seguras no menor tempo possível para gravar seu nome no Ranking!

## 👤 Autores

| [<img src="https://avatars.githubusercontent.com/u/123120658?v=4" width="100px"><br><sub>@SamuVanoni</sub>](https://github.com/SamuVanoni) |
| :---: |

## 📄 Licença

Este projeto está sob a licença **MIT**. Ele foi desenvolvido estritamente para fins de estudos, pesquisa e aprimoramento prático em programação front-end e metodologias ágeis de desenvolvimento de software. Você é livre para utilizar, modificar e distribuir o código conforme necessário para o seu aprendizado.