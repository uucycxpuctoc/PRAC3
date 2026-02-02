/**
 * Игровой Хаб: Управление интерфейсом
 */
const UI = {
    menuBtn: document.getElementById('menuBtn'),
    gameMenu: document.getElementById('gameMenu'),
    cards: document.querySelectorAll('.game-card'),
    
    init() {
        this.menuBtn.onclick = (e) => {
            e.stopPropagation();
            this.gameMenu.classList.toggle('show');
        };
        document.onclick = () => this.gameMenu.classList.remove('show');
    }
};

function selectGame(id) {
    UI.cards.forEach(c => {
        c.classList.remove('active');
        c.style.opacity = '0'; // Эффект затухания
    });
    
    const activeGame = document.getElementById(id);
    activeGame.classList.add('active');
    setTimeout(() => activeGame.style.opacity = '1', 50);

    if(id === 'maze') initMaze();
    if(id === 'reaction') resetReaction();
}

/**
 * 🎯 ИГРА: Реакция
 */
let rTimer, rTimeLeft = 30, rScore = 0;

function startReactionGame() {
    rScore = 0; 
    rTimeLeft = 30;
    updateReactUI();
    document.getElementById('start-msg').style.display = 'none';
    
    clearInterval(rTimer);
    rTimer = setInterval(() => {
        rTimeLeft--;
        document.getElementById('react-timer').innerText = rTimeLeft;
        if(rTimeLeft <= 0) endReactionGame();
    }, 1000);
    moveTarget();
}

function moveTarget() {
    const btn = document.getElementById('target-btn');
    const area = document.getElementById('reaction-area');
    btn.style.display = 'none';

    if(rTimeLeft > 0) {
        setTimeout(() => {
            const x = Math.random() * (area.clientWidth - 70);
            const y = Math.random() * (area.clientHeight - 70);
            btn.style.transform = `translate(${x}px, ${y}px)`;
            btn.style.display = 'block';
        }, 400);
    }
}

function endReactionGame() {
    clearInterval(rTimer);
    alert(`Время вышло! Ваш результат: ${rScore}`);
    document.getElementById('start-msg').style.display = 'block';
    document.getElementById('target-btn').style.display = 'none';
}

function updateReactUI() {
    document.getElementById('react-clicks').innerText = rScore;
    document.getElementById('react-timer').innerText = rTimeLeft;
}

document.getElementById('target-btn').onclick = () => {
    rScore++;
    updateReactUI();
    moveTarget();
};

/**
 * ⭕ ИГРА: Крестики-Нолики
 */
let tttState = Array(9).fill(null), currentPlayer = 'X';
let scores = { X: 0, O: 0 };

const cells = document.querySelectorAll('.cell');
cells.forEach(cell => {
    cell.onclick = (e) => {
        const i = e.target.dataset.index;
        if(!tttState[i]) {
            makeMove(e.target, i);
        }
    };
});

function makeMove(el, i) {
    tttState[i] = currentPlayer;
    el.innerText = currentPlayer;
    el.classList.add(currentPlayer.toLowerCase(), 'pop-in'); // Добавьте анимацию pop-in в CSS
    
    if(checkWin()) return;
    
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    document.getElementById('ttt-status').innerText = `Ход: ${currentPlayer}`;
}

function checkWin() {
    const wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    for (let [a, b, c] of wins) {
        if (tttState[a] && tttState[a] === tttState[b] && tttState[a] === tttState[c]) {
            scores[tttState[a]]++;
            highlightWinner([a, b, c]);
            setTimeout(() => {
                alert(`Победил игрок ${tttState[a]}!`);
                resetTTT();
            }, 100);
            return true;
        }
    }
    if(!tttState.includes(null)) {
        alert("Ничья!");
        resetTTT();
        return true;
    }
    return false;
}

function resetTTT() {
    tttState.fill(null);
    cells.forEach(c => { c.innerText = ''; c.className = 'cell'; });
    currentPlayer = 'X';
    document.getElementById('win-x').innerText = scores.X;
    document.getElementById('win-o').innerText = scores.O;
    document.getElementById('ttt-status').innerText = "Ход: X";
}

/**
 * 🧱 ИГРА: Лабиринт
 */
const mazeMap = [1,1,1,1,1,1,1,1,1,1,0,0,0,1,0,0,0,0,0,1,1,1,0,1,0,1,1,1,0,1,1,0,0,0,0,1,0,0,0,1,1,0,1,1,1,1,0,1,1,1,1,0,0,0,0,0,0,1,0,0,1,1,1,1,1,1,0,1,0,1,1,0,0,0,0,1,0,0,0,1,1,0,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1];
let playerIdx = 10, mTime = 0, mTimer;

function initMaze() {
    const container = document.getElementById('maze-container');
    container.innerHTML = '';
    mazeMap.forEach((val, i) => {
        const div = document.createElement('div');
        div.className = `maze-cell ${val === 1 ? 'wall' : ''} ${i === 59 ? 'exit' : ''}`;
        container.appendChild(div);
    });
    playerIdx = 10;
    mTime = 0;
    clearInterval(mTimer);
    mTimer = setInterval(() => {
        mTime++;
        document.getElementById('maze-timer').innerText = mTime;
    }, 1000);
    renderMaze();
}

function renderMaze() {
    const cells = document.querySelectorAll('.maze-cell');
    cells.forEach(c => c.classList.remove('player'));
    if(cells[playerIdx]) cells[playerIdx].classList.add('player');
    
    if(playerIdx === 59) {
        clearInterval(mTimer);
        setTimeout(() => {
            alert(`Победа! Вы прошли лабиринт за ${mTime} сек.`);
            initMaze();
        }, 50);
    }
}

window.addEventListener('keydown', (e) => {
    if(!document.getElementById('maze').classList.contains('active')) return;
    
    const moves = { ArrowUp: -10, ArrowDown: 10, ArrowLeft: -1, ArrowRight: 1 };
    if(!moves[e.key]) return;

    let next = playerIdx + moves[e.key];
    if(next >= 0 && next < mazeMap.length && mazeMap[next] !== 1) {
        playerIdx = next;
        renderMaze();
    }
});

UI.init();
