//Remember \Snake_GM\snakeAI_Pref_Dir.js
/* - - - - - - - - - 
  SNAKE GAME SOLID
 - - - - - - - - - */
/* Basic Snake Game no additions or extra */

// import {Snake} from "./snake.js";

//Field
const gridSize = 25;
const cols = 24;
const rows = 24;
let field; 

//snake
var snake = new Snake();

//apple
var appleX, appleY;

//Game logic
let gameOver = false,
    paused = false;
    score = 0,
    highScore = 0;
let gameUpdate;
let frameRate = 1000/10; //100fps
let initialFrameRate = frameRate;
let frame = 0;

//Move Snake Functions
function moveRight(){ snake.velocity(1,0);} 
function moveLeft(){ snake.velocity(-1,0);} 
function moveUp(){ snake.velocity(0,-1);} 
function moveDown(){ snake.velocity(0,1);} 

//AI variables
let run_AI_Pref_Dir = false;
let run_AI_Hamil_Cycle = false;

//Field
field = document.getElementById("field");
    field.height = gridSize*rows;
    field.width = gridSize*cols;

//Canvas
let context = field.getContext("2d");

window.onload = function() {
    //Keyboard Listeners
    document.body.addEventListener("keyup", spacebarPause);
    document.addEventListener("keyup", changeDirection);
    
    //Focus on canvas when window loads
    field.focus();
    
    //Initialize Buttons
    setButtonEvents();
    
    //AI buttons
    new Button("ai_hc").click(function() {
        if(run_AI_Pref_Dir) run_AI_Pref_Dir = !run_AI_Pref_Dir;
        run_AI_Hamil_Cycle = !run_AI_Hamil_Cycle;
        console.log("AI_HC: ", run_AI_Hamil_Cycle);
    });
    new Button("ai_pref_dir").click(function(){
        if(run_AI_Hamil_Cycle) run_AI_Hamil_Cycle = !run_AI_Hamil_Cycle;
        run_AI_Pref_Dir = toggle(run_AI_Pref_Dir); 
        console.log("AI_Pref_Dir: ", run_AI_Pref_Dir);
    });
    
    //Initialize Game
    snake.initialPosition();
    placeApple();
    gameUpdate = setInterval( newFrame, frameRate);
}
function newFrame(){
    window.requestAnimationFrame(update);
}
function toggle(bool){
    return !bool;
}
function refreshAnimation(){
    clearInterval(gameUpdate);
    gameUpdate = setInterval( newFrame, frameRate);
}

function update() {
    if(gameOver) {
        snake.velocity(0,0);    
        return;
    }
    
    if(frame === 0){
        console.log("Do tha thang.")
        pause();
    }
    
    if(!paused) {
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
        else snake.updateSnake();

        //Initialize AI
        let xDistToApple = snake.xPos - appleX;
        let yDistToApple = snake.yPos - appleY;

        // Run AI
        if (run_AI_Pref_Dir === true) {
            snakeAI_Pref_Dir(xDistToApple, yDistToApple);
        }
        if (run_AI_Hamil_Cycle === true) snakeAIHamilCycle();

        //Update Canvas
        //Draw Head new position
        context.strokeStyle = "yellow";
        context.fillStyle = "rgb(20,160,30)";
        context.fillRect(snake.xPos, snake.yPos, gridSize, gridSize);
        context.strokeRect(snake.xPos, snake.yPos, gridSize, gridSize);
        
        //Draw Snake Body new position
        context.fillStyle = "lime";
        for (let i = 0; i <= snake.body.length-1; i++) {
            context.fillRect(snake.body[i][0], snake.body[i][1], gridSize, gridSize);
        }

        //Trace Snake center
        // outlineSnake();
    }
    //Eat Apple
    if(appleWasAte()){
        score++;
        highScore = Math.max(highScore, score);
        document.getElementById("highScore").innerHTML= (highScore);
        document.getElementById("score").innerHTML= (score);

        // frameRate = Math.max(frameRate*0.95, 50);
        console.log("frameRate: ", frameRate, "ms\nscore: ", score);

        snake.body.push([appleX, appleY]);
        placeApple();
        context.fillStyle = "red";
        context.fillRect(appleX, appleY, gridSize, gridSize)
    }

    if(snake.body.length ==  rows*cols+1){
        document.getElementById( "GameOver").innerHTML = "YOU WON 🥳\n Best High Score";
        field.classList.add('hidden');
        gameOver = true;
        console.log("YOU WON :)");
        return;
    }

    if(snakeHeadCollide(snake.head)) {
        gameOver = true;
        document.getElementById("GameOver").innerHTML = "Game Over";
    }

    if(isSuperSpeedOn){
        window.requestAnimationFrame(update);
    }
}

//GameOver Conditions
//Out of Bounds or Snake hits itself
function snakeHeadCollide([testX, testY] = snake.head){
    if (isOutsideField([testX, testY]))
        return true;
    for (let i= 0; i<snake.body.length-1; i++) {
        if(testX == snake.body[i][0] && testY == snake.body[i][1]) {
            // console.log("why are you hitting yourself");
            return true;
        }
    }
    return false;
}

function isOutsideField([testX, testY], xBoundary = [0,field.width], yBoundary = [0,field.height]){
    return (testX < xBoundary[0] || testX >= xBoundary[1] || testY < yBoundary[0]  || testY >= yBoundary[1]);
}

function spacebarPause(event){
    if(event.key == ' ' || event.code == 'Space' || event.keyCode ==32){
        console.log("Spacebar was clicked.")
        pause();
    }
}

let directionBuffer = [];
let arrowKeyPressed = false;
function changeDirection(event) {
    if (event.keyCode >= 37 && event.keyCode <= 40) {
        document.getElementById("pause").innerHTML = "⏸️";
        paused = false;

        if (event.code == "ArrowUp" && snake.yVel != 1) {
            moveUp();
        } else if (event.code == "ArrowDown" && snake.yVel != -1) {
            moveDown();
        } else if (event.code == "ArrowLeft" && snake.xVel != 1) {
            moveLeft();
        } else if (event.code == "ArrowRight" && snake.xVel != -1) {
            moveRight();
        }
        snake.updateSnake();
        arrowKeyPressed = true;
    }
}

function rand(smallest, largest) {
    return Math.floor(Math.random()*(largest+1-smallest) + smallest);
}
function placeApple() {
    randX = rand(0,cols-1) * gridSize;
    randY = rand(0,rows-1) * gridSize;
    for (let i=0; i<snake.body.length-1; i++) {
        if(randX == snake.body[i][0] && randY == snake.body[i][1]){
            placeApple();
        }
    }
    appleX = randX;
    appleY = randY;
}

const appleWasAte = () => {
    return isSamePoint([snake.xPos, snake.yPos], [appleX, appleY]);
}

const isArraySame = (arr1, arr2) => {
    let i = 0;
    let isSame= false;
    for (let i = 0; i < arr1.length; i++) {
        if(arr1[i]=== arr2[i]) isSame = true;
        else { isSame= false; break}
    }
    return isSame;
    // return (JSON.stringify(arr1) === JSON.stringify(arr2))
}

const isSamePoint = (p1,p2) => {
    return (p1[0] == p2[0] && p1[1]==p2[1]);
}

function outlineSnake(){
    const snakeBody = snake.body;
    let centerOffset = gridSize/2;
    context.strokeStyle = "grey";
    let i =0;
    context.moveTo(snakeBody[0][0] + centerOffset, snakeBody[i][1]+centerOffset);
    context.lineTo(snakeBody[i+1][0]+centerOffset, snakeBody[i+1][1]+centerOffset);
    context.stroke();
}