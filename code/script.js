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

// NOVA: Variáveis do cronômetro
let timerInterval;
let secondsElapsed = 0;

// Elementos do HTML
const boardEl = document.getElementById('board');
const btnRestart = document.getElementById('btn-restart');
const minesLeftEl = document.getElementById('mines-left');
const diffSelect = document.getElementById('difficulty');
const timerEl = document.getElementById('timer'); // NOVO
const rankingList = document.getElementById('ranking-list'); // NOVO

// 1. Inicia ou reinicia a partida
function initGame() {
    // Para o cronômetro anterior, se houver
    clearInterval(timerInterval);
    secondsElapsed = 0;
    timerEl.textContent = secondsElapsed;

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

    // NOVA: Atualiza a lista de recordes sempre que iniciar
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

// NOVA: Inicia a contagem do tempo
function startTimer() {
    timerInterval = setInterval(() => {
        secondsElapsed++;
        timerEl.textContent = secondsElapsed;
    }, 1000);
}

function handleCellClick(r, c) {
    if (gameOver || board[r][c].isRevealed || board[r][c].isFlagged) return;

    if (firstClick) {
        firstClick = false;
        placeBombs(r, c);
        startTimer(); // NOVA: Começa a contar o tempo no primeiro clique
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
    clearInterval(timerInterval); // NOVA: Para o relógio
    
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
        saveRanking(); // NOVA: Salva o recorde se ganhar
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

// NOVA: Sistema de Ranking LocalStorage
function saveRanking() {
    let rankings = JSON.parse(localStorage.getItem('minesweeper_ranking')) || { easy: [], medium: [], hard: [] };
    
    // Adiciona o tempo atual e ordena do menor para o maior
    rankings[currentDiff].push(secondsElapsed);
    rankings[currentDiff].sort((a, b) => a - b);
    
    // Mantém apenas o Top 5
    rankings[currentDiff] = rankings[currentDiff].slice(0, 5);
    
    localStorage.setItem('minesweeper_ranking', JSON.stringify(rankings));
    updateRankingUI();
}

function updateRankingUI() {
    let rankings = JSON.parse(localStorage.getItem('minesweeper_ranking')) || { easy: [], medium: [], hard: [] };
    const currentRanking = rankings[currentDiff];
    
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

diffSelect.addEventListener('change', (e) => {
    currentDiff = e.target.value;
    initGame(); 
});

btnRestart.addEventListener('click', initGame);
initGame();