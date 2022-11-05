const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');
const btnUp = document.querySelector('#up');
const btnLeft = document.querySelector('#left');
const btnRight = document.querySelector('#right');
const btnDown = document.querySelector('#down');
const spanLives = document.querySelector('#lives');
const spanTime = document.querySelector('#time');
const spanRecord = document.querySelector('#record');

let canvasSize;
let elementsSize;
let level = 0;
let lives = 3;

let timeStart;
let timePlayer;
let timeInterval;

const xOffset = 10;
const yOffset = -9;

const playerPosition = {
  x: undefined,
  y: undefined
};

const giftPosition = {
  x: undefined,
  y: undefined
};

let enemiesPositions = [];

window.addEventListener('load', setCanvasSize);
window.addEventListener('resize', setCanvasSize);

function setCanvasSize() {
  if (window.innerHeight > window.innerWidth) {
    canvasSize = window.innerWidth * 0.8;
  } else {
    canvasSize = window.innerHeight * 0.8;
  }
    
  canvas.setAttribute('width', canvasSize);
  canvas.setAttribute('height', canvasSize);
  
  elementsSize = canvasSize / 10;
  showRecord();

  playerPosition.x = undefined;
  playerPosition.y = undefined;

  startGame();
}

function startGame() {
  game.font = elementsSize + 'px Verdana';
  game.textAlign = 'end';

  if (level >= maps.length) {
    gameWin();
    return;
  };

  if (!timeStart) {
    timeStart = Date.now();
    timeInterval = setInterval(showTime, 100);
  };

  const map = maps[level];
  const mapRows = map.trim().split('\n');
  const mapRowCols = mapRows.map(row => row.trim().split(''));
  
  showLives();
  showTime();

  enemiesPositions = [];
  game.clearRect(0,0,canvasSize, canvasSize);
  mapRowCols.forEach((row, rowI) => {
    row.forEach((col, colI) => {
      const emoji = emojis[col];
      const posX = Math.round(((elementsSize * (colI + 1)) + xOffset)*100)/100;
      const posY = Math.round(((elementsSize * (rowI + 1)) + yOffset)*100)/100;

      if (col == 'O') {
        if (!(playerPosition.x && playerPosition.y)) {
          playerPosition.x = posX;
          playerPosition.y = posY;
        }
      } else if (col == 'I') {
        giftPosition.x = posX;
        giftPosition.y = posY;
      } else if (col == 'X') {
        enemiesPositions.push({
          x: posX,
          y: posY
        })
      };

      game.fillText(emoji, posX, posY);
    });
  });

  movePlayer();
}

function movePlayer() {
  playerPosition.x = Math.round(playerPosition.x * 100) / 100
  playerPosition.y = Math.round(playerPosition.y * 100) / 100
  const enemyCollision = enemiesPositions.find(enemy => 
    enemy.x == playerPosition.x && enemy.y == playerPosition.y);

  const giftCollision = (playerPosition.x == giftPosition.x) && 
                        (playerPosition.y == giftPosition.y);

  if (giftCollision) {
    levelWin();
    startGame();
  } else if (enemyCollision) {
    levelFail();
  };            
  
  
  game.fillText(emojis['PLAYER'], playerPosition.x, playerPosition.y);
};

function levelWin() {
  level++;
};

function levelFail() {
  lives--
  console.log('vidas: ' + lives)
  if (lives < 0) {
    level = 0;
    lives = 3;
    clearInterval(timeInterval)
    timeStart = undefined;
  };

  playerPosition.x = undefined;
  playerPosition.y = undefined;
  startGame();
};

function gameWin() {
  console.log('ganastes');
  game.fillText('GANASTES', canvasSize, canvasSize/2);
  clearInterval(timeInterval);

  const recordTime = localStorage.getItem('record_time');

  if (!recordTime) {
    localStorage.setItem('record_time', (Date.now() - timeStart))
  } else if ((Date.now() - timeStart) < recordTime) {
    localStorage.setItem('record_time', (Date.now() - timeStart))
  };
  showRecord()
};

function showLives() {
  const heartsArray = Array(lives).fill(emojis['HEART']) 
  spanLives.innerHTML = heartsArray.join("");
};

function showTime() {
  spanTime.innerHTML = Date.now() - timeStart;
};

function showRecord() {
  spanRecord.innerHTML = localStorage.getItem('record_time');
};

window.addEventListener('keydown', moveByKeys);
btnUp.addEventListener('click', moveUp);
btnLeft.addEventListener('click', moveLeft);
btnRight.addEventListener('click', moveRight);
btnDown.addEventListener('click', moveDown);

function moveByKeys(event) {
  if (event.key == 'ArrowUp' || event.key == 'w') moveUp();
  else if (event.key == 'ArrowLeft' || event.key == 'a') moveLeft();
  else if (event.key == 'ArrowRight' || event.key == 'd') moveRight();
  else if (event.key == 'ArrowDown' || event.key == 's') moveDown();
};

function moveUp() {
  if ((playerPosition.y - elementsSize) < 0) {

  } else {
  playerPosition.y = playerPosition.y - elementsSize;
  startGame();  
  };
};

function moveLeft() {
  if ((playerPosition.x - elementsSize) < elementsSize) {

  } else {
    playerPosition.x = playerPosition.x - elementsSize;
    startGame();
  };
};

function moveRight() {
  if (playerPosition.x > canvasSize) {

  } else {
    playerPosition.x = playerPosition.x + elementsSize;
    startGame();
  }
};

function moveDown() {
  if ((playerPosition.y + elementsSize) > canvasSize) {

  } else {
    playerPosition.y = playerPosition.y + elementsSize;
    startGame();
  };
};

    



