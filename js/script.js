// Меню
const menuBtn = document.getElementById('menuBtn');
const gameMenu = document.getElementById('gameMenu');
menuBtn.onclick = (e) => { e.stopPropagation(); gameMenu.classList.toggle('show'); };
document.onclick = () => gameMenu.classList.remove('show');

function selectGame(id) {
    document.querySelectorAll('.game-card').forEach(c => c.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    if(id === 'maze') initMaze();
}

// Реакция
let rTimer, rTimeLeft = 30, rScore = 0;
function startReactionGame() {
    rScore = 0; rTimeLeft = 30;
    document.getElementById('react-clicks').innerText = 0;
    document.getElementById('start-msg').style.display = 'none';
    clearInterval(rTimer);
    rTimer = setInterval(() => {
        rTimeLeft--;
        document.getElementById('react-timer').innerText = rTimeLeft;
        if(rTimeLeft <= 0) { 
            clearInterval(rTimer); 
            alert("Финиш! Очки: " + rScore); 
            document.getElementById('start-msg').style.display = 'block';
            document.getElementById('target-btn').style.display = 'none';
        }
    }, 1000);
    moveTarget();
}

function moveTarget() {
    const btn = document.getElementById('target-btn');
    const area = document.getElementById('reaction-area');
    btn.style.display = 'none';
    setTimeout(() => {
        if(rTimeLeft <= 0) return;
        btn.style.left = Math.random() * (area.clientWidth - 80) + 'px';
        btn.style.top = Math.random() * (area.clientHeight - 40) + 'px';
        btn.style.display = 'block';
    }, 500);
}
document.getElementById('target-btn').onclick = () => { rScore++; document.getElementById('react-clicks').innerText = rScore; moveTarget(); };

// Крестики
let tttB = Array(9).fill(null), curP = 'X';
let winsX = 0, winsO = 0;

document.querySelectorAll('.cell').forEach(c => {
    c.onclick = (e) => {
        const i = e.target.dataset.index;
        if(!tttB[i]) {
            tttB[i] = curP; e.target.innerText = curP; e.target.classList.add(curP.toLowerCase());
            checkWin();
            curP = curP === 'X' ? 'O' : 'X';
            document.getElementById('ttt-status').innerText = "Ход: " + curP;
        }
    };
});

function checkWin() {
    const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    for (let l of lines) {
        if (tttB[l[0]] && tttB[l[0]] === tttB[l[1]] && tttB[l[0]] === tttB[l[2]]) {
            alert(`Победил ${tttB[l[0]]}!`);
            if(tttB[l[0]] === 'X') winsX++; else winsO++;
            updateTTTStats();
            resetTTT();
            return;
        }
    }
    if(!tttB.includes(null)) { alert("Ничья!"); resetTTT(); }
}

function updateTTTStats() {
    document.getElementById('win-x').innerText = winsX;
    document.getElementById('win-o').innerText = winsO;
}

function resetTTT() { 
    tttB.fill(null); 
    document.querySelectorAll('.cell').forEach(c => {c.innerText=''; c.className='cell';}); 
    curP = 'X';
    document.getElementById('ttt-status').innerText = "Ход: X";
}

// Лабиринт
const mLayout = [1,1,1,1,1,1,1,1,1,1,0,0,0,1,0,0,0,0,0,1,1,1,0,1,0,1,1,1,0,1,1,0,0,0,0,1,0,0,0,1,1,0,1,1,1,1,0,1,1,1,1,0,0,0,0,0,0,1,0,0,1,1,1,1,1,1,0,1,0,1,1,0,0,0,0,1,0,0,0,1,1,0,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1];
let pPos = 10, mTime = 0, mInt;

function initMaze() {
    const cont = document.getElementById('maze-container'); cont.innerHTML = '';
    mLayout.forEach((v, i) => { 
        const d = document.createElement('div'); d.className = 'maze-cell ' + (v===1?'wall':'');
        if(i===59) d.classList.add('exit'); cont.appendChild(d);
    });
    pPos = 10; mTime = 0; clearInterval(mInt);
    mInt = setInterval(() => { mTime++; document.getElementById('maze-timer').innerText = mTime; }, 1000);
    renderM();
}

function renderM() {
    document.querySelectorAll('.maze-cell').forEach(c => c.classList.remove('player'));
    const cells = document.querySelectorAll('.maze-cell');
    if(cells[pPos]) cells[pPos].classList.add('player');
    if(pPos === 59) { clearInterval(mInt); alert("Вы вышли за " + mTime + " сек!"); initMaze(); }
}

window.onkeydown = (e) => {
    if(!document.getElementById('maze').classList.contains('active')) return;
    let n = pPos;
    if(e.key === 'ArrowUp') n -= 10; else if(e.key === 'ArrowDown') n += 10;
    else if(e.key === 'ArrowLeft') n -= 1; else if(e.key === 'ArrowRight') n += 1;
    if(n >= 0 && n < mLayout.length && (mLayout[n] === 0 || n === 59)) { 
        pPos = n; renderM(); 
    }
};
