// Configurações fixas para esta fase (8x8 com 10 bombas)
const ROWS = 8;
const COLS = 8;
const BOMBS = 10;

// Variáveis de controle do jogo
let board = [];
let gameOver = false;
let firstClick = true;
let cellsRevealed = 0;

// Elementos do HTML
const boardEl = document.getElementById('board');
const btnRestart = document.getElementById('btn-restart');

// 1. Inicia ou reinicia a partida
function initGame() {
    gameOver = false;
    firstClick = true;
    cellsRevealed = 0;
    board = [];
    boardEl.innerHTML = ''; // Limpa o tabuleiro visual

    // Cria a matriz lógica e os elementos visuais
    for (let r = 0; r < ROWS; r++) {
        let row = [];
        for (let c = 0; c < COLS; c++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            
            // Evento de clique para revelar a célula
            cell.addEventListener('click', () => handleCellClick(r, c));

            boardEl.appendChild(cell);
            
            row.push({
                element: cell,
                isBomb: false,
                isRevealed: false,
                neighborBombs: 0
            });
        }
        board.push(row);
    }
}

// 2. Espalha as bombas (garantindo que o 1º clique seja seguro)
function placeBombs(excludeRow, excludeCol) {
    let bombsPlaced = 0;
    
    while (bombsPlaced < BOMBS) {
        let r = Math.floor(Math.random() * ROWS);
        let c = Math.floor(Math.random() * COLS);
        
        // Evita colocar bomba no local do primeiro clique ou onde já tem bomba
        if (!board[r][c].isBomb && !(r === excludeRow && c === excludeCol)) {
            board[r][c].isBomb = true;
            bombsPlaced++;
        }
    }
    calculateNeighbors();
}

// 3. Calcula quantas bombas existem ao redor de cada célula segura
function calculateNeighbors() {
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            if (board[r][c].isBomb) continue;
            
            let count = 0;
            // Checa os 8 vizinhos
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    let nr = r + i, nc = c + j;
                    if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) {
                        if (board[nr][nc].isBomb) count++;
                    }
                }
            }
            board[r][c].neighborBombs = count;
        }
    }
}

// 4. Lida com o clique do jogador
function handleCellClick(r, c) {
    if (gameOver || board[r][c].isRevealed) return;

    // No primeiro clique, gera as bombas
    if (firstClick) {
        firstClick = false;
        placeBombs(r, c);
    }

    // Se clicou na bomba, perdeu
    if (board[r][c].isBomb) {
        triggerGameOver(false);
        return;
    }

    // Se é segura, revela e checa se ganhou
    revealCell(r, c);
    checkWin();
}

// 5. Revela a célula (e as vizinhas se for vazia - Flood Fill)
function revealCell(r, c) {
    // Para se sair dos limites ou se já estiver revelada
    if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return;
    
    const cellObj = board[r][c];
    if (cellObj.isRevealed) return;

    cellObj.isRevealed = true;
    cellObj.element.classList.add('revealed');
    cellsRevealed++;

    // Mostra o número de bombas ao redor, se houver
    if (cellObj.neighborBombs > 0) {
        cellObj.element.textContent = cellObj.neighborBombs;
        cellObj.element.dataset.value = cellObj.neighborBombs;
    } else {
        // Se for 0, abre os vizinhos automaticamente
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                revealCell(r + i, c + j);
            }
        }
    }
}

// 6. Fim de jogo (Mostra as bombas se perder)
function triggerGameOver(win) {
    gameOver = true;
    
    // Revela todas as bombas
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            if (board[r][c].isBomb) {
                board[r][c].element.textContent = '💣';
                board[r][c].element.classList.add('revealed', 'bomb');
            }
        }
    }

    if (win) {
        setTimeout(() => alert('Parabéns! Você venceu!'), 100);
    } else {
        setTimeout(() => alert('BUM! Game Over!'), 100);
    }
}

// 7. Checa se todas as células seguras foram abertas
function checkWin() {
    const totalSafeCells = (ROWS * COLS) - BOMBS;
    if (cellsRevealed === totalSafeCells) {
        triggerGameOver(true);
    }
}

// Inicia o jogo ao carregar a página e configura o botão de reiniciar
btnRestart.addEventListener('click', initGame);
initGame();