/* - - - - - - - - -
  SNAKE GAME MAIN
 - - - - - - - - - */
/* Basic Snake Game with auto win */

//Field
const gridSize = 20;
const cols = 6;
const rows = 6;

let snake = new Snake(); //snake
let appleX, appleY; //apple

//Game logic
let gameOver = false,
    paused = false,
    score = 0,
    highScore = 0;
let gameUpdate;
let frameRate = 1000 / 4; //20fps
let initialFrameRate = frameRate;
let frame = 0;

//Move Snake Functions
const moveRight = (snakeObj = snake) => snakeObj.velocity(1, 0);
const moveLeft = (snakeObj = snake) => snakeObj.velocity(-1, 0);
const moveUp = (snakeObj = snake) => snakeObj.velocity(0, -1);
const moveDown = (snakeObj = snake) => snakeObj.velocity(0, 1);

//AI variables
var run_AI_Pref_Dir = false;
var run_AI_Find_Path = false;

//Field
const field = document.getElementById("field");
field.height = gridSize * rows;
field.width = gridSize * cols;

const overlay = document.getElementById("overlay");
overlay.height = field.height;
overlay.width = field.width;

//Canvas
const context = field.getContext("2d");
const gridContext = overlay.getContext("2d");

window.onload = function () {
    //Keyboard Listeners
    document.body.addEventListener("keyup", spacebarPause);
    document.addEventListener("keyup", changeDirection);

    field.focus(); //Focus on canvas when window loads

    //Initialize Buttons
    setButtonEvents();

    //Initialize Game
    snake.initializePosition();
    placeApple();
    gameUpdate = setInterval(newFrame, frameRate);
}

function newFrame() {
    window.requestAnimationFrame(update);
}

function refreshAnimation() {
    clearInterval(gameUpdate);
    gameUpdate = setInterval(newFrame, frameRate);
}

function update() {
    if (gameOver) {
        drawSnake()
        snake.velocity(0, 0);
        clearInterval(gameUpdate);
        return;
    }

    if (frame === 0) {
        console.log("Do tha thang.")
        pause_play();
    }

    if (!paused) {
        frame++;

        //Draw Field
        context.fillStyle = "black";
        context.clearRect(0, 0, field.width, field.height);
        context.fillRect(0, 0, field.width, field.height);

        //Draw Apple
        context.fillStyle = "red";
        context.fillRect(appleX, appleY, gridSize, gridSize)

        //Update Snake
        /* When direction is pressed snake is updated so if statement prevents two
         * consecutive updates */
        if (arrowKeyPressed) arrowKeyPressed = !arrowKeyPressed;
        else snake.update();

        //Initialize AI
        let xDistToApple = snake.xPos - appleX;
        let yDistToApple = snake.yPos - appleY;

        // Run AI
        if (run_AI_Pref_Dir === true) {
            snakeAI_Pref_Dir(xDistToApple, yDistToApple);
        }
        if (run_AI_Find_Path === true) {
            snakeBestAI();
        }

        //Update Canvas
        drawSnake();

        //Eat Apple
        if (appleWasAte()) {
            score++;
            highScore = Math.max(highScore, score);
            document.getElementById("highScore").innerHTML = (highScore);
            document.getElementById("score").innerHTML = (score);

            // frameRate = Math.max(frameRate*0.95, 50);
            console.log("frameRate: ", frameRate, "ms\nscore: ", score);

            snake.grow();

            //Win Game
            if (snake.body.length === rows * cols - 1) {
                document.getElementById("GameOver").innerHTML = "YOU WON 🥳\n Best High Score";
                field.classList.add('hidden');
                gameOver = true;
                console.log("YOU WON :)");
                return;
            }

            placeApple();
        }
    }

    if (isSnakeCollide(snake.head)) {
        gameOver = true;
        document.getElementById("GameOver").innerHTML = "Game Over";
    }

    if (isSuperSpeedOn) {
        window.requestAnimationFrame(update);
    }
}

//GameOver Conditions
//Out of Bounds or Snake hits itself
function isSnakeCollide([testX, testY] = snake.head, blocks = snake.body) {
    if (isOutsideField([testX, testY]))
        return true;
    for (let i = 0; i < blocks.length; i++) {
        if (testX === blocks[i][0] && testY === blocks[i][1]) {
            // console.log("why are you hitting yourself");
            return true;
        }
    }
    return false;
}

function isOutsideField([testX, testY], xBoundary = [0, field.width], yBoundary = [0, field.height]) {
    return (testX < xBoundary[0] || testX >= xBoundary[1] || testY < yBoundary[0] || testY >= yBoundary[1]);
}

function drawSnake(snakeObj = snake, headColor = "rgb(20,160,30)", bodyColor = "lime", grid = gridSize) {
    //Draw Snake Body new location
    let pad = 1;
    context.fillStyle = bodyColor;
    for (let i = 0; i <= snakeObj.body.length - 1; i++) {
        context.fillRect(snakeObj.body[i][0] + pad, snakeObj.body[i][1] + pad, grid - pad - 1, grid - pad - 1);
    }

    //Draw Head new location
    context.strokeStyle = "yellow";
    context.fillStyle = headColor;
    context.fillRect(snakeObj.xPos + pad, snakeObj.yPos + pad, grid - pad - 1, grid - pad - 1);
    // context.strokeRect(snakeObj.xPos + pad, snakeObj.yPos + pad, grid-pad-1, grid-pad-1);

}

function spacebarPause(event) {
    if (event.key === ' ' || event.code === 'Space' || event.keyCode === 32) {
        console.log("Spacebar was clicked.")
        pause_play();
    }
}

let directionBuffer = [];
let arrowKeyPressed = false;

function changeDirection(event) {
    if (event.keyCode >= 37 && event.keyCode <= 40) {
        document.getElementById("pause_play").innerHTML = "⏸️";
        paused = false;

        if (event.code === "ArrowUp" && snake.yVel !== 1) {
            moveUp();
        } else if (event.code === "ArrowDown" && snake.yVel !== -1) {
            moveDown();
        } else if (event.code === "ArrowLeft" && snake.xVel !== 1) {
            moveLeft();
        } else if (event.code === "ArrowRight" && snake.xVel !== -1) {
            moveRight();
        }
        snake.update();
        arrowKeyPressed = true;
    }
}

function rand(smallest, largest) {
    return Math.floor(Math.random() * (largest + 1 - smallest) + smallest);
}

let randX, randY;
function placeApple() {
    randX = rand(0, cols - 1) * gridSize;
    randY = rand(0, rows - 1) * gridSize;

    let appleIntersectBody = false;
    snake.body.forEach((block) => {
        if (isArraySame(block, [randX, randY])) {
            appleIntersectBody = true;
        }
    });

    if (appleIntersectBody || isSamePoint([snake.xPos, snake.yPos], [randX, randY])) {
            placeApple();
    }

    appleX = randX;
    appleY = randY;
    context.fillStyle = "red";
    context.fillRect(appleX, appleY, gridSize, gridSize)
}

const appleWasAte = () => {
    return isSamePoint([snake.xPos, snake.yPos], [appleX, appleY]);
}

const isArraySame = (arr1, arr2) => {
    if (arr1.length !== arr2.length)
        return false;

    let isSame = false;
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] === arr2[i])
            isSame = true;
        else {
            isSame = false;
            break;
        }
    }
    return isSame;
    // return (JSON.stringify(arr1) === JSON.stringify(arr2))
}

const isSamePoint = (p1, p2) => {
    return (p1[0] === p2[0] && p1[1] === p2[1]);
}

function outlineSnake() {
    const snakeBody = snake.body;
    let centerOffset = gridSize / 2;
    context.strokeStyle = "grey";
    let i = 0;
    context.moveTo(snakeBody[0][0] + centerOffset, snakeBody[i][1] + centerOffset);
    context.lineTo(snakeBody[i + 1][0] + centerOffset, snakeBody[i + 1][1] + centerOffset);
    context.stroke();
}