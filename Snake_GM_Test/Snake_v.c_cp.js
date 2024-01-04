// function rand(min, max){
//     return Math.floor(Math.random()*max + min);
// }

//Field
var gridSize = 20;
var cols = 25;
var rows = 25;
var field; 

//snake head
var snakeX;
var snakeY;

var snakeXvel = 0;
var snakeYvel = 0;

var snakeBody = [];
var snakeSegment = {
    xpos: 0, ypos: 0, xVelocity: 0, yVelocity: 0
};

//apple
var appleX;
var appleY;
var xDistToApple;
var yDistToApple;

//Game logic
var gameOver = false;
var paused = false;
var score = 0;
var highScore = 0;
var frameRate = 100; //milliseconds
var pointer = [];

function moveRight(){ snakeVelocity(1,0);} 
function moveLeft(){ snakeVelocity(-1,0);} 
function moveUp(){ snakeVelocity(0,-1);} 
function moveDown(){ snakeVelocity(0,1);} 

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
    gridlineButton = document.getElementById("gridlines");
    gridlineButton.addEventListener("click", gridlines);
    
    initialSnakePos();
    placeApple();
    setInterval(update, frameRate);
    // window.requestAnimationFrame(update);
}

function update() {
    if(gameOver) {
        snakeVelocity(0,0);    
        return;
    }

    //Draw Field
    context.fillStyle = "black";
    context.fillRect(0,0,field.width, field.height);

    //Draw Apple
    context.fillStyle = "red";
    context.fillRect(appleX, appleY, gridSize, gridSize)

    //Update Snake
    if(!paused){
        for (let i = snakeBody.length-1; i > 0; i--) {
            snakeBody[i] = snakeBody[i-1];
        }
        snakeBody[0] = [snakeX, snakeY];   

    //Intialize AI
    var xDistToApple = snakeX - appleX;
    var yDistToApple = snakeY - appleY;
    
    // Run AI
        // snakeAi(xDistToApple, yDistToApple);
    }

        //Snake_AI
    /*AI PROJECT */
    var appleIsRight = false;
    var appleIsUp = false;
    function snakeAi(xDist, yDist){
        travelX(xDist, yDist);
            if(yDist>0) appleIsUp = true;
            if(yDist!=0){
                if(appleIsUp)
                    snakeDir("Up"); //Move Up
                else if(!appleIsUp){snakeDir("Down")}
                else if(xDist==0){snakeDir("Right");}
            } 
    }

    function travelX(xDist, yDist){
        if(xDist<0) appleIsRight = true;
        if(xDist!=0){
            if(appleIsRight)
                snakeDir("Right");
            else if(!appleIsRight){snakeDir("Left");}
            else if(yDist==0) snakeDir("Up");
        }
    }

    //Move Snake
    snakeX += snakeXvel * gridSize;
    snakeY += snakeYvel * gridSize; 

    context.strokeStyle = "yellow";
    context.fillStyle = "rgb(20,200,30)";
    context.fillRect(snakeX, snakeY, gridSize, gridSize);
    context.strokeRect(snakeX, snakeY, gridSize, gridSize);
    
    context.fillStyle = "lime";
    for (let i = 0; i < snakeBody.length-1; i++) {
        context.fillRect(snakeBody[i][0], snakeBody[i][1], gridSize, gridSize);
    }

    //Eat Apple
    if(snakeX == appleX && snakeY == appleY){
        score++;
        highScore = Math.max(highScore, score);
        frameRate = Math.max(frameRate*0.95, 50);
        console.log("frameRate: ", frameRate, "ms\nscore: ", score);
        document.getElementById("highScore").innerHTML= (highScore);
        document.getElementById("score").innerHTML= (score);

        snakeBody.push([appleX, appleY]);
        placeApple();
        context.fillStyle = "red";
        context.fillRect(appleX, appleY, gridSize, gridSize)
    }

    if(snakeCollide(snakeX, snakeY)) {
        gameOver = true;
        document.getElementById("GameOver").innerHTML = "Game Over";
    }
    // window.requestAnimationFrame(update);
}

//GameOver Conditions
//Out of Bounds or Snake hits itself
function snakeCollide(testX, testY){
    if (testX < 0 || testX >= field.width || testY < 0 || testY >= field.height)
        return true;
    for (i=1; i<snakeBody.length-1; i++) {
        if(testX == snakeBody[i][0] && testY == snakeBody[i][1]) 
            return true;
    }
    return false;
}

function snakeDir(dirPrompt){
    let crash = crashReport();
    let crashLog =  [crash.right+0, crash.left+0, crash.up+0, crash.down+0];
    console.log(dirPrompt + ": " + crashLog);

    switch (dirPrompt) {
        case "Right":
            if(!crash.right) moveRight();
            else if(cmpArray(crashLog, [1,1,0,0])){
                console.log("%cTurn Up", "color: orange");
                moveUp();
            }
        break;
        case "Left":
            if(!crash.left) moveLeft();
            else if(cmpArray(crashLog, [1,1,0,0])){
                console.log("%cTurn Up", "color: orange");
                moveUp();
            }
        break;
        case "Up":
            if(!crash.up) moveUp();
            if(cmpArray(crashLog, [0,0,1,1])){
                console.log("%cTurn Right", "color: orange"); 
                moveRight(); 
            }
        break;
        case "Down":
            if(!crash.down) moveDown();
            else if(cmpArray(crashLog, [0,0,1,1])){
                console.log("%cTurn Right", "color: orange"); 
                moveRight(); 
            }
        break;
    }

    if(cmpArray(crashLog, [0,1,1,1])) { moveRight(); return}
    else if(cmpArray(crashLog, [1,0,1,1])){ moveLeft(); return}
    else if(cmpArray(crashLog, [1,1,0,1])){ moveUp(); return}
    else if(cmpArray(crashLog, [1,1,1,0])){ moveDown(); return}
    else if(cmpArray(crashLog, [1,1,1,1])){
        console.log("We give up. No moves available!");
        console.log("SnakeAi Lost.");
        return;
    }
}

function crashReport(movesAhead = 1){    
    let right = false;
    let left = false;
    let up = false;
    let down = false;
    if(snakeCollide(snakeX+gridSize*movesAhead, snakeY)) right = true;
    if(snakeCollide(snakeX-gridSize*movesAhead, snakeY)) left = true;
    if(snakeCollide(snakeX, snakeY-gridSize*movesAhead)) up = true;
    if(snakeCollide(snakeX, snakeY+gridSize*movesAhead))  down = true;
    return {right, left, up, down};
}

function spacebarPause(event){
    if(event.key == ' ' || event.code == 'Space' || event.keyCode ==32){
        console.log("Spacebar was clicked.")
        pause(event);
    }
}

var xVel;
var yVel;
var clicked = false;
function pause(e){
    if(snakeXvel===0 && snakeYvel===0){
        console.log("Game continued.");
        console.log(xVel + ", " + yVel)
        snakeVelocity(xVel, yVel)
        document.getElementById("pause").innerHTML="Pause";
        paused = false;
    }
    else{
        xVel = snakeXvel;
        yVel = snakeYvel;
        snakeVelocity(0,0);
        document.getElementById("pause").innerHTML="Continue";
        paused = true;
    }
        
    // var field = document.getElementById("field");
    // field.setAttribute()
}

function restart(){
    document.getElementById("GameOver").innerHTML= "";
    document.getElementById("score").innerHTML= "";
    gameOver = false;
    placeApple();

    snakeVelocity(0,0);
    snakeBody=[];
    initialSnakePos();

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
    if(event.keyCode >= 37 && event.keyCode <= 40){
        document.getElementById("pause").innerHTML="Pause";
        paused = false;
    }
    if(event.code == "ArrowUp" && snakeYvel != 1){
        snakeDir("Up");
    } 
    else if(event.code == "ArrowDown" && snakeYvel != -1) {
        snakeDir("Down");
    }
    else if(event.code == "ArrowLeft" && snakeXvel != 1) {
        snakeDir("Left");
    }
   else if(event.code == "ArrowRight" && snakeXvel != -1) {
        snakeDir("Right");
    }
}

function snakeVelocity (horizontal, vertical){
    snakeXvel = horizontal;
    snakeYvel = vertical;
}

function rand(smallest, largest) {
    return Math.floor(Math.random()*(largest+1-smallest) + smallest);
}

function initialSnakePos(){
    snakeX = rand(0,cols/4) * gridSize;
    snakeY = rand(0,rows/4) * gridSize;
    snakeBody = [[snakeX, snakeY], [snakeX+gridSize, snakeY+gridSize]];
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

cmpArray = (arr1, arr2) => {
    return (JSON.stringify(arr1) === JSON.stringify(arr2))
}

function cmpPositions(p1,p2){
    if(p1[0] == p2[0] && p1[1]==p2[1])
        return true
    else return false;
}

    //Show Gridlines
    // for (let i = 0; i < rows+1; i++) {
    //     context.moveTo(i*gridSize, 0);
    //     context.lineTo(i*gridSize, rows*gridSize);
    //     context.stroke();
    // }
    // for (let i = 0; i < cols+1; i++) {
    //     context.moveTo(0, i*gridSize);
    //     context.lineTo(rows*gridSize, i*gridSize);
    //     context.stroke();
    // }