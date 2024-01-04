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

var snakeXvel = 0;
var snakeYvel = 0;

var snakeBody = [];
var snakeSegment = {
    xpos: 0, ypos: 0, xVelocity: 0, yVelocity: 0
};

//apple
var appleX;
var appleY;

//Game logic
var gameOver = false;
var paused = false;
var score = 0;
var highScore = 0;
var frameRate = 100; //milliseconds
var pointer = [];

var movingRight = false;
var movingLeft = false;
var movingUp = false;
var movingDown = false;

function checkSnakeMovement(){
    if(snakeXvel==1) movingRight = true;
        else movingRight = false;
    if(snakeXvel==-1) movingLeft = true;
        else movingLeft = false;
    if(snakeYvel==-1) movingUp = true;
        else movingUp = false;
    if(snakeYvel==1) movingDown = true;
        else movingDown = false;
}

function moveRight(){ snakeVelocity(1,0);} 
function moveLeft(){ snakeVelocity(-1,0);} 
function moveUp(){ snakeVelocity(0,-1);} 
function moveDown(){ snakeVelocity(0,1);} 

function cmpPoints(p1,p2){
    if(p1[0] == p2[0] && p1[1]==p2[1])
        return true
    else return false;
}


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
    
    placeApple();
    setInterval(update, frameRate);
}

function update() {
    if(gameOver) {
        snakeVelocity(0,0);    
        return;
    }

    //Draw Field
    context.fillStyle = "black";
    context.fillRect(0,0,field.width, field.height);

    //Draw Pointers
/*   context.strokeStyle = "yellow";
    for (let i = 10; i < 14; i++) {
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
    
    //Update Snake
    if(paused===false){
        for (let i = snakeBody.length-1; i > 0; i--) {
            snakeBody[i] = snakeBody[i-1];
        }
        if(snakeBody.length) 
        snakeBody[0] = [snakeX, snakeY];   
    }
    
    context.strokeStyle = "yellow";
    context.fillStyle = "rgb(20,200,30)";
    
    //Intialize fir AI
    var xDistance = snakeX - appleX;
    var yDistance = snakeY - appleY;
    var appleIsRight = false;
    var appleIsUp = false;
    
    //Run AI
    if(!paused){
        snakeAi();
    }


    //Move Snake
    var nextSnakePos = [[(snakeX+gridSize*snakeXvel), snakeY]]
    var nextSnakePos2 = [[snakeX,(snakeY+gridSize*snakeYvel)]];
    // console.log("snakeVel: ("+[snakeXvel, snakeYvel]+")\nsnakepos: "+ [snakeX, snakeY]+"\nnextPos: " + nextSnakePos+ "\nnextPos2: " + nextSnakePos2 +"\nbody0: " + snakeBody[0]);    
    if(nextSnakePos2[0] == snakeBody[1]){
            console.log("insubordination");
            if(snakeXvel==-1) snakeXvel=1;
            if(snakeXvel==1) snakeXvel=-1;
            if(snakeYvel==1) snakeYvel=-1;
            if(snakeYvel==-1) snakeYvel=1;
        }    
        else 
        {
            console.log("free");
        }
    snakeX += snakeXvel * gridSize;
    snakeY += snakeYvel * gridSize; 
    context.fillRect(snakeX, snakeY, gridSize, gridSize);
    context.strokeRect(snakeX, snakeY, gridSize, gridSize);
    context.fillStyle = "lime";
    for (let i = 0; i < snakeBody.length; i++) {
        context.fillRect(snakeBody[i][0], snakeBody[i][1], gridSize, gridSize);
    }
     //Eat Apple
     if(snakeX == appleX && snakeY == appleY){
        snakeBody.push([appleX, appleY]);
        score++;
        highScore = Math.max(highScore, score);
        frameRate = Math.max(frameRate*0.95, 50);
        console.log("frameRate: ", frameRate, "ms\nscore: ", score);
        document.getElementById("highScore").innerHTML= (highScore);
        document.getElementById("score").innerHTML= (score);
        placeApple();
    }

    //Snake_AI
    /*AI PROJECT */
    function snakeAi(){
        checkSnakeMovement();

        travelX();
            if(yDistance>0) appleIsUp = true;
            if(yDistance!=0){
                if(appleIsUp && !movingDown)
                    snakeDir("Up"); //Move Up
                else if(!appleIsUp && !movingUp){snakeDir("Down")}
                else if(xDistance==0){snakeDir("Right");}
            } 
    }

    function travelX(){
        checkSnakeMovement();
        if(xDistance<0) appleIsRight = true;
        if(xDistance!=0){
            if(appleIsRight && !movingLeft)
                snakeDir("Right");
            else if(!appleIsRight && !movingRight){snakeDir("Left");}
            else if(yDistance==0) snakeDir("Up");
        }
        // else if(xDistance===0){snakeVelocity(0,0)}
    
            // else turn();
        // if(xDistance==0) travelY();
    }

/*    function travelY(){
        if(yDistance>0) appleIsUp = true;
        if(yDistance!=0){
            if(appleIsUp && !movingDown){
                console.log("UP. S !Down. ⬆️");
                snakeDir("Up");
            } else if(!appleIsUp && !movingUp){
                console.log("DOWN. S !Up. ⬇️");
                snakeDir("Down");
            }
            else turn();
        }
        if(yDistance==0) travelX();
    }

    function turn(){
        if((movingRight||movingLeft) && xDistance===0){ if(appleIsUp) snakeDir("Up"); else snakeDir("Down"); }
        if((movingUp||movingDown)){ if(appleIsRight) snakeDir("Right"); else snakeDir("Left");}
    }
*/


    //GameOver Conditions
    //Out of Bounds or Snake hits itself
    function snakeCollision(){
        if (snakeX < 0 || snakeX >= field.width || snakeY < 0 || snakeY >= field.height)
            return true;
        for (i=1; i<snakeBody.length-1; i++) {
            if(snakeX == snakeBody[i][0] && snakeY == snakeBody[i][1]) 
                return true;
        }
    }

    if(snakeCollision()) {
        gameOver = true;
        document.getElementById("GameOver").innerHTML = "Game Over";
    }
}

function predictPosition(dirPrompt){
    var snakePos = [snakeX, snakeY]
    var prediction = [[-1,-1]];
    
    checkSnakeMovement();
    if(movingRight)dirPrompt = "Right";
    if(movingLeft)dirPrompt = "Left";
    if(movingUp)dirPrompt = "Up";
    if(movingDown)dirPrompt = "Down";

    if(dirPrompt =="Right"){
        for (let i = 0; i < 2; i++)
            prediction[i] = [snakeX+gridSize*i,snakeY];
    }
    if(dirPrompt =="Left"){
        for (let i = 0; i < 2; i++)
            prediction[i] = [snakeX+gridSize*-i,snakeY];
    }
    if(dirPrompt =="Up"){
        for (let i = 0; i < 2; i++)
            prediction[i] = [snakeX,snakeY+gridSize*-i];
    }
    if(dirPrompt =="Down"){
        for (let i = 0; i < 2; i++)
            prediction[i] = [snakeX,snakeY+gridSize*i];
    }
    // console.log("\nsnkpos: " + snakePos +"\npos1: " +pos1+ "\npos2: " +pos2+ "\npos3: " + pos3);

    var predictions= [pos1, pos2, pos3];
    return predictions;
}

function avoidBody(dirPrompt){
    var rightCrash = false;
    var leftCrash = false;
    var upCrash = false;
    var downCrash = false;
    let crash = false;
    //Check next position
    var prediction = predictPosition(dirPrompt);
    checkSnakeMovement();
    console.log(dirPrompt);
        for (i=0; i<snakeBody.length-1; i++) {
            for (let j = 0; j < predictPosition.length; j++) {
                if(cmpPoints(prediction[i], snakeBody[i])) crash=true;
            }
            switch (dirPrompt) {
                case "Right":
                    leftCrash = true;
                    if(crash || snakeX===field.width-gridSize)
                        rightCrash=true;
                break;
                case "Left":
                    if(movingLeft) rightCrash=true;
                    if(crash || snakeX===0) {
                        RightCrash=true;
                        console.log("Left it will crash");
                    }
                break;
                case "Up":
                    if(movingUp) downCrash=true;
                    if(crash || snakeY === 0) 
                        upCrash=true;
                break;
                case "Down":
                    if(movingDown) upCrash=true;
                    if(crash || snakeY === field.hieght-gridSize){
                        downCrash=true;
                    };
                break;
                default:
                    break;
            }
        }
        var crashReport = [rightCrash, leftCrash, upCrash, downCrash];
            if(crash == true)console.log("[" + crashReport + "] C: " + crash);
    return crashReport;
}

function snakeDir(dirPrompt){
    crashReport = avoidBody(dirPrompt);
        switch (dirPrompt) {
            case "Right":
                if(crashReport[0] == false) moveRight();
                else if(movingRight && crashReport == [1,1,0,0]){moveUp()}
                else if(crashReport == [1,1,1,0]){moveDown()}
            break;
            case "Left":
                if(crashReport[1] == false) moveLeft();
                else if(crashReport == [1,1,0,0]){moveUp()}
                else if(crashReport == [1,1,1,0]){moveDown()}
            break;
            case "Up":
                if(crashReport[2] == false) moveUp();
                else if(crashReport == [0,0,1,1]){moveRight()}
                else if(crashReport == [1,0,1,1]){moveLeft()}
            break;
            case "Down":
                if(crashReport[3] == false) moveDown();
                else if(crashReport == [0,0,1,1]){moveRight()}
                else if(crashReport == [1,0,1,1]){moveLeft()}
            break;
            default:
                console.log("We give up. No moves available!");
                console.log("SnakeAi Lost.");
                // moveRight();
        }
    

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

function placeApple() {
    randX = rand(0,cols-1) * gridSize;
    randY = rand(3,rows-1) * gridSize;
    for (i=0; i<snakeBody.length-1; i++) {
        if(randX == snakeBody[i][0] && randY == snakeBody[i][1]){
            placeApple();
        }
    }
    appleX = randX;
    appleY = randY;
}

    // function filterBestPath() {
    //     var fieldToApple = createfieldToApple();

    // }

    // function createAppleField() {
    //     var appleField = [];
    //     var appleFieldRows = Math.abs(yDistance/gridSize);
    //     var appleFieldColumns = Math.abs(xDistance/gridSize);

    //     for (let i = 0; i<appleFieldColumns+1; i++){
    //         for(let j=0; j<appleFieldRows+1; j++){
    //             appleField.push([snakeX+gridSize*i, snakeY+gridSize*j]);
    //         }
    //     }    
        
    //     console.log("Apple Map created.");
    //     console.log(appleField);
    //     return appleField;
    // }

// snakeAIbestPath();

//AI using shortest Path and avoiding inevitable positional crashes
/*var snakePathDir;
function snakeAIbestPath(xDist, yDist){
    var snakePathDir = []; 
    
    snakePathDir = [["Right",1],["Right", 19],["Down",20], ["Left",21], ["Left",39], ["Down", 40], ["Right", 41], ["Up", 60], ["Right", 62], ["", rows*cols]];
    snakePathDir = findPath(xDist, yDist);
    for(let i = 0; i<snakePathDir.length-1; i++){
        let direction = snakePathDir[i][0];
        let instance = snakePathDir[i][1];
        let nextInstance = snakePathDir[i+1][1];
        if(frame%rows*cols >= instance && frame%rows*cols < nextInstance || frame === instance){
            console.log(direction, frame);
            snakeDir(direction); //Makes snake move in that direction 
        }
    }
}

let artificialSnake = new Snake();
let alexander = artificialSnake;
alexander.body = alexander.body.concat(snake.body);
[alexander.xPos, alexander.yPos] =  [snake.xPos, snake.yPos];
let rCritIndex = lCritIndex = uCritIndex = dCritIndex = 1;
let snakePath = [alexander.head];
function findPath(xDist, yDist){
    alexander.head = [alexander.xPos, alexander.yPos];
    let snakeDirection = ""; 
    let snakePathDir = []; 
    
    while(!isArraySame(alexander.head, [appleX, appleY]) && i<cols*rows){
        findAppleDir(xDist, yDist);
        moveSnakeTowardApple(xPosition, yPosition);
        //Write code to make snake identify and avoid closed areas
        /*function isClosedArea(xPos, yPos){
            //Use snake body to find out if xPos, Ypos forms a rectangle
            //if the area of the rectangle is not greater than the length of one side
        }*/
/*
        snakePathDir.push(snakeDirection);
        snakePath.push([xPosition, yPosition]);
        
        //Update Imaginary Snake
        alexander.body.unshift([xPosition, yPosition]);   
        alexander.body.pop();

        console.log(i);
        i++;
    }
    console.log(snakePath);
    snakePathDir = [["Right",1],["Right", 19],["Down",20], ["Left",21], ["Left",39], ["Down", 40], ["Right", 41], ["Up", 60], ["Right", 62], ["", rows*cols]];
    return snakePathDir;
}


let index = 0;
let currentIndex;
function generateSafePath (snakeHead = [testX, testY], pathDirections = []) {
    snakeHead = [testX, testY];
    let crash = crashReportTest([testX, testY]);
    let crashReport = [crash.right, crash.left, crash.up, crash.down]
    if(isArraySame(crashReport, [1,1,1,1])){
        pathDirections = ["Crash"];
        console.log("This path crashed.")
        return;
    } 
    // console.log(index);
    let currentIndex = (pathDirections.length-1) + index;
    if(index>1) artificialSnakeUpdate(path[currentIndex]);
    alexander.possibleMovements([testX, testY]);
    if(index%2===0 && !(index%4===0)) 
        (!crash.left && !snakeWasAt(snake.left)) ? pathDirections.push(["Left"]) : generateSafePath(snakeHead, pathDirections[currentIndex+1]);
    else if(index%3===0) 
        (!crash.up && !snakeWasAt(snake.up)) ? pathDirections.push(["Up"]) : generateSafePath(snakeHead, pathDirections[currentIndex+1]);
    else if(index%4===0) 
        (!crash.down && !snakeWasAt(snake.down)) ? pathDirections.push(["Down"]) : generateSafePath(snakeHead, pathDirections[currentIndex+1]);
    else 
        (!crash.right && !snakeWasAt(snake.right)) ? pathDirections.push(["Right"]) : generateSafePath(snakeHead, pathDirections[currentIndex+1]);
    index++;
}

function artificialSnakeUpdate(direction){
    switch (direction) {
        case "Right":
            snake.head = snake.right;
            break;
        case "Left":
            snake.head = snake.left;
            break;
        case "Up":
            snake.head = snake.up;
            break;
        case "Down":
            snake.head = snake.down;
            break;
        default:
            break;
    }

    alexander.head = [alexander.xPos, alexander.yPos];

    //Update Imaginary Snake
    alexander.body.unshift([xPosition, yPosition]);   
    alexander.body.pop();
}

/*
        if(snakeHeadCollide(xPosition, yPosition, artificialSnake)){
            if(xPosition != snakePath[i-1][0]) xPosition = snakePath[i-1][0];
            if(yPosition != snakePath[i-1][1]) yPosition = snakePath[i-1][1];
    
            //Repeat the function using each new direction tried
            //For each critical path encountered another set of possiblePaths would be created and the shorter path .concat to the bigger array
            //e.g. possiblePaths[[rightPath], [leftPath]]; rightPath = [[20,140], [40,140], critical point/collision [possiblePaths = [upPath], [downPath]]]
            //after xPosition,yPosition = appleX,appleY the array will end and the next array created.
            //after each array is created the smallest array is concat to the array at the earlier criticalPoint.
            //concat the shorter array to snakePath e.g. snakePath.concat(rightPath)
            //run snakePath through a function that turns the co-ordinates into directions and returns snakePathDir.
    
            if(isArraySame(crashReportTest(xPosition, yPosition),[1,1,1,1])){
                console.log("Path failed");
                //return to critical Position
                //This path failed do not compare it index 0 = [-1,-1]
                //Try and compare the other paths
                //If no path works, or eating apple causes a closed area, or the apple is surrounded and run the code snakeStall() until apple is not surrounded.
            }
            continue;
        }
}
*/
