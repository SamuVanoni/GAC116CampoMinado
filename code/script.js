const ROWS = 8;
const COLS = 8;
const BOMBS = 10;

// Variáveis de controlo do jogo
let board = [];
let gameOver = false;
let firstClick = true;
let cellsRevealed = 0;
let flagsLeft = BOMBS; // NOVA: Controla quantas bandeiras restam

// Elementos do HTML
const boardEl = document.getElementById('board');
const btnRestart = document.getElementById('btn-restart');
const minesLeftEl = document.getElementById('mines-left'); // NOVO: Elemento do contador

// 1. Inicia ou reinicia a partida
function initGame() {
    gameOver = false;
    firstClick = true;
    cellsRevealed = 0;
    flagsLeft = BOMBS; // Repõe as bandeiras
    
    if(minesLeftEl) minesLeftEl.textContent = flagsLeft; // Atualiza o texto no ecrã
    
    board = [];
    boardEl.innerHTML = ''; 

    for (let r = 0; r < ROWS; r++) {
        let row = [];
        for (let c = 0; c < COLS; c++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            
            // Evento: Clique Esquerdo (Revelar)
            cell.addEventListener('click', () => handleCellClick(r, c));
            
            // NOVO Evento: Clique Direito (Colocar Bandeira)
            cell.addEventListener('contextmenu', (e) => {
                e.preventDefault(); // Impede que o menu padrão do navegador apareça
                toggleFlagCell(r, c);
            });

            boardEl.appendChild(cell);
            
            row.push({
                element: cell,
                isBomb: false,
                isRevealed: false,
                isFlagged: false, // NOVA: Propriedade para saber se tem bandeira
                neighborBombs: 0
            });
        }
        board.push(row);
    }
}

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

// Lida com o clique do jogador
function handleCellClick(r, c) {
    if (gameOver || board[r][c].isRevealed) return;

    // NOVO: Se a célula tiver uma bandeira, o clique esquerdo não faz nada!
    if (board[r][c].isFlagged) return;

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

// NOVA FUNÇÃO: Colocar ou retirar a bandeira
function toggleFlagCell(r, c) {
    if (gameOver || board[r][c].isRevealed) return;
    
    const cellObj = board[r][c];

    // Se não tem bandeira e ainda temos bandeiras disponíveis
    if (!cellObj.isFlagged && flagsLeft > 0) {
        cellObj.isFlagged = true;
        cellObj.element.textContent = '🚩';
        flagsLeft--;
    } 
    // Se já tem bandeira, removemos
    else if (cellObj.isFlagged) {
        cellObj.isFlagged = false;
        cellObj.element.textContent = '';
        flagsLeft++;
    }
    
    // Atualiza o contador visual
    minesLeftEl.textContent = flagsLeft;
}

function revealCell(r, c) {
    if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return;
    
    const cellObj = board[r][c];
    
    // NOVO: Impede que o "Flood Fill" abra células com bandeiras
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

btnRestart.addEventListener('click', initGame);
initGame();