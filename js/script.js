// Меню
const menuBtn = document.getElementById('menuBtn');
const gameMenu = document.getElementById('gameMenu');
menuBtn.addEventListener('click', (e) => { e.stopPropagation(); gameMenu.classList.toggle('show'); });
document.addEventListener('click', () => gameMenu.classList.remove('show'));

function selectGame(id) {
    document.querySelectorAll('.game-card').forEach(c => c.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    if(id === 'maze') initMaze();
}

// 1. РЕАКЦИЯ
let rTimer, rTimeLeft = 30, rScore = 0, rAppear;
function startReactionGame() {
    rScore = 0; rTimeLeft = 30;
    document.getElementById('react-clicks').innerText = 0;
    document.getElementById('start-msg').innerText = "Лови кнопку!";
    clearInterval(rTimer);
    rTimer = setInterval(() => {
        rTimeLeft--;
        document.getElementById('react-timer').innerText = rTimeLeft;
        if(rTimeLeft <= 0) { clearInterval(rTimer); alert("Время вышло! Результат: " + rScore); }
    }, 1000);
    moveTarget();
}

function moveTarget() {
    const btn = document.getElementById('target-btn');
    const area = document.getElementById('reaction-area');
    if(rTimeLeft <= 0) { btn.style.display = 'none'; return; }
    btn.style.display = 'none';
    setTimeout(() => {
        const x = Math.random() * (area.clientWidth - 80);
        const y = Math.random() * (area.clientHeight - 40);
        btn.style.left = x + 'px'; btn.style.top = y + 'px';
        btn.style.display = 'block';
    }, Math.random() * 1500 + 500);
}

document.getElementById('target-btn').onclick = () => { rScore++; document.getElementById('react-clicks').innerText = rScore; moveTarget(); };

// 2. КРЕСТИКИ-НОЛИКИ
let tttB = Array(9).fill(null), tttA = true, curP = 'X';
let tttW = { X: 0, O: 0 };

document.querySelectorAll('.cell').forEach(c => {
    c.onclick = (e) => {
        const i = e.target.dataset.index;
        if(!tttB[i] && tttA) {
            tttB[i] = curP; e.target.innerText = curP; e.target.classList.add(curP.toLowerCase());
            checkWinner();
            curP = curP === 'X' ? 'O' : 'X';
            document.getElementById('ttt-status').innerText = `Ход: ${curP}`;
        }
    };
});

function checkWinner() {
    const win = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    for(let s of win) {
        if(tttB[s[0]] && tttB[s[0]] === tttB[s[1]] && tttB[s[0]] === tttB[s[2]]) {
            alert("Победил " + tttB[s[0]]); tttW[tttB[s[0]]]++;
            document.getElementById('win-' + tttB[s[0]].toLowerCase()).innerText = tttW[tttB[s[0]]];
            tttA = false; return;
        }
    }
}
function resetTTT() { tttB.fill(null); tttA = true; document.querySelectorAll('.cell').forEach(c => {c.innerText=''; c.className='cell';}); }

// 3. ЛАБИРИНТ
const mLayout = [
    1,1,1,1,1,1,1,1,1,1,
    0,0,0,1,0,0,0,0,0,1,
    1,1,0,1,0,1,1,1,0,1,
    1,0,0,0,0,1,0,0,0,1,
    1,0,1,1,1,1,0,1,1,1,
    1,0,0,0,0,0,0,1,0,0,
    1,1,1,1,1,1,0,1,0,1,
    1,0,0,0,0,1,0,0,0,1,
    1,0,1,1,0,0,0,1,1,1,
    1,1,1,1,1,1,1,1,1,1
];
let pPos = 10, mTime = 0, mInt;
function initMaze() {
    const cont = document.getElementById('maze-container'); cont.innerHTML = '';
    mLayout.forEach((v, i) => { 
        const d = document.createElement('div'); d.className = 'maze-cell ' + (v===1?'wall':'');
        if(i===59) d.classList.add('exit'); cont.appendChild(d);
    });
    pPos = 10; mTime = 0; clearInterval(mInt);
    mInt = setInterval(() => { mTime++; document.getElementById('maze-timer').innerText = mTime; }, 1000);
    renderPlayer();
}
function renderPlayer() {
    document.querySelectorAll('.maze-cell').forEach(c => c.classList.remove('player'));
    document.querySelectorAll('.maze-cell')[pPos].classList.add('player');
    if(pPos === 59) { clearInterval(mInt); alert("Победа за " + mTime + " сек!"); }
}
window.onkeydown = (e) => {
    if(!document.getElementById('maze').classList.contains('active')) return;
    let n = pPos;
    if(e.key === 'ArrowUp') n -= 10; else if(e.key === 'ArrowDown') n += 10;
    else if(e.key === 'ArrowLeft') n -= 1; else if(e.key === 'ArrowRight') n += 1;
    if(mLayout[n] === 0 || n === 59) { pPos = n; renderPlayer(); }
};
