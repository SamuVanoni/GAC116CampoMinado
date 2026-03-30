const difficulties = {
    easy: { rows: 8, cols: 8, bombs: 10 },
    medium: { rows: 16, cols: 16, bombs: 40 },
    hard: { rows: 16, cols: 30, bombs: 99 }
};

let currentDiff = 'easy';
let ROWS, COLS, BOMBS;

// Variáveis de controle do jogo
let board = [];
let gameOver = false;
let firstClick = true;
let cellsRevealed = 0;
let flagsLeft = 0;
let timerInterval;
let secondsElapsed = 0;
let hintsLeft = 3;
let flagMode = false; // Controle do Modo Bandeira (Mobile)

// Elementos do HTML
const boardEl = document.getElementById('board');
const btnRestart = document.getElementById('btn-restart');
const minesLeftEl = document.getElementById('mines-left');
const diffSelect = document.getElementById('difficulty');
const timerEl = document.getElementById('timer');
const rankingList = document.getElementById('ranking-list');
const btnHint = document.getElementById('btn-hint');
const btnFlag = document.getElementById('btn-flag'); // NOVO: Botão de Modo Bandeira

// 1. Inicia ou reinicia a partida
function initGame() {
    clearInterval(timerInterval);
    secondsElapsed = 0;
    if (timerEl) timerEl.textContent = secondsElapsed;

    const config = difficulties[currentDiff];
    ROWS = config.rows;
    COLS = config.cols;
    BOMBS = config.bombs;

    gameOver = false;
    firstClick = true;
    cellsRevealed = 0;
    flagsLeft = BOMBS; 
    flagMode = false; // Garante que o modo bandeira comece desligado
    
    // Repõe as dicas ao iniciar
    hintsLeft = 3;
    if (btnHint) {
        btnHint.textContent = `💡 Dica (${hintsLeft})`;
        btnHint.disabled = false;
    }

    // Reseta visual do botão de modo bandeira
    if (btnFlag) {
        btnFlag.classList.remove('active');
        btnFlag.textContent = '🚩 Modo Bandeira: OFF';
    }
    
    if (minesLeftEl) minesLeftEl.textContent = flagsLeft;
    
    board = [];
    if (boardEl) {
        boardEl.innerHTML = ''; 
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

    updateRankingUI();
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

function startTimer() {
    timerInterval = setInterval(() => {
        secondsElapsed++;
        if (timerEl) timerEl.textContent = secondsElapsed;
    }, 1000);
}

function handleCellClick(r, c) {
    if (gameOver || board[r][c].isRevealed) return;

    // Se o Modo Bandeira estiver ligado, o clique esquerdo coloca a bandeira!
    if (flagMode) {
        toggleFlagCell(r, c);
        return;
    }

    // Se a célula já tem bandeira, impede de abrir sem querer no modo normal
    if (board[r][c].isFlagged) return;

    if (firstClick) {
        firstClick = false;
        placeBombs(r, c);
        startTimer(); 
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
    
    if (minesLeftEl) minesLeftEl.textContent = flagsLeft;
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
    clearInterval(timerInterval); 
    
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            if (board[r][c].isBomb) {
                board[r][c].element.textContent = '💣';
                board[r][c].element.classList.add('revealed', 'bomb');
            }
        }
    }

    if (win) {
        setTimeout(() => alert(`Parabéns! Venceste em ${secondsElapsed} segundos!`), 100);
        saveRanking(); 
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

// Lógica do Botão de Dicas
if (btnHint) {
    btnHint.addEventListener('click', () => {
        if (gameOver || firstClick || hintsLeft <= 0) return;
        
        let safeCells = [];
        
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                if (!board[r][c].isRevealed && !board[r][c].isBomb && !board[r][c].isFlagged) {
                    safeCells.push({ r, c });
                }
            }
        }

        if (safeCells.length > 0) {
            const randomSafe = safeCells[Math.floor(Math.random() * safeCells.length)];
            revealCell(randomSafe.r, randomSafe.c);
            checkWin(); 
            
            hintsLeft--;
            btnHint.textContent = `💡 Dica (${hintsLeft})`;
            
            if (hintsLeft === 0) {
                btnHint.disabled = true;
                btnHint.textContent = '💡 Esgotado';
            }
        }
    });
}

// Lógica do Botão de Modo Bandeira (Mobile)
if (btnFlag) {
    btnFlag.addEventListener('click', () => {
        flagMode = !flagMode;
        btnFlag.classList.toggle('active', flagMode);
        btnFlag.textContent = flagMode ? '🚩 Modo Bandeira: ON' : '🚩 Modo Bandeira: OFF';
    });
}

// Sistema de Ranking LocalStorage
function saveRanking() {
    let rankings = JSON.parse(localStorage.getItem('minesweeper_ranking')) || { easy: [], medium: [], hard: [] };
    
    rankings[currentDiff].push(secondsElapsed);
    rankings[currentDiff].sort((a, b) => a - b);
    rankings[currentDiff] = rankings[currentDiff].slice(0, 5);
    
    localStorage.setItem('minesweeper_ranking', JSON.stringify(rankings));
    updateRankingUI();
}

function updateRankingUI() {
    let rankings = JSON.parse(localStorage.getItem('minesweeper_ranking')) || { easy: [], medium: [], hard: [] };
    const currentRanking = rankings[currentDiff];
    
    if (rankingList) {
        rankingList.innerHTML = '';
        
        if (currentRanking.length === 0) {
            rankingList.innerHTML = '<li>Nenhum recorde salvo nesta dificuldade.</li>';
            return;
        }

        currentRanking.forEach((time, index) => {
            const li = document.createElement('li');
            li.textContent = `${index + 1}º Lugar: ${time}s`;
            rankingList.appendChild(li);
        });
    }
}

// Event Listeners Globais
if (diffSelect) {
    diffSelect.addEventListener('change', (e) => {
        currentDiff = e.target.value;
        initGame(); 
    });
}

if (btnRestart) {
    btnRestart.addEventListener('click', initGame);
}

// Start do Jogo
initGame();