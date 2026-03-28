// NOVA: Configurações das 3 dificuldades
const difficulties = {
    easy: { rows: 8, cols: 8, bombs: 10 },
    medium: { rows: 16, cols: 16, bombs: 40 },
    hard: { rows: 16, cols: 30, bombs: 99 }
};

let currentDiff = 'easy'; // Dificuldade padrão
let ROWS, COLS, BOMBS;    // Agora são variáveis que vão mudar

// Variáveis de controle do jogo
let board = [];
let gameOver = false;
let firstClick = true;
let cellsRevealed = 0;
let flagsLeft = 0;

// Elementos do HTML
const boardEl = document.getElementById('board');
const btnRestart = document.getElementById('btn-restart');
const minesLeftEl = document.getElementById('mines-left');
const diffSelect = document.getElementById('difficulty'); // NOVO: Elemento do select

// 1. Inicia ou reinicia a partida
function initGame() {
    // Aplica as configurações baseadas na dificuldade escolhida
    const config = difficulties[currentDiff];
    ROWS = config.rows;
    COLS = config.cols;
    BOMBS = config.bombs;

    gameOver = false;
    firstClick = true;
    cellsRevealed = 0;
    flagsLeft = BOMBS; 
    
    minesLeftEl.textContent = flagsLeft;
    
    board = [];
    boardEl.innerHTML = ''; 

    // NOVA: Define o número de colunas do CSS Grid via JavaScript
    boardEl.style.gridTemplateColumns = `repeat(${COLS}, 30px)`;

    for (let r = 0; r < ROWS; r++) {
        let row = [];
        for (let c = 0; c < COLS; c++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            
            cell.addEventListener('click', () => handleCellClick(r, c));
            
            cell.addEventListener('contextmenu', (e) => {
                e.preventDefault(); 
                toggleFlagCell(r, c);
            });

            boardEl.appendChild(cell);
            
            row.push({
                element: cell,
                isBomb: false,
                isRevealed: false,
                isFlagged: false, 
                neighborBombs: 0
            });
        }
        board.push(row);
    }
}

// (As funções placeBombs, calculateNeighbors, handleCellClick continuam iguais à Fase 3)
function placeBombs(excludeRow, excludeCol) {
    let bombsPlaced = 0;
    while (bombsPlaced < BOMBS) {
        let r = Math.floor(Math.random() * ROWS);
        let c = Math.floor(Math.random() * COLS);
        
        if (!board[r][c].isBomb && !(r === excludeRow && c === excludeCol)) {
            board[r][c].isBomb = true;
            bombsPlaced++;
        }
    }
    calculateNeighbors();
}

function calculateNeighbors() {
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            if (board[r][c].isBomb) continue;
            let count = 0;
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

function handleCellClick(r, c) {
    if (gameOver || board[r][c].isRevealed || board[r][c].isFlagged) return;

    if (firstClick) {
        firstClick = false;
        placeBombs(r, c);
    }

    if (board[r][c].isBomb) {
        triggerGameOver(false);
        return;
    }

    revealCell(r, c);
    checkWin();
}

function toggleFlagCell(r, c) {
    if (gameOver || board[r][c].isRevealed) return;
    
    const cellObj = board[r][c];

    if (!cellObj.isFlagged && flagsLeft > 0) {
        cellObj.isFlagged = true;
        cellObj.element.textContent = '🚩';
        flagsLeft--;
    } else if (cellObj.isFlagged) {
        cellObj.isFlagged = false;
        cellObj.element.textContent = '';
        flagsLeft++;
    }
    
    minesLeftEl.textContent = flagsLeft;
}

function revealCell(r, c) {
    if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return;
    
    const cellObj = board[r][c];
    if (cellObj.isRevealed || cellObj.isFlagged) return;

    cellObj.isRevealed = true;
    cellObj.element.classList.add('revealed');
    cellsRevealed++;

    if (cellObj.neighborBombs > 0) {
        cellObj.element.textContent = cellObj.neighborBombs;
        cellObj.element.dataset.value = cellObj.neighborBombs;
    } else {
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                revealCell(r + i, c + j);
            }
        }
    }
}

function triggerGameOver(win) {
    gameOver = true;
    
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            if (board[r][c].isBomb) {
                board[r][c].element.textContent = '💣';
                board[r][c].element.classList.add('revealed', 'bomb');
            }
        }
    }

    if (win) {
        setTimeout(() => alert('Parabéns! Venceste a partida!'), 100);
    } else {
        setTimeout(() => alert('BUM! Fim de Jogo!'), 100);
    }
}

function checkWin() {
    const totalSafeCells = (ROWS * COLS) - BOMBS;
    if (cellsRevealed === totalSafeCells) {
        triggerGameOver(true);
    }
}

// NOVA: Listener para quando o usuário trocar a dificuldade no dropdown
diffSelect.addEventListener('change', (e) => {
    currentDiff = e.target.value;
    initGame(); // Reinicia o jogo inteiro com as novas regras
});

btnRestart.addEventListener('click', initGame);
initGame();