//Remember \Snake_GM\snakeAI-Pref-Dir.js
/* - - - - - - - - - 
  SNAKE GAME SOLID
 - - - - - - - - - */

//Field
const gridSize = 20;
const cols = 24;
const rows = 24;
let field; 

//snake
var snake = new Snake(); 

//apple
let appleX, appleY;
let appleIsRight, appleIsUp;

//Game logic
var gameOver = false;
var paused = false;
var score = 0;
var highScore = 0;
var frameRate = 1000/10; //10fps
var initialFrameRate = frameRate;

function moveRight(){ snake.velocity(1,0);} 
function moveLeft(){ snake.velocity(-1,0);} 
function moveUp(){ snake.velocity(0,-1);} 
function moveDown(){ snake.velocity(0,1);} 

window.onload = function() {
    field = document.getElementById("field");
    field.height = gridSize*rows;
    field.width = gridSize*cols;

    context = field.getContext("2d");
    document.addEventListener("keyup", changeDirection);
    document.body.addEventListener("keyup", spacebarPause);
    
    let restartButton = document.getElementById("restart");
    restartButton.addEventListener("click", restart);
    let pauseButton = document.getElementById("pause");
    pauseButton.addEventListener("click", pause);
    let gridlineButton = document.getElementById("gridlines");
    gridlineButton.addEventListener("click", gridlines);

    snake.initialPosition();
    placeApple();
    setInterval(update, frameRate);
    // window.requestAnimationFrame(update);
}

let frame = 0;
function update() {
    if(gameOver) {
        snake.velocity(0,0);    
        return;
    }

    if(!paused){
        frame++;
        
        //Draw Field
            context.fillStyle = "transparent";
            context.clearRect(0,0,field.width, field.height);
        context.fillRect(0,0,field.width, field.height);

        //Draw Apple
        context.fillStyle = "red";
        context.fillRect(appleX, appleY, gridSize, gridSize)

        //Update Snake
        if(!isArraySame([snake.xVel, snake.yVel],[0,0])){
            snake.body.unshift([snake.xPos, snake.yPos]);   
            snake.body.pop();   
        }

        //Intialize AI
        xDistToApple = snake.xPos - appleX;
        yDistToApple = snake.yPos - appleY;
    
        // Run AI
        // snakeAi();
        snakeAIHC();

    //Move Snake
        let nextLocation = [snake.xPos + snake.xVel * gridSize, snake.yPos + snake.yVel * gridSize];
            [snake.xPos, snake.yPos] = nextLocation;
    snake.head = [snake.xPos, snake.yPos] ;

    }
    
    context.strokeStyle = "yellow";
    context.fillStyle = "rgb(20,200,30)";
    context.fillRect(snake.xPos, snake.yPos, gridSize, gridSize);
    context.strokeRect(snake.xPos, snake.yPos, gridSize, gridSize);
    
    //Trace Snake center
    // outlineSnake();

    if (frame === rows*cols) console.log("full field"); 
    context.fillStyle = "lime";
    for (let i = 0; i <= snake.body.length-1; i++) {
        context.fillRect(snake.body[i][0], snake.body[i][1], gridSize, gridSize);
    }

    //Eat Apple
    if(appleWasAte()){
        score++;
        highScore = Math.max(highScore, score);
        document.getElementById("highScore").innerHTML= (highScore);
        document.getElementById("score").innerHTML= (score);

        frameRate = Math.max(frameRate*0.95, 50);
        console.log("frameRate: ", frameRate, "ms\nscore: ", score);

        snake.body.push([appleX, appleY]);
        placeApple();
        context.fillStyle = "red";
        context.fillRect(appleX, appleY, gridSize, gridSize)
    }

    if(snake.body.length ==  rows*cols+1){
        document.getElementById("GameOver").innerHTML = "YOU WON 🥳\n Best High Score";
        field.classList.add('hidden');
        gameOver = true;
        console.log("YOU WON :)");
        return;
    }

    if(snakeHeadCollide(snake.head)) {
        gameOver = true;
        document.getElementById("GameOver").innerHTML = "Game Over";
    }
    // window.requestAnimationFrame(update);
}

//GameOver Conditions
//Out of Bounds or Snake hits itself
function snakeHeadCollide([testX, testY] = snake.head){
    if (isOutsideField([testX, testY]))
        return true;
    for (let i=0; i<snake.body.length-1; i++) {
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

//HamiltonianCycle
let snakeTrack = [];
let snakeIsImmortal;

function willHeadCollide([xPos, yPos]) {
   return snakeHeadCollide([xPos, yPos]);
}

function snakeAIHC(){
    // if(snakeTrack.length < cols*gridSize);
    // else snakeTrack = [];
    
    let nextPosition = [];
    snakeMovement = [snake.xVel, snake.yVel];
    let snakeNextPosition = [];
    snakeIsImmortal = !snakeWasAt(snakeNextPosition) && !snakeHeadCollide(snakeNextPosition[0], snakeNextPosition[1]);
    findAppleDir();
    
    isOutsideField(snake.head, [0, appleX], [0, appleY]);
    snake.possibleMovements(); 

    if(!snakeWasAt(snake.right) && !willHeadCollide(snake.right)) {moveRight(); nextPosition = snake.right;} 
    else if(!snakeWasAt(snake.down) && !willHeadCollide(snake.down)){ moveDown(); nextPosition = snake.down;}
    else if(!snakeWasAt(snake.up) && !willHeadCollide(snake.up)){ moveUp(); nextPosition = snake.up} 
    else if(!snakeWasAt(snake.left) && !willHeadCollide(snake.left)){ moveLeft(); nextPosition = snake.down;}
    snakeTrack.push(snake.head);
    // console.log("Ai is running", snakeTrack.length, snakeWasAt(snake.right));
    if(snakeTrack.length == rows*cols || isSamePoint(snakeNextPosition,[appleX,appleY])){ 
        console.log("Track reset at: " + snakeTrack.length); 
        snakeTrack = [];
        console.log(snakeTrack);
        // snakeTrack = snakeTrack.concat(snake.body);
    }
}

// has snake been at that position before
function snakeWasAt([xPos, yPos]){
    for (let i=0; i<=snakeTrack.length-1; i++) {
        if(isSamePoint([xPos,yPos], [snakeTrack[i][0], snakeTrack[i][1]]))
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
    document.getElementById("GameOver").innerHTML= "";
    document.getElementById("score").innerHTML= "";
    field.classList.remove("hidden");
    snake.velocity(0,0);
    
    gameOver = false;
    paused = false;
    score = 0;
    frame= 0;
    frameRate = initialFrameRate; //fps
    snakeTrack = [];
    snake.initialPosition();
    placeApple();
    window.blur();
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
        document.getElementById("pause").innerHTML="⏸️";
        paused = false;
    }
    if(event.code == "ArrowUp" && snake.yVel != 1){
        moveUp();
    } 
    else if(event.code == "ArrowDown" && snake.yVel != -1) {
        moveDown();
    }
    else if(event.code == "ArrowLeft" && snake.xVel != 1) {
        moveLeft();
    }
   else if(event.code == "ArrowRight" && snake.xVel != -1) {
        moveRight();
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

const appleWasAte = () => {
    return isSamePoint([snake.xPos, snake.yPos], [appleX, appleY]);
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


let gridlineIsVisible = false;
const hideGridlines = () => {
    //Draw Field
    context.fillStyle = "yellow";;
    context.clearRect(0,0,field.width, field.height);
}

function gridlines(){
    console.log("code was run");
    if(!gridlineIsVisible){
        context.strokeStyle = "grey";
        for (let i = 0; i < field.height; i++) {
            context.moveTo(0, gridSize*i);
            context.lineTo(field.width, gridSize*i);
            // context.stroke();
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