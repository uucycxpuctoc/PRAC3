// --- ПЕРЕКЛЮЧЕНИЕ ИГР ---
const navBtns = document.querySelectorAll('.nav-btn');
const cards = document.querySelectorAll('.game-card');

navBtns.forEach(btn => {
    btn.onclick = () => {
        navBtns.forEach(b => b.classList.remove('active'));
        cards.forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        const gameId = btn.getAttribute('data-game');
        document.getElementById(gameId).classList.add('active');
        if(gameId === 'maze') initMaze();
    };
});

// --- ИГРА 1: РЕАКЦИЯ ---
let rClicks = 0, rTimeLeft = 30, rActive = false, rTimes = [], rStart;
const target = document.getElementById('target');

document.getElementById('start-reaction').onclick = () => {
    if(rActive) return;
    rActive = true; rClicks = 0; rTimeLeft = 30; rTimes = [];
    document.getElementById('r-clicks').innerText = '0';
    
    let timerId = setInterval(() => {
        rTimeLeft--;
        document.getElementById('r-timer').innerText = rTimeLeft;
        if(rTimeLeft <= 0) {
            clearInterval(timerId);
            rActive = false;
            target.style.display = 'none';
            const avg = rTimes.length ? (rTimes.reduce((a,b)=>a+b)/rTimes.length).toFixed(0) : 0;
            alert(`Игра окончена!\nКликов: ${rClicks}\nСреднее время: ${avg} мс`);
        }
    }, 1000);
    spawnTarget();
};

function spawnTarget() {
    if(!rActive) return;
    const field = document.getElementById('reaction-field');
    target.style.left = Math.random() * (field.clientWidth - 80) + 'px';
    target.style.top = Math.random() * (field.clientHeight - 40) + 'px';
    target.style.display = 'block';
    rStart = Date.now();
}

target.onclick = () => {
    rTimes.push(Date.now() - rStart);
    rClicks++;
    document.getElementById('r-clicks').innerText = rClicks;
    target.style.display = 'none';
    setTimeout(spawnTarget, Math.random() * 4000 + 1000);
};

// --- ИГРА 2: КРЕСТИКИ ---
let board = Array(9).fill(null), curPlayer = 'X', scores = {X:0, O:0};
const bDiv = document.getElementById('ttt-board');

function initTTT() {
    bDiv.innerHTML = '';
    board.fill(null);
    for(let i=0; i<9; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.onclick = () => {
            if(board[i] || checkWinner()) return;
            board[i] = curPlayer;
            cell.innerText = curPlayer;
            if(checkWinner()) {
                scores[curPlayer]++;
                document.getElementById('win-x').innerText = scores.X;
                document.getElementById('win-o').innerText = scores.O;
                document.getElementById('ttt-status').innerText = `Победа ${curPlayer}!`;
            } else {
                curPlayer = curPlayer === 'X' ? 'O' : 'X';
                document.getElementById('ttt-status').innerText = `Ход: ${curPlayer}`;
            }
        };
        bDiv.appendChild(cell);
    }
}
function checkWinner() {
    const wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    return wins.find(p => board[p[0]] && board[p[0]]===board[p[1]] && board[p[0]]===board[p[2]]);
}
document.getElementById('reset-ttt').onclick = () => { curPlayer = 'X'; initTTT(); };
initTTT();

// --- ИГРА 3: ЛАБИРИНТ ---
const mazeMap = [
    [1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,1,0,0,0,0,1],
    [1,0,1,0,1,0,1,1,0,1],
    [1,0,1,0,0,0,0,1,2,1],
    [1,1,1,1,1,1,1,1,1,1]
];
let px = 1, py = 1, mTime = 0, mInt;

function initMaze() {
    const container = document.getElementById('maze-container');
    container.innerHTML = '';
    container.style.gridTemplateColumns = `repeat(${mazeMap[0].length}, 30px)`;
    mazeMap.forEach((row, y) => row.forEach((v, x) => {
        const d = document.createElement('div');
        d.className = `m-cell ${v===1?'m-wall':v===2?'m-exit':'m-path'}`;
        d.id = `m-${x}-${y}`;
        container.appendChild(d);
    }));
    px = 1; py = 1; mTime = 0;
    clearInterval(mInt);
    mInt = setInterval(() => { mTime++; document.getElementById('m-timer').innerText = mTime; }, 1000);
    renderPlayer();
}

function renderPlayer() {
    document.querySelectorAll('.m-player').forEach(p => p.classList.remove('m-player'));
    document.getElementById(`m-${px}-${py}`).classList.add('m-player');
}

window.onkeydown = (e) => {
    if(!document.getElementById('maze').classList.contains('active')) return;
    let nx = px, ny = py;
    if(e.key === 'ArrowUp') ny--;
    if(e.key === 'ArrowDown') ny++;
    if(e.key === 'ArrowLeft') nx--;
    if(e.key === 'ArrowRight') nx++;
    if(mazeMap[ny][nx] !== 1) {
        px = nx; py = ny; renderPlayer();
        if(mazeMap[ny][nx] === 2) { clearInterval(mInt); alert(`Победа! Время: ${mTime}с`); initMaze(); }
    }
};
document.getElementById('reset-maze').onclick = initMaze;
