const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');
const btnUp = document.querySelector('#up');
const btnLeft = document.querySelector('#left');
const btnRight = document.querySelector('#right');
const btnDown = document.querySelector('#down');
const spanLives = document.querySelector('#lives');
const spanTime = document.querySelector('#time');
const spanRecord = document.querySelector('#record');
const pResult = document.querySelector('#result');

let canvasSize;
let elementSize;
let level = 0;
let lives = 3;
let timeStart;
let timePlayer;
let timeInterval;
let record;

const playerPosition = {
  x: undefined,
  y: undefined,
};

const giftPosition = {
  x: undefined,
  y: undefined,
};

let enemyPositions = [];

window.addEventListener('load', setCanvasSize);
window.addEventListener('resize', setCanvasSize);

function setCanvasSize() {
  if(window.innerHeight > window.innerWidth) {
    canvasSize = window.innerWidth * 0.7;
  } else {
    canvasSize = window.innerHeight * 0.7;
  }

  // canvasSize = Number(canvasSize.toFixed(0));

  canvas.setAttribute('width', canvasSize);
  canvas.setAttribute('height', canvasSize);

  elementSize = (canvasSize / 10) - 2;

  playerPosition.x = undefined;
  playerPosition.y = undefined;
  startGame();  
}

function startGame() {
  game.font = (elementSize - 7) + 'px Verdana';
  game.textAlign = 'end';

  const map = maps[level];

  if(!map) {
    gameWin();
    return;
  }

  if(!timeStart) {
    timeStart = Date.now();
    timeInterval = setInterval(showTime, 100)
    showRecord();
  }

  const mapRows = map.trim().split('\n');
  const mapRowCols = mapRows.map(row => row.trim().split(''));

  showLives();

  enemyPositions = [];
  game.clearRect(0, 0, canvasSize, canvasSize);
  mapRowCols.forEach((row, rowIn) => {
    row.forEach((col, colIn) => {
      const emoji = emojis[col];
      const posX = elementSize * (colIn + 1);
      const posY = elementSize * (rowIn + 1);

      if(col == 'O') {
        if(!playerPosition.x && !playerPosition.y) {
          playerPosition.x = posX;
          playerPosition.y = posY;
        }
      } else if (col == 'I') {
          giftPosition.x = posX;
          giftPosition.y = posY;
      } else if (col == 'X') {
          enemyPositions.push({
            x: posX,
            y: posY,
          });
      }
      game.fillText(emoji, posX, posY);
    })
  });

  movePlayer();
}

function movePlayer (){
  const giftCollisionX = playerPosition.x.toFixed(3) == giftPosition.x.toFixed(3);
  const giftCollisionY = playerPosition.y.toFixed(3) == giftPosition.y.toFixed(3);

  const giftCollision = giftCollisionX && giftCollisionY;

  if(giftCollision) {
    levelWin();
  }

  const enemyCollision = enemyPositions.find(enemy => {
    const enemyCollisiionX = enemy.x.toFixed(3) == playerPosition.x.toFixed(3);
    const enemyCollisiionY = enemy.y.toFixed(3) == playerPosition.y.toFixed(3);
    return enemyCollisiionX && enemyCollisiionY;
  })

  if(enemyCollision) {
    levelfail();
  }

  game.fillText(emojis['PLAYER'], playerPosition.x, playerPosition.y);
}

function levelWin() {
  level++;
  startGame();
}

function levelfail() {
  lives--;

  if (lives <= 0) {
    level = 0;
    lives = 3;
    timeStart = undefined;
  }

  playerPosition.x = undefined;
  playerPosition.y = undefined;
  startGame();
}

function gameWin() {
  console.log('Juego terminado');
  clearInterval(timeInterval);

  const recordTime = localStorage.getItem('record_time');
  const playerTime = ((Date.now() - timeStart) / 1000).toFixed(0);

  if(recordTime) {
    
    if(recordTime >= playerTime) {
      localStorage.setItem('record_time', playerTime);
      pResult.innerHTML ='Wow! te superaste';
    } else {
      pResult.innerHTML ='Terminaste! Pero no hay nuevo record';
    }
  } else {
    localStorage.setItem('record_time', playerTime);
    pResult.innerHTML ='Primera vez? Ahora supera tu record';
  }
}

function showLives() {
  const hearts = Array(lives).fill(emojis['HEART']);

  spanLives.innerHTML = "";
  hearts.forEach(heart => spanLives.append(heart));
}

function showTime() {
  spanTime.innerHTML = ((Date.now() - timeStart) / 1000).toFixed(0);
}

function showRecord() {
  spanRecord.innerHTML = localStorage.getItem('record_time');
}

window.addEventListener('keydown', moveByKeys);
btnUp.addEventListener('click', moveUp);
btnLeft.addEventListener('click', moveLeft);
btnRight.addEventListener('click', moveRight);
btnDown.addEventListener('click', moveDown);

function moveByKeys(e) {
  if(e.key == 'ArrowUp') moveUp();
  else if(e.key == 'ArrowLeft') moveLeft();
  else if(e.key == 'ArrowRight') moveRight();
  else if (e.key == 'ArrowDown') moveDown();
}

function moveUp() {
  if ((playerPosition.y - elementSize) < elementSize) {
    console.log('out');
  } else {
    playerPosition.y -= elementSize;
    startGame();
  }
}

function moveLeft() {
  if ((playerPosition.x - elementSize) < elementSize) {
    console.log('out');
  } else {
  playerPosition.x -= elementSize;
  startGame();
  }
}

function moveRight() {
  if ((playerPosition.x + elementSize) > canvasSize){
    console.log('out');
  } else {
  playerPosition.x += elementSize;
  startGame();
  }
}

function moveDown() {
  if ((playerPosition.y + elementSize) > canvasSize) {
    console.log('out');
  } else {
  playerPosition.y += elementSize;
  startGame();
  }
}