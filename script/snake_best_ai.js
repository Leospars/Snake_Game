//HamiltonianCycle

let testSnake = new Snake();

let drawTestSnake = () => {
    drawSnake(testSnake, "rgb(200,200,200)", "rgb(150,150,150)");
}

let snakeVelPath = [];
let frameSnakeStartsOn = 0;
let is_running_BestSnakeAI = false;
var run_Hamil_Algo = true;

let snakePath = [];
let graphUsedForAlgo = new GridGraph(rows, cols);

/**
 * The main AI function. It calculates the best path to the apple and moves the snake along that path.
 */
function snakeBestAI() {
    console.group("AI logs");
    if (!is_running_BestSnakeAI) {
        snakePath = bestPathToApple();
        snakeVelPath = gridPathToSnakeVelPath(snakePath, graphUsedForAlgo);
    }
    moveDemoSnake();
    console.groupEnd();
}

function bestPathToApple() {
    let graph = new GridGraph(rows, cols);

    //Convert coordinates to grid numbers
    let snakeHeadGridNum = graph.coordToGridNum(snake.head);
    let appleGridNum = graph.coordToGridNum([appleX, appleY]);
    let snakeGridBody = snake.body.map((pos) => graph.coordToGridNum(pos));
    console.log("Snake Head: ", snakeHeadGridNum, " Apple: ", appleGridNum, " Snake Body: ", snakeGridBody);

    //Optimize Graph
    let graphPrevSz = graph.size;
    graph = optimizeGraph(graph, snakeGridBody, appleGridNum);
    graphUsedForAlgo = graph;
    if (!isArraySame(graphPrevSz, graph.size)) {
        console.group("Optimize Graph");
        console.log("Translated Graph Size: " + graph.size);
        snakeHeadGridNum = translateGridNum(snakeHeadGridNum, graphPrevSz, graph.size, 0);
        appleGridNum = translateGridNum(appleGridNum, graphPrevSz, graph.size);
        snakeGridBody = snakeGridBody.map((gridNum) => translateGridNum(gridNum, graphPrevSz, graph.size));
        console.log("Snake Head: ", snakeHeadGridNum, " Apple: ", appleGridNum, " Snake Body: ", snakeGridBody);
        console.groupEnd();
    }

    //Choose Algorithm to use to find bestPath
    if (run_Hamil_Algo) {
        let hamilPath = bestHamiltonianCycle(graph, snakeHeadGridNum, [], snakeGridBody, appleGridNum);
        return hamilPath;
    } else {
        let shortestPath = shortestPathToApple(graph, snakeHeadGridNum, appleGridNum, snakeGridBody);
        console.log("Shortest Path: ", shortestPath, " from " + snakeHeadGridNum + " to " + appleGridNum);
        return shortestPath;
    }
}

function shortestPathToApple(graph, headGridNum, appleGridNum, snakeGridBody = []) {
    let gridBody = snakeGridBody.slice(0, -1); //Remove tail from body because it cannot hit it
    console.log("Block before A* Search: ", gridBody);
    let shortestPath = graph.aStarSearch(headGridNum, appleGridNum, snakeGridBody);
    console.log("Block after A* Search: ", gridBody);
    if (shortestPath.length === 0) {
        // Chase after tail until apple is found... hopefully lol. if possible
        console.error("Couldn't find apple, trying something new... going to chase tail.");
        // shortestPath = findAltPathToApple(graph, headGridNum, appleGridNum, block);
        console.log("Shortest Path after considering Tail Path: ", shortestPath);
    }
    if (shortestPath.length === 0)
        pause_play(); //Pause the game if no path is found.
    return shortestPath;
}

let pathsTried = 0;

function bestHamiltonianCycle(graph, snakeHeadGridNum, blocked, snakeGridBody, appleGridNum) {
    let hamilPaths = hamiltonianCycle(graph, snakeHeadGridNum, blocked, snakeGridBody, appleGridNum)
    hamilPaths = removeDuplicateArr(hamilPaths);

    console.group("Hamil Logs");
    console.log("Paths tried: ", pathsTried);
    console.log("Average BadPath: ", 1 - hamilPaths.length / pathsTried);
    console.log("New HamilPaths:", hamilPaths.length);
    badPaths = 0;
    pathsTried = 0;
    console.groupEnd();

    let bestPath = evalBestHamilPath(hamilPaths, appleGridNum);
    return bestPath
}

let pathWapple = 0;

///@desc Finds the shortest path where the snake eats the apple and return it
function evalBestHamilPath(hamilPaths = [[]], appleGridNum) {
    let bestPath = hamilPaths[0];
    pathWapple = 0;
    hamilPaths.forEach((path) => {
        if (path.includes(appleGridNum)) {
            pathWapple++;

            if (bestPath.includes(appleGridNum)) {
                if (path.length < bestPath.length)
                    bestPath = path;
            } else
                bestPath = path;
        }
    })
    console.log("paths with apple: " + pathWapple, "Percentage: " + pathWapple / hamilPaths.length * 100);
    return bestPath;
}

/**
 * Removes duplicate arrays from a 2D array.
 * @param {Array} array2D - The 2D array to remove duplicates from.
 */
let numDuplicates = 0;
let badPaths = 0;

function removeDuplicateArr(array2D) {
    numDuplicates = 0;
    let numEmptyArr = 0;
    for (let i = 0; i < array2D.length; i++) {
        let arr = array2D[i];
        // let everyOtherArr = array2D.slice(i + 1);
        for (let j = i + 1; j < array2D.length; j++) {
            let otherArr = array2D[j];
            if (JSON.stringify(arr) === JSON.stringify(otherArr)) {
                // Remove duplicate array
                array2D.splice(j, 1);
                numDuplicates++;
                if (JSON.stringify(arr) === '[]')
                    numEmptyArr++;
            }
        }
    }
    // console.log("Removed: " + numDuplicates );
    return array2D;
}

function gridPathToSnakeVelPath(gridPath, graph = new GridGraph(rows, cols)) {
    let snakeVelPath = [];
    for (let i = 1; i < gridPath.length; i++) {
        let gridPosBefore = gridPath[i - 1];
        let gridPosAfter = gridPath[i];
        let dif = gridPosAfter - gridPosBefore;

        let vel = (dif === 1) ? [1, 0] : //Snake moved right
            (dif === -1) ? [-1, 0] : //Snake moved left
                (dif === graph.cols) ? [0, 1] : //Snake moved down
                    (dif === -graph.cols) ? [0, -1] : //Snake moved up
                        null;

        if (vel == null)
            console.error(gridPosBefore + " to " + gridPosAfter + "could not be evaluated.\n"
                + "Grid Path not possible");
        else
            snakeVelPath.push(vel);
    }
    return snakeVelPath;
}

/**
 * Translates a node from a previous graph to a new graph. Every new column descending the node changes by the formula below
 * @param {number} prevNode - The node in the previous graph
 * @param {Array} graphPrevSize - The size of the previous graph as [rows, cols]
 * @param {Array} newGraphSize - The size of the new graph as [rows, cols]
 Here is the documentation for the `translateGridNum` function:

 * @param {number} rowOffset - The row offset for the translation (default is 0)
 * @returns {number} The translated node
 */
function translateGridNum(prevNode, graphPrevSize = [0, 0], newGraphSize = [0, 0], rowOffset = 0) {
    const colOffset = graphPrevSize[1] - newGraphSize[1];
    if (colOffset === 0) return prevNode; //Until graph optimizes row as well

    const prevColSize = graphPrevSize[1];
    const colInGraph = (Math.floor(prevNode / prevColSize) + 1) - rowOffset;

    const translatedNode = (prevNode - rowOffset) - colOffset * (colInGraph - 1); //The first column's node does not change hence -1
    console.log("Col Offset: ", colOffset, " Col in Graph: ", colInGraph, " PrevNode: ", prevNode, " Row Offset: ", rowOffset)
    console.log("Translated Node: ", translatedNode);
    return translatedNode;
}

function moveDemoSnake() {
    if (!is_running_BestSnakeAI) {
        testSnake = cloneObject(snake, Snake);
        drawTestSnake();

        //Move testSnake
        for (let vel of snakeVelPath) {
            testSnake.velocity(vel[0], vel[1]);
            testSnake.update();
            drawTestSnake();
        }
        testSnake.velocity(0, 0);

        frameSnakeStartsOn = frame + 1;
        is_running_BestSnakeAI = true;
        //delay for 2 seconds
        setTimeout(() => {
        }, 1000);
    } else {
        //Run a single movement command per frame until gridPath is complete
        let iterator = frame - frameSnakeStartsOn;
        if (iterator <= snakeVelPath.length - 1) {
            // Move real Snake
            snake.velocity(snakeVelPath[iterator][0], snakeVelPath[iterator][1]);
        } else if (iterator === snakeVelPath.length) {
            snake.velocity(0, 0);
            is_running_BestSnakeAI = false;
        }
    }

    drawTestSnake(); //To keep test snake on the screen after press play
}
function cloneObject(obj, classType = Object) {
    if (obj == null || typeof (obj) != 'object') {
        return obj;
    }
    let copy = new classType;

    //Handle Date
    if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
    }

    //Handle Array
    else if (obj instanceof Array) {
        copy = [];
        for (let i = 0, len = obj.length; i < len; i++) {
            copy[i] = cloneObject(obj[i]);
        }
    }

    //Handle Object
    else if (obj instanceof Object) {
        for (let attr in obj) {
            if (Object.hasOwn(obj, attr)) {
                //Check if object attribute is an array
                if (obj[attr] instanceof Array || obj[attr] instanceof Date) {
                    copy[attr] = cloneObject(obj[attr]);
                } else
                    copy[attr] = obj[attr];
            }
        }
    }
    return copy;
}

function restart_AI_variables() {
    frameSnakeStartsOn = 0;
    is_running_BestSnakeAI = false;

    snakePath = [];
    snakeVelPath = [];

    testSnake = new Snake;
}