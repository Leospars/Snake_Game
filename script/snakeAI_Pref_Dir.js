/*AI PROJECT */

//Snake_AI - Apple Location and Preferential Direction
/**
 * Snake moves towards apple and chooses right over left and up over down for each movement
 * And uses the function crashReport() to check if it's next move will cause it crash
 * then chooses and alternate direction.
 * All functions are dependent on the global variables apple_xDist and apple_yDist
 */

function snakeAI_Pref_Dir(apple_xDist, apple_yDist) {
    const findAppleDir = (xDist = apple_xDist, yDist = apple_yDist) => {
        let appleIsUp = (yDist > 0);
        let appleIsRight = (xDist < 0);
        return [appleIsUp, appleIsRight];
    }

    let [appleIsUp, appleIsRight] = findAppleDir(apple_xDist, apple_yDist);

    if (apple_xDist !== 0)
        snakeDir(appleIsRight ? "Right" : "Left");

    if (apple_yDist !== 0)
        snakeDir(appleIsUp ? "Up" : "Down");

    if (apple_xDist === 0 && apple_yDist === 0)
        snakeDir(["Right", "Left", "Up", "Down"][rand(0, 3)]);

    function snakeDir(dirPrompt) {
        let crash = crashReport();
        let crashLog = [crash.right + 0, crash.left + 0, crash.up + 0, crash.down + 0];
        findAppleDir();
        // console.log(dirPrompt + ": " + crashLog);

        if (isArraySame(crashLog, [0, 1, 1, 1])) {
            moveRight();
            return
        } else if (isArraySame(crashLog, [1, 0, 1, 1])) {
            moveLeft();
            return
        } else if (isArraySame(crashLog, [1, 1, 0, 1])) {
            moveUp();
            return
        } else if (isArraySame(crashLog, [1, 1, 1, 0])) {
            moveDown();
            return
        } else if (isArraySame(crashLog, [1, 1, 1, 1])) {
            console.log("We give up. No moves available!");
            console.log("SnakeAi Lost.");
            return pause_play();
        }

        if (!crash[dirPrompt.toLowerCase()]) return window['move' + dirPrompt]();
        if (isArraySame(crashLog, [0, 0, 1, 1])) return appleIsRight ? moveRight() : moveLeft();
        if (isArraySame(crashLog, [1, 1, 0, 0])) return appleIsUp ? moveUp() : moveDown();
    }
}

function crashReport(snakeObj = snake, movesAhead = 1) {
    let futureSnake = cloneObject(snakeObj, Snake);
    for (let i = 0; i < movesAhead - 1; i++)
        futureSnake.update();

    futureSnake.possibleMovements();
    let futureBody = futureSnake.body;
    return {
        right: isSnakeCollide(futureSnake.right, futureBody),
        left: isSnakeCollide(futureSnake.left, futureBody),
        up: isSnakeCollide(futureSnake.up, futureBody),
        down: isSnakeCollide(futureSnake.down, futureBody),
    };
}