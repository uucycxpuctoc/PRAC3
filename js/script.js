// --- НАВИГАЦИЯ ---
const menuBtn = document.getElementById('menuBtn');
const gameMenu = document.getElementById('gameMenu');
menuBtn.addEventListener('click', (e) => { e.stopPropagation(); gameMenu.classList.toggle('show'); });
document.addEventListener('click', () => gameMenu.classList.remove('show'));

function selectGame(id) {
    document.querySelectorAll('.game-card').forEach(c => c.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    if(id === 'maze') initMaze();
}

// --- 1. СКОРОСТЬ РЕАКЦИИ ---
let reactTimer, reactTimeLeft = 30, reactScore = 0, appearTime;
let reactionTimes = [];

function startReactionGame() {
    reactScore = 0; reactionTimes = []; reactTimeLeft = 30;
    document.getElementById('react-clicks').innerText = 0;
    document.getElementById('start-msg').style.display = 'none';
    
    reactTimer = setInterval(() => {
        reactTimeLeft--;
        document.getElementById('react-timer').innerText = reactTimeLeft;
        if (reactTimeLeft <= 0) endGame();
    }, 1000);
    showTarget();
}

function showTarget() {
    const btn = document.getElementById('target-btn');
    const area = document.getElementById('reaction-area');
    const x = Math.random() * (area.clientWidth - 80);
    const y = Math.random() * (area.clientHeight - 40);
    
    setTimeout(() => {
        if(reactTimeLeft <= 0) return;
        btn.style.left = x + 'px';
        btn.style.top = y + 'px';
        btn.style.display = 'block';
        appearTime = Date.now();
    }, Math.random() * 2000 + 1000);
}

document.getElementById('target-btn').onclick = function() {
    reactionTimes.push(Date.now() - appearTime);
    reactScore++;
    document.getElementById('react-clicks').innerText = reactScore;
    this.style.display = 'none';
    showTarget();
};

function endGame() {
    clearInterval(reactTimer);
    const avg = reactionTimes.length ? (reactionTimes.reduce((a,b)=>a+b,0)/reactionTimes.length).toFixed(0) : 0;
    alert(`Игра окончена!\nКликов: ${reactScore}\nСредняя реакция: ${avg} мс`);
    document.getElementById('start-msg').style.display = 'block';
    document.getElementById('target-btn').style.display = 'none';
}

// --- 2. КРЕСТИКИ-НОЛИКИ ---
let tttBoard = Array(9).fill(null), tttActive = true, currentPlayer = 'X';
let wins = { X: 0, O: 0 };

document.querySelectorAll('.cell').forEach(cell => {
    cell.onclick = (e) => {
        const i = e.target.dataset.index;
        if(!tttBoard[i] && tttActive) {
            tttBoard[i] = currentPlayer;
            e.target.innerText = currentPlayer;
            e.target.classList.add(currentPlayer.toLowerCase());
            checkWinner();
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            document.getElementById('ttt-status').innerText = `Ход: ${currentPlayer}`;
        }
    };
});

function checkWinner() {
    const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    for (let l of lines) {
        const [a,b,c] = l;
        if(tttBoard[a] && tttBoard[a] === tttBoard[b] && tttBoard[a] === tttBoard[c]) {
            alert(`Победил ${tttBoard[a]}!`);
            wins[tttBoard[a]]++;
            document.getElementById(`win-${tttBoard[a].toLowerCase()}`).innerText = wins[tttBoard[a]];
            tttActive = false;
            return;
        }
    }
    if(!tttBoard.includes(null)) alert("Ничья!");
}

function resetTTT() {
    tttBoard.fill(null); tttActive = true; currentPlayer = 'X';
    document.querySelectorAll('.cell').forEach(c => { c.innerText = ''; c.className = 'cell'; });
}

// --- 3. ЛАБИРИНТ ---
const mazeLayout = [
    1,1,1,1,1,1,1,1,1,1,
    0,0,0,1,0,0,0,0,0,1,
    1,1,0,1,0,1,1,1,0,1,
    1,0,0,0,0,1,0,0,0,1,
    1,0,1,1,1,1,0,1,1,1,
    1,0,0,0,0,0,0,1,0,0, // Выход на индексе 59
    1,1,1,1,1,1,0,1,0,1,
    1,0,0,0,0,1,0,0,0,1,
    1,0,1,1,0,0,0,1,1,1,
    1,1,1,1,1,1,1,1,1,1
];
let playerPos = 10, mazeTime = 0, mazeInterval;

function initMaze() {
    const container = document.getElementById('maze-container');
    container.innerHTML = '';
    mazeLayout.forEach((cell, i) => {
        const div = document.createElement('div');
        div.className = 'maze-cell ' + (cell === 1 ? 'wall' : '');
        if(i === 59) div.classList.add('exit');
        container.appendChild(div);
    });
    playerPos = 10; mazeTime = 0;
    renderPlayer();
    clearInterval(mazeInterval);
    mazeInterval = setInterval(() => { mazeTime++; document.getElementById('maze-timer').innerText = mazeTime; }, 1000);
}

function renderPlayer() {
    document.querySelectorAll('.maze-cell').forEach(c => c.classList.remove('player'));
    document.querySelectorAll('.maze-cell')[playerPos].classList.add('player');
    if(playerPos === 59) { clearInterval(mazeInterval); alert("Вы вышли из лабиринта за " + mazeTime + " сек!"); }
}

window.onkeydown = (e) => {
    const card = document.getElementById('maze');
    if(!card.classList.contains('active')) return;
    
    let next = playerPos;
    if(e.key === 'ArrowUp') next -= 10;
    if(e.key === 'ArrowDown') next += 10;
    if(e.key === 'ArrowLeft') next -= 1;
    if(e.key === 'ArrowRight') next += 1;
    
    if(mazeLayout[next] === 0 || next === 59) {
        playerPos = next;
        renderPlayer();
    }
};
