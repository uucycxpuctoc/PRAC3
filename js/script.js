// --- Навигация ---
function switchGame(gameId) {
    document.querySelectorAll('.game-card').forEach(card => card.classList.remove('active'));
    document.getElementById(gameId).classList.add('active');
    if(gameId === 'maze') initMaze();
}

// --- Задание 1: Реакция ---
let reactionData = { clicks: 0, times: [], timer: 30, active: false };
let spawnTimeout;

function startReactionGame() {
    reactionData = { clicks: 0, times: [], timer: 30, active: true };
    document.getElementById('react-score').innerText = '0';
    document.getElementById('react-start-screen').style.display = 'none';
    
    const interval = setInterval(() => {
        reactionData.timer--;
        document.getElementById('react-timer').innerText = reactionData.timer;
        if (reactionData.timer <= 0) {
            clearInterval(interval);
            endReactionGame();
        }
    }, 1000);
    
    spawnTarget();
}

function spawnTarget() {
    if (!reactionData.active) return;
    const target = document.getElementById('target');
    const field = document.getElementById('reaction-field');
    
    const x = Math.random() * (field.clientWidth - 100);
    const y = Math.random() * (field.clientHeight - 50);
    
    target.style.left = `${x}px`;
    target.style.top = `${y}px`;
    target.style.display = 'block';
    target.dataset.startTime = Date.now();
    
    spawnTimeout = setTimeout(() => {
        target.style.display = 'none';
        spawnTarget();
    }, Math.random() * 4000 + 1000); // 1-5 секунд по ТЗ
}

document.getElementById('target').addEventListener('click', function() {
    const reactionTime = Date.now() - this.dataset.startTime;
    reactionData.times.push(reactionTime);
    reactionData.clicks++;
    document.getElementById('react-score').innerText = reactionData.clicks;
    this.style.display = 'none';
    clearTimeout(spawnTimeout);
    setTimeout(spawnTarget, 500);
});

function endReactionGame() {
    reactionData.active = false;
    document.getElementById('target').style.display = 'none';
    const avg = reactionData.times.length ? (reactionData.times.reduce((a,b)=>a+b)/reactionData.times.length).toFixed(0) : 0;
    alert(`Конец! Успешных нажатий: ${reactionData.clicks}, Ср. время: ${avg}мс`);
    document.getElementById('react-start-screen').style.display = 'flex';
}

// --- Задание 2: Крестики-нолики ---
let tttBoard = Array(9).fill(null);
let currentPlayer = 'X';
let tttScores = { X: 0, O: 0 };

document.querySelectorAll('.cell').forEach(cell => {
    cell.addEventListener('click', (e) => {
        const idx = e.target.dataset.index;
        if (tttBoard[idx] || checkWinner()) return;

        tttBoard[idx] = currentPlayer;
        e.target.innerText = currentPlayer;
        e.target.style.color = currentPlayer === 'X' ? 'var(--primary)' : '#ff7675';

        if (checkWinner()) {
            document.getElementById('ttt-status').innerText = `Победа: ${currentPlayer}!`;
            tttScores[currentPlayer]++;
            updateTTTScore();
        } else if (!tttBoard.includes(null)) {
            document.getElementById('ttt-status').innerText = "Ничья!";
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            document.getElementById('ttt-status').innerText = `Ход: ${currentPlayer}`;
        }
    });
});

function checkWinner() {
    const winPatterns = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    return winPatterns.some(p => tttBoard[p[0]] && tttBoard[p[0]] === tttBoard[p[1]] && tttBoard[p[0]] === tttBoard[p[2]]);
}

function updateTTTScore() {
    document.getElementById('wins-x').innerText = tttScores.X;
    document.getElementById('wins-o').innerText = tttScores.O;
}

function resetTTT() {
    tttBoard.fill(null);
    document.querySelectorAll('.cell').forEach(c => c.innerText = '');
    currentPlayer = 'X';
    document.getElementById('ttt-status').innerText = "Ход: X";
}

// --- Задание 3: Лабиринт ---
const map = [
    [1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,1,0,0,0,0,1],
    [1,0,1,0,1,0,1,1,0,1],
    [1,0,1,0,0,0,0,1,0,1],
    [1,0,0,0,1,1,0,1,2,1],
    [1,1,1,1,1,1,1,1,1,1]
];
let player = { x: 1, y: 1 };
let mazeTimer = 0;
let mazeInt;

function initMaze() {
    const container = document.getElementById('maze-container');
    container.innerHTML = '';
    container.style.gridTemplateColumns = `repeat(${map[0].length}, 30px)`;
    
    map.forEach((row, y) => {
        row.forEach((cell, x) => {
            const div = document.createElement('div');
            div.className = `m-cell ${cell === 1 ? 'm-wall' : cell === 2 ? 'm-exit' : 'm-path'}`;
            div.id = `m-${x}-${y}`;
            container.appendChild(div);
        });
    });
    
    player = { x: 1, y: 1 };
    renderPlayer();
    mazeTimer = 0;
    clearInterval(mazeInt);
    mazeInt = setInterval(() => { mazeTimer++; document.getElementById('maze-timer').innerText = mazeTimer; }, 1000);
}

function renderPlayer() {
    document.querySelectorAll('.m-player').forEach(p => p.classList.remove('m-player'));
    document.getElementById(`m-${player.x}-${player.y}`).classList.add('m-player');
}

window.addEventListener('keydown', (e) => {
    if (!document.getElementById('maze').classList.contains('active')) return;
    let next = { ...player };
    if (e.key === 'ArrowUp') next.y--;
    if (e.key === 'ArrowDown') next.y++;
    if (e.key === 'ArrowLeft') next.x--;
    if (e.key === 'ArrowRight') next.x++;

    if (map[next.y][next.x] !== 1) {
        player = next;
        renderPlayer();
        if (map[player.y][player.x] === 2) {
            clearInterval(mazeInt);
            alert(`Вы прошли лабиринт за ${mazeTimer}с!`);
            initMaze();
        }
    }
});
