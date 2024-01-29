/*AI PROJECT */
//Snake_AI - Apple Location and Preferential Direction
/**
 * Snake moves towards apple and chooses right over left and up over down for each movement
 * And uses the function crashReport() to check if it's next move will cause it crash 
 * then chooses and alternate direction.
 * All functions are dependent on the global variables apple_xDist and apple_yDist
 */

let appleIsUp, appleIsRight;
let apple_xDist, apple_yDist;

function snakeAI_Pref_Dir(apple_xDistance, apple_yDistance){
    //Initialize global variables
    apple_xDist = apple_xDistance;
    apple_yDist = apple_yDistance;
    
    findAppleDir();
    travelX();
    travelY();
}

function travelX(xDist = apple_xDist, yDist = apple_yDist){
    if(xDist===0) return;
    
    if(appleIsRight) snakeDir("Right");
    else snakeDir("Left");
} 

function travelY(xDist = apple_xDist, yDist = apple_yDist){
    if(yDist===0) return;
    
    if(appleIsUp) snakeDir("Up");
    else snakeDir("Down");
}

function findAppleDir(appleXDist = apple_xDist, appleYDist = apple_yDist){
    appleIsUp = (appleYDist>0);
    appleIsRight = (appleXDist<0);
    if(appleXDist == undefined && appleYDist == undefined) pause();
}

function snakeDir(dirPrompt){
    let crash = crashReport();
    let crashLog =  [crash.right+0, crash.left+0, crash.up+0, crash.down+0];
    findAppleDir();
    // console.log(dirPrompt + ": " + crashLog);

    switch (dirPrompt) {
        case "Right":
            if(!crash.right) moveRight();
            else if(isArraySame(crashLog, [1,1,0,0])){
                if(appleIsUp) moveUp(); 
                else moveDown();
            }
        break;
        case "Left":
            if(!crash.left) moveLeft();
            else if(isArraySame(crashLog, [1,1,0,0])){
                if(appleIsUp) moveUp(); 
                else moveDown();
            }
        break;
        case "Up":
            if(!crash.up) moveUp();
            if(isArraySame(crashLog, [0,0,1,1])){
                if(appleIsRight) moveRight(); 
                else moveLeft(); 
            }
        break;
        case "Down":
            if(!crash.down) moveDown();
            else if(isArraySame(crashLog, [0,0,1,1])){
                if(appleIsRight) moveRight(); 
                else moveLeft(); 
            }
        break;
    }

    if(isArraySame(crashLog, [0,1,1,1])) { moveRight(); return}
    else if(isArraySame(crashLog, [1,0,1,1])){ moveLeft(); return}
    else if(isArraySame(crashLog, [1,1,0,1])){ moveUp(); return}
    else if(isArraySame(crashLog, [1,1,1,0])){ moveDown(); return}
    else if(isArraySame(crashLog, [1,1,1,1])){
        console.log("We give up. No moves available!");
        console.log("SnakeAi Lost.");
        return pause();
    }
}

function crashReport(movesAhead = 1){    
    let right = false;
    let left = false;
    let up = false;
    let down = false;
    if(snakeHeadCollide([snake.xPos+gridSize*movesAhead, snake.yPos])) right = true;
    if(snakeHeadCollide([snake.xPos-gridSize*movesAhead, snake.yPos])) left = true;
    if(snakeHeadCollide([snake.xPos, snake.yPos-gridSize*movesAhead])) up = true;
    if(snakeHeadCollide([snake.xPos, snake.yPos+gridSize*movesAhead]))  down = true;
    return {right, left, up, down};
}

/*
    
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
} */