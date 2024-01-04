// //Field
// const gridSize = 20;
// const cols = 25;
// const rows = 25;
// let field; 

// // Snake
// let snakeBody = [];

// //apple
// var appleX, appleY;
// var appleIsRight, appleIsUp;

// //Game logic
// var gameOver = false;
// var paused = false;
// var score = 0;
// var highScore = 0;
// var frameRate = 1000/1; //5fps
// var initialFrameRate = frameRate;

let xDistToApple, yDistToApple;
var snake = new Snake();

window.onload = function() {
    field = document.getElementById("field");
    field.height = gridSize*rows;
    field.width = gridSize*cols;
    
    context = field.getContext("2d");
    document.addEventListener("keyup", changeDirection);
    document.body.addEventListener("keyup", spacebarPause);
    
    restartButton = document.getElementById("restart");
    restartButton.addEventListener("click", restart);
    pauseButton = document.getElementById("pause");
    pauseButton.addEventListener("click", pause);
    gridlinesButton = document.getElementById("gridlines");
    gridlinesButton.addEventListener("click", gridlines);
    
    snakeInitialPosition();
    placeApple();
    setInterval(update, frameRate);
    // window.requestAnimationFrame(update);
}

let frame=1;
let time = 0;
function update() {
    if(gameOver) {
        snake.velocity(0,0);    
        return;
    }
    // if(frame === 2) return; 
    if (frame%60 === 0) {
        time++;
        console.log("Time: " + time + "sec");
    }
    if(!paused){
        frame++;
        console.log(frame);
        //Draw Field
        context.fillStyle = "black";
        context.fillRect(0,0,field.width, field.height);

        //Draw Apple
        context.fillStyle = "red";
        context.fillRect(appleX, appleY, gridSize, gridSize)

        if(!isArraySame([snake.xVel, snake.yVel], [0,0])){
            //Update Snake
            snakeBody.unshift([snake.xPos, snake.yPos]);   
            snakeBody.pop();     
        }

        //Move Snake
        snake.xPos += snake.xVel * gridSize;
        snake.yPos += snake.yVel * gridSize; 

        context.strokeStyle = "yellow";
        context.fillStyle = "rgb(20,200,30)";
        context.fillRect(snake.xPos, snake.yPos, gridSize, gridSize);
        context.strokeRect(snake.xPos, snake.yPos, gridSize, gridSize);
        
        outlineSnake();
        context.fillStyle = "lime";
        for (let i = 0; i <= snakeBody.length-1; i++) {
            context.fillRect(snakeBody[i][0], snakeBody[i][1], gridSize, gridSize);
            // context.strokeRect(snakeBody[i][0], snakeBody[i][1], gridSize, gridSize);
        } 


    }

    //Eat Apple
    if(wasAppleAte()){
        score++;
        highScore = Math.max(highScore, score);
        document.getElementById("highScore").innerHTML= (highScore);
        document.getElementById("score").innerHTML= (score);
        
        frameRate = Math.max(frameRate*0.95, 50);
        console.log("frameRate: ", frameRate, "ms\nscore: ", score);

        snakeBody.push([appleX, appleY]);
        placeApple();
        context.fillStyle = "red";
        context.fillRect(appleX, appleY, gridSize, gridSize)
    }

    if(snakeBody.length ==  rows*cols+1){
        document.getElementById("GameOver").innerHTML = "YOU WON 🥳\n Best High Score";
        field.classList.add('hidden');
        gameOver = true;
        console.log("YOU WON :)")
        return;
    }

    if(snakeHeadCollide(snake.xPos, snake.yPos)) {
        gameOver = true;
        document.getElementById("GameOver").innerHTML = "Game Over";
        let gameOverMessage = "Game Over.\nScore: " + score;
    }
    // window.requestAnimationFrame(update);
}
//GameOver Conditions
//Out of Bounds or Snake hits itself
function snakeHeadCollide(testX, testY){
    if (testX < 0 || testX >= field.width || testY < 0 || testY >= field.height)
            return true;
    for (let i=0; i<snakeBody.length-1; i++) {
        if(isSamePoint([testX, testY], snakeBody[i]))
            return true;
    }
    return false;
}
    
function spacebarPause(event){
    if(event.key == ' ' || event.code == 'Space' || event.keyCode ==32){
        console.log("Spacebar was clicked.")
        pause();
    }
}

function pause(){
    if(paused){
        console.log("Game continued.");
        console.log(storedVelocity);
        snake.velocity(storedVelocity[0], storedVelocity[1])
        document.getElementById("pause").innerHTML="⏸️";
        paused = false;
    }
    else{
        storedVelocity = [snake.xVel, snake.yVel];
        snake.velocity(0,0);
        document.getElementById("pause").innerHTML="▶️";
        paused = true;
    }
        
    // var field = document.getElementById("field");
    // field.setAttribute()
}

function restart(){
    document.getElementById("GameOver").innerHTML= "Press Any Arrow Key to Begin";
    document.getElementById("score").innerHTML= "";
    field.classList.remove("hidden");
    snake.velocity(0,0);
    
    gameOver = false;
    paused = false;
    frame = 1;
    score = 0;
    frameRate = initialFrameRate; //milliseconds

    arrowKeysPressed = ["ArrowRight"];
    frameOnArrowKeyPressed = [];

    snakeInitialPosition();
    placeApple();

    return setInterval(update(), frameRate);
}

function moveRight(){ snake.velocity(1,0);} 
function moveLeft(){ snake.velocity(-1,0);} 
function moveUp(){ snake.velocity(0,-1);} 
function moveDown(){ snake.velocity(0,1);} 

let arrowKeysPressed = [0];
let frameOnArrowKeyPressed = [];

function changeDirection(event) {
    //If Arrow Keys are clicked
    if(event.keyCode >= 37 && event.keyCode <= 40){
        paused = false;
        if(frame === 2){
            frame++;
            document.getElementById("GameOver").innerHTML= "";
            window.requestAnimationFrame(update);
        } 

        frameOnArrowKeyPressed.push(frame);
        const lastframeKeyPressed = frameOnArrowKeyPressed[frameOnArrowKeyPressed.length-2]
        const currentFrame = frame;
        if(currentFrame === lastframeKeyPressed){
            update();
        }
        
        let previousKeyPressed = arrowKeysPressed[arrowKeysPressed.length-1];
        let snakeIsVertical = (previousKeyPressed == "ArrowUp" || previousKeyPressed == "ArrowDown");
        let snakeIsHorizontal = (previousKeyPressed == "ArrowRight" || previousKeyPressed == "ArrowLeft");
        switch (event.code) {
            case "ArrowUp":
                if(!snakeIsVertical){
                    moveUp(); console.log("moveup");
                    arrowKeysPressed.push(event.code);
                } 
                break;
            case "ArrowDown":
                if(!snakeIsVertical) {
                    moveDown(); console.log("move Down");
                    arrowKeysPressed.push(event.code);
                }
                break;
            case "ArrowLeft":
                if(arrowKeysPressed.length<2) break;
                if(!snakeIsHorizontal) {
                    moveLeft(); console.log("Move Left");
                    arrowKeysPressed.push(event.code);
                }
                break;
            case "ArrowRight":
                if(!snakeIsHorizontal) {
                    moveRight(); console.log("Move Right");
                    arrowKeysPressed.push(event.code);
                }
                break;
            default:
                break;
        }
    }
}


function rand(min, max) {
    return Math.floor(Math.random()*(max+1-min) + min);
}

function placeApple() {
    randX = rand(0,cols-1) * gridSize;
    randY = rand(0,rows-1) * gridSize;
    for (i=0; i<snakeBody.length-1; i++) {
        if(randX == snakeBody[i][0] && randY == snakeBody[i][1]){
            placeApple();
        }
    }
    appleX = randX;
    appleY = randY;
}

const isArraySame = (arr1, arr2) => {
    return (JSON.stringify(arr1) === JSON.stringify(arr2))
}

const isSamePoint = (p1,p2) => {
    return (p1[0] == p2[0] && p1[1]==p2[1]);
}

const wasAppleAte = () => {
    return isSamePoint([snake.xPos, snake.yPos], [appleX, appleY]);
}

function snakeInitialPosition(){
    snake.xPos = rand(3,cols/4) * gridSize;
    snake.yPos = rand(0,rows/4) * gridSize;
    snake.head = [snake.xPos,snake.yPos]; 
    snakeBody = [[snake.xPos-gridSize, snake.yPos], [snake.xPos-gridSize*2, snake.yPos]];
}

function snakeVelocity (horizontal, vertical){
    snake.xVel = horizontal;
    snake.yVel = vertical;
}

function outlineSnake(){

    for (let i = 1; i < snakeBody.length-1; i++) {
        
        let centerOffset = gridSize/2;
        context.strokeStyle = "grey";
        context.moveTo(snakeBody[i][0] + centerOffset, snakeBody[i][1]+centerOffset);
        context.lineTo(snakeBody[i+1][0]+centerOffset, snakeBody[i+1][1]+centerOffset);
        context.stroke();
    };

}
let gridlineIsVisible = false;
const hideGridlines = () => {
    //Draw Field
    context.fillStyle = "purple";
    context.fillRect(0,0,field.width-60, field.height);
    
}
function gridlines(){

console.log("code was run");
    if(!gridlineIsVisible){
       context.strokeStyle = "grey";
        for (let i = 0; i < field.height; i++) {
            context.moveTo(0, gridSize*i);
            context.lineTo(field.width, gridSize*i);
            context.stroke();
        }
        for (let i = 0; i < field.width; i++) {
            context.moveTo(gridSize*i, 0);
            context.lineTo(gridSize*i, field.height);
            context.stroke();
        } 
        gridlineIsVisible = true;
    }
    else{
        hideGridlines();
        gridlineIsVisible = false;
    }
}
