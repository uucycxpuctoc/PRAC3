// Переключение игр
function selectGame(id) {
    document.querySelectorAll('.game-card').forEach(c => c.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    if(id === 'maze') initMaze();
}

// --- ЗАДАНИЕ 1: РЕАКЦИЯ ---
let reactClicks = 0;
let reactTimer = 30;
let gameActive = false;
let reactionTimes = [];
let lastSpawn;

function startReactionGame() {
    if(gameActive) return;
    reactClicks = 0;
    reactTimer = 30;
    reactionTimes = [];
    gameActive = true;
    document.getElementById('react-clicks').innerText = '0';
    document.getElementById('start-msg').style.display = 'none';
    document.getElementById('react-start').style.display = 'none';

    let timerId = setInterval(() => {
        reactTimer--;
        document.getElementById('react-timer').innerText = reactTimer;
        if(reactTimer <= 0) {
            clearInterval(timerId);
            endReactionGame();
        }
    }, 1000);

    spawnTarget();
}

function spawnTarget() {
    if(!gameActive) return;
    const btn = document.getElementById('target-btn');
    const area = document.getElementById('reaction-area');
    
    const x = Math.random() * (area.clientWidth - 80);
    const y = Math.random() * (area.clientHeight - 40);
    
    btn.style.left = x + 'px';
    btn.style.top = y + 'px';
    btn.style.display = 'block';
    lastSpawn = Date.now();
}

document.getElementById('target-btn').onclick = () => {
    reactionTimes.push(Date.now() - lastSpawn);
    reactClicks++;
    document.getElementById('react-clicks').innerText = reactClicks;
    document.getElementById('target-btn').style.display = 'none';
    setTimeout(spawnTarget, Math.random() * 2000 + 500);
};

function endReactionGame() {
    gameActive = false;
    document.getElementById('target-btn').style.display = 'none';
    const avg = reactionTimes.length > 0 ? (reactionTimes.reduce((a,b)=>a+b,0)/reactionTimes.length).toFixed(0) : 0;
    alert(`Игра окончена!\nКликов: ${reactClicks}\nСр. время: ${avg}мс`);
    document.getElementById('react-start').style.display = 'inline-block';
}

// --- ЗАДАНИЕ 2: КРЕСТИКИ-НОЛИКИ ---
let board = Array(9).fill(null);
let currentPlayer = 'X';
let wins = { X: 0, O: 0 };

document.querySelectorAll('.cell').forEach(cell => {
    cell.onclick = (e) => {
        const i = e.target.dataset.index;
        if(board[i] || checkWinner()) return;
        
        board[i] = currentPlayer;
        e.target.innerText = currentPlayer;
        
        if(checkWinner()) {
            document.getElementById('ttt-status').innerText = `Победа ${currentPlayer}!`;
            wins[currentPlayer]++;
            updateTTTScore();
        } else if(!board.includes(null)) {
            document.getElementById('ttt-status').innerText = "Ничья!";
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            document.getElementById('ttt-status').innerText = `Ход: ${currentPlayer}`;
        }
    };
});

function checkWinner() {
    const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    return lines.find(([a,b,c]) => board[a] && board[a] === board[b] && board[a] === board[c]);
}

function updateTTTScore() {
    document.getElementById('win-x').innerText = wins.X;
    document.getElementById('win-o').innerText = wins.O;
}

function resetTTT() {
    board.fill(null);
    document.querySelectorAll('.cell').forEach(c => c.innerText = '');
    currentPlayer = 'X';
    document.getElementById('ttt-status').innerText = "Ход: X";
}

// --- ЗАДАНИЕ 3: ЛАБИРИНТ ---
const mazeLayout = [
    [1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,1,0,0,0,0,1],
    [1,0,1,0,1,0,1,1,0,1],
    [1,0,1,0,0,0,0,1,0,1],
    [1,0,1,1,1,1,0,1,0,1],
    [1,0,0,0,0,1,0,0,0,1],
    [1,1,1,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,0,1,0,1],
    [1,0,1,1,1,1,0,0,2,1],
    [1,1,1,1,1,1,1,1,1,1]
];

let playerPos = { x: 1, y: 1 };
let mazeStartTime, mazeInterval;

function initMaze() {
    const container = document.getElementById('maze-container');
    container.innerHTML = '';
    container.style.gridTemplateColumns = `repeat(${mazeLayout[0].length}, 30px)`;
    
    mazeLayout.forEach((row, y) => {
        row.forEach((cell, x) => {
            const div = document.createElement('div');
            div.className = `maze-cell ${cell === 1 ? 'wall' : 'path'}`;
            if(cell === 2) div.classList.add('exit');
            div.id = `cell-${x}-${y}`;
            container.appendChild(div);
        });
    });
    
    playerPos = { x: 1, y: 1 };
    renderPlayer();
    startMazeTimer();
}

function renderPlayer() {
    document.querySelectorAll('.player').forEach(p => p.classList.remove('player'));
    document.getElementById(`cell-${playerPos.x}-${playerPos.y}`).classList.add('player');
}

function startMazeTimer() {
    clearInterval(mazeInterval);
    let sec = 0;
    mazeInterval = setInterval(() => {
        sec++;
        document.getElementById('maze-timer').innerText = sec;
    }, 1000);
}

window.onkeydown = (e) => {
    if(!document.getElementById('maze').classList.contains('active')) return;
    let newX = playerPos.x;
    let newY = playerPos.y;
    
    if(e.key === 'ArrowUp') newY--;
    if(e.key === 'ArrowDown') newY++;
    if(e.key === 'ArrowLeft') newX--;
    if(e.key === 'ArrowRight') newX++;
    
    if(mazeLayout[newY][newX] !== 1) {
        playerPos = { x: newX, y: newY };
        renderPlayer();
        if(mazeLayout[newY][newX] === 2) {
            clearInterval(mazeInterval);
            alert(`Победа! Время: ${document.getElementById('maze-timer').innerText}с`);
            initMaze();
        }
    }
};
