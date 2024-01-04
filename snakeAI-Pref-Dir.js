/*AI PROJECT */
//Snake_AI - Apple Location and Preferential Direction

xDistToApple = snake.xPos - appleX;
yDistToApple = snake.yPos - appleY;


function snakeAi(){
    findBallDir();
    travelX(xDistToApple, yDistToApple);
    travelY(xDistToApple, yDistToApple);
}

function travelX(){
    if(xDistToApple===0) return;
    
    if(appleIsRight){
        snakeDir("Right");
    }
    else if(!appleIsRight){snakeDir("Left");}
    else if(yDistToApple==0) {snakeDir("Up");}
} 

function travelY(xDistToApple, yDistToApple){
    if(yDistToApple===0) return;
        if(appleIsUp){
            snakeDir("Up");
        } 
        else if(!appleIsUp){
            snakeDir("Down");
        }
        else if(xDistToApple==0){
            snakeDir("Right");
        } 
}

function findBallDir(){
    appleIsUp = (yDistToApple>0);
    appleIsRight = (xDistToApple<0);
}

function snakeDir(dirPrompt){
    let crash = crashReport();
    let crashLog =  [crash.right+0, crash.left+0, crash.up+0, crash.down+0];
    findBallDir();
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

    //Snake_AI
    //AI PROJECT 
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

    function travelY(){
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
} */