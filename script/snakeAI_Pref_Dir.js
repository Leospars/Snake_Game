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
    if(appleXDist == undefined && appleYDist == undefined) pause_play();
}

function snakeDir(dirPrompt){
    let crash = crashReport();
    let crashLog =  [crash.right+0, crash.left+0, crash.up+0, crash.down+0];
    findAppleDir();
    // console.log(dirPrompt + ": " + crashLog);

    if(isArraySame(crashLog, [0,1,1,1])) { moveRight(); return}
    else if(isArraySame(crashLog, [1,0,1,1])){ moveLeft(); return}
    else if(isArraySame(crashLog, [1,1,0,1])){ moveUp(); return}
    else if(isArraySame(crashLog, [1,1,1,0])){ moveDown(); return}
    else if(isArraySame(crashLog, [1,1,1,1])){
        console.log("We give up. No moves available!");
        console.log("SnakeAi Lost.");
        return pause_play();
    }

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
}

function crashReport(snakeObj = snake,movesAhead = 1){
    snakeObj.possibleMovements();
    let futureBody = snakeObj.body.toSpliced(snakeObj.body.length-movesAhead, movesAhead);
    return {
        right: isSnakeCollide(snakeObj.right, futureBody),
        left: isSnakeCollide(snakeObj.left, futureBody),
        up: isSnakeCollide(snakeObj.up, futureBody),
        down: isSnakeCollide(snakeObj.down, futureBody),
    };
}