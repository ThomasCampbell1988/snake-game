const width = 12;
const height = 12;
const board = document.querySelector("#board");
const scoreSpan = document.querySelector("#score-span");
const hueSeed = Math.floor(Math.random() * 360);

let snake = [
  { x: 3, y: 4},
  { x: 4, y: 4},
  { x: 5, y: 4}, // head
]
let direction = "right";
let previousDirection = "";
let apple;
let score = 0;
let gameState = "ready"; // ready, running, over
let timeoutInterval = 180;

relocateApple();
redrawUI();

function start() {
  gameState = "running";
  setTimeout(step, timeoutInterval);
}

function step() {
  // update the state of the game
  updateState();

  // redraw the ui
  redrawUI();

  // schedule step if game is still runnning
  if(gameState === "running") {
    setTimeout(step, timeoutInterval);
  }
}

function updateState() {
  previousDirection = direction;
  
  let currentHead = snake[snake.length - 1];
  let nextHead = {
    x: currentHead.x,
    y: currentHead.y
  };
  
  if(direction === "up") {
    nextHead.y--;
  }
  if(direction === "down") {
    nextHead.y++;
  }
  if(direction === "left") {
    nextHead.x--;
  }
  if(direction === "right") {
    nextHead.x++;
  }

  if(nextHead.x >= width || nextHead.x < 0 ||
    nextHead.y >= height || nextHead.y < 0 ||
    snake.some(cell => cell.x === nextHead.x && cell.y === nextHead.y)
    ) {
    // end game
    gameState = "over";
  } else {
    snake.push(nextHead);
  
    if(nextHead.x === apple.x && nextHead.y === apple.y) {
      // eating the apple
      score++;
      // move the apple
      relocateApple();
      // increase snake speed
      timeoutInterval = timeoutInterval * 0.9;
    } else {
      snake.shift();
    }
  }

}

function redrawUI(){
  // reset board divs
  board.innerHTML = "<div></div>".repeat(width * height);

  // draw snake on grid
  snake.forEach( (cell, index) => {
    let x = cell.x;
    let y = cell.y;
    let innerDiv = document.createElement("div");
    innerDiv.className = "snake";
    let hue = hueSeed + (index * 27);
    innerDiv.style.backgroundColor = `hsl(${hue}, 100%, 71%)`;
    let margin = Math.min((snake.length - index) * 2, 32);
    innerDiv.style.margin = `${margin}%`;
    board.children[ (width * y) + x].appendChild(innerDiv);
  })

  // draw apple
  let appleImg = document.createElement("img");
  appleImg.className = "apple";
  appleImg.src = "apple.png";
  board.children[ (width * apple.y) + apple.x].appendChild(appleImg);

  // update the score
  scoreSpan.textContent = score;
}

function relocateApple() {
  apple = {
    x: Math.floor(Math.random() * width),
    y: Math.floor(Math.random() * height)
  };
  if(snake.some(cell => cell.x === apple.x && cell.y === apple.y)) {
    relocateApple();
  }
}

onkeydown = (keyboardEvent) => {
  let code = keyboardEvent.code;
  console.log(code);
  if(gameState == "ready") {
    start();
  }
  if(code === "ArrowUp" && previousDirection !== "down") {
    direction = "up";
  }
  if(code === "ArrowDown" && previousDirection !== "up") {
    direction = "down";
  }
  if(code === "ArrowLeft" && previousDirection !== "right") {
    direction = "left";
  }
  if(code === "ArrowRight" && previousDirection !== "left") {
    direction = "right";
  }
}