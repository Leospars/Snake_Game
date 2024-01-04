// function rand(min, max){
//     return Math.floor(Math.random()*max + min);
// }

//Field
var gridSize = 20;
var cols = 25;
var rows = 25;
var field; 

//snake head
var snakeX = gridSize*2;
var snakeY = gridSize*2;
snakeX = rand(0,cols/4) * gridSize;
snakeY = rand(0,rows/4) * gridSize;

var velocityX = 0;
var velocityY = 0;

var snakeBody = [];
var snakeSegment = {
    xpos: 0, ypos: 0, xVelocity: 0, yVelocity: 0
};

//apple
var appleX;
var appleY;

//Game logic
var gameOver = false;
var playAgain = true;
var score = 0;
var frameRate = 200; //milliseconds
var pointer = [];

window.onload = function() {
    field = document.getElementById("field");
    field.height = gridSize*rows;
    field.width = gridSize*cols;

    context = field.getContext("2d");
    document.addEventListener("keyup", changeDirection);
    
    restartButton = document.getElementById("restart");
    restartButton.addEventListener("click", restart);
    pauseButton = document.getElementById("pause");
    pauseButton.addEventListener("click", pause);
    
    placeApple();
    setInterval(update, frameRate);
}

function update() {
    if(gameOver) {
        snakeVelocity(0,0);    
        return;
    }

    //Update SnakeChan
    snakeX = 40;
    var snakeXpos = snakeX;
    var snakeYpos = snakeY;
    var setPosition = "left: " + snakeXpos + "px"; 
    console.log(setPosition);
    var snakeHead = getElementById("snakeHead");
    snakeHead.width = snakeX;

    //Draw Field
    context.fillStyle = "black";
    context.fillRect(0,0,field.width, field.height);

    //Draw Pointers
/*   context.strokeStyle = "yellow";
    for (let i = 0; i < rows; i++) {
        for(let j = 0; j< cols; j++){
            pointer.push([i*gridSize, j*gridSize]);
            context.moveTo(i*gridSize, j*gridSize);
            context.lineTo(i*gridSize+0.2, j*gridSize+0.2);
            context.stroke();
        }
    }
*/
    //Draw Apple
    context.fillStyle = "red";
    context.fillRect(appleX, appleY, gridSize, gridSize)

    //Eat Apple
    if(snakeX == appleX && snakeY == appleY){
        snakeBody.push([appleX, appleY]);
        score++;
        frameRate = Math.max(frameRate*0.95, 50);
        console.log("frameRate: ", frameRate, "ms\nscore: ", score);
        placeApple();
    }
    
    //Update Snake
    for (let i = snakeBody.length-1; i > 0; i--) {
        snakeBody[i] = snakeBody[i-1];
    }
    if(snakeBody.length) 
    snakeBody[0] = [snakeX, snakeY];
    
    context.strokeStyle = "yellow";
    context.fillStyle = "rgb(20,200,30)";
    snakeX += velocityX * gridSize;
    snakeY += velocityY * gridSize; 
    context.fillRect(snakeX, snakeY, gridSize, gridSize);
    context.strokeRect(snakeX, snakeY, gridSize, gridSize);
    context.fillStyle = "lime";
    for (let i = 0; i < snakeBody.length; i++) {
        context.fillRect(snakeBody[i][0], snakeBody[i][1], gridSize, gridSize);
    }

    //Snake_AI
    /*AI PROJECT */
    var xDistance = snakeX - appleX;
    var yDistance = snakeY - appleY;
    var appleIsRight = false;
    var appleIsUp = false;

    if(xDistance!=0 && appleIsRight && snakeXvel != -1){
        snakeVelocity(1,0); //Move Right
    }
    else if(xDistance===0){snakeVelocity(0,0)}
    else if(snakeXvel != 1){snakeVelocity (-1,0)} //Move Left
    
    if(xDistance===0){
        if(yDistance<0){ 
            appleIsUp = true}

        if(yDistance!=0 && appleIsUp && velocityY != 1){
            snakeVelocity(0,1); //Move Up
            console.log("yDistance: " + yDistance)
        } else if(yDistance===0){ snakeVelocity(0,0)}
        else /*if(velocityY != -1)*/{snakeVelocity (0,-1)} //Move Down
    }    
    if(xDistance!=0 && appleIsRight /*&& velocityX != -1*/){
        snakeVelocity(1,0); //Move Right
    }

    //GameOver Conditions
    //Out of Bounds or Snake hits itself
    function snakeCollision(){
        if (snakeX < 0 || snakeX >= field.width || snakeY < 0 || snakeY >= field.height)
            return true;
        for (i=0; i<snakeBody.length-1; i++) {
            if(snakeX == snakeBody[i][0] && snakeY == snakeBody[i][1]) 
                return true;
        }
    }

    if(snakeCollision()) {
        gameOver = true;
        let gameOverMessage = "Game Over.\nScore: " + score;
        document.getElementById("alert").innerHTML = gameOverMessage;
    }
}

function pause(){
    var paused = true;
    var xVel = xVelocity;
    var yVel = yVelocity;

        snakeVelocity(0,0);
        document.getElementById("pause").innerHTML="Continue";
        return paused = false;

        // snakeVelocity(xVel, yVel);
        // document.getElementById("pause").innerHTML="Pause";
    var field = document.getElementById("field");
    field.setAttribute()
}

function restart(){
    document.getElementById("alert").innerHTML= "";
    gameOver = false;
    placeApple();

    snakeVelocity(0,0);
    snakeBody=[];
    snakeX = rand(0,cols/4) * gridSize;
    snakeY = rand(0,rows/4) * gridSize;

    score=0;
    frameRate = 200;

    return update();
/*  document.getElementById("alert").innerHTML = "Progress will not be saved.\nWould you still like to restart?";
    yes = document.createElement("a");
    yes.innerHTML = "Yes";
    yes.setAttribute("href", "javascript:window.location.reload();");
    // yes.setAttribute("class", "no");
    document.getElementById("alert").appendChild(yes);
    no = document.createElement("p");
    no.innerHTML = "No";
    document.getElementById("alert").appendChild(no);
*/
}

function changeDirection(event) {
    if(event.code == "ArrowUp" && velocityY != 1){
        snakeVelocity(0, -1);
    } 
    else if(event.code == "ArrowDown" && velocityY != -1) {
        snakeVelocity(0, 1)
    }
    else if(event.code == "ArrowLeft" && velocityX != 1) {
        snakeVelocity(-1, 0);
    }
   else if(event.code == "ArrowRight" && velocityX != -1) {
        snakeVelocity(1, 0);
    }
}

function snakeVelocity (xVelocity, yVelocity){
    velocityX = xVelocity;
    velocityY = yVelocity;
}

function rand(smallest, largest) {
    return Math.floor(Math.random()*(largest+1-smallest) + smallest);
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

