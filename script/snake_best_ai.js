//HamiltonianCycle

let snakeVelPath = [];
let frameSnakeStartsOn = 0;
let is_running_BestSnakeAI = false;
var run_Hamil_Algo = true;

let snakePath = [];
let graphSizeForAlgo = [rows, cols];

/**
 * The main AI function. It calculates the best path to the apple and moves the snake along that path.
 */
function snakeBestAI() {
    if (!is_running_BestSnakeAI) {
        log.clear()
        console.log( log.d("Calculating Best Path. . ."));
        console.group("AI logs");
        snakePath = bestPathToApple();
        if (snakePath.length === 0) {
            console.log("Could not find path to apple. Giving Up.");
            pause_play();
            is_running_BestSnakeAI = false;
            return [];
        }
        console.log("Snake Path: ", snakePath);
        snakeVelPath = gridPathToSnakeVelPath(snakePath);
        console.groupEnd();
        running_ai = (run_Hamil_Algo) ? "Running Hamil Cycle: " : "Running A* Path: ";
    }
    // let thisID = setTimeout(() => console.log(log.clear(), "Clear Log"),2000);
    // clearTimeout(thisID);

    if (running_ai === "Running Hamil Cycle: " && run_Hamil_Algo === false) {
        log.clear();
        log.d("Switching to A* Path: ");
        log.d('[ - ]');
    } else if (running_ai === "Running A* Path: " && run_Hamil_Algo === true) {
        log.clear();
        log.d("Switching to Hamil Cycle: ");
        log.d('[ - ]');
    } else {
        log.clear();
        log.d(running_ai);
        log.d('[' + snakePath + ']');
    }
    moveSnakeAlongVelPath();
}

let foundHamilPath = false;
let run_Hamil_Algo_force = false;

function bestPathToApple() {
    let graph = new GridGraph(rows, cols);
    let bestPath = [];
    //Convert coordinates to grid numbers
    let snakeHeadGridNum = graph.coordToGridNum(snake.head);
    let appleGridNum = graph.coordToGridNum([appleX, appleY]);
    let snakeGridBody = snake.body.map((pos) => graph.coordToGridNum(pos));

    //Optimize Graph
    let graphPrevSz = graph.size;
    // graph = optimizeGraph(graph, snakeGridBody, appleGridNum);
    // graphSizeForAlgo = graph.size;
    const graphChanged = (graph.size[0] !== rows || graph.size[1] !== cols);
    console.log("Graph Changed: ", graphChanged, " Graph Size: ", graph.size);
    // if (graphChanged){
    //     console.log("Previous Graph Size: " + graphPrevSz + " => " + graph.size);
    //     snakeHeadGridNum = translateGridNum(snakeHeadGridNum, graphPrevSz, graphSizeForAlgo, 0);
    //     appleGridNum = translateGridNum(appleGridNum, graphPrevSz, graphSizeForAlgo);
    //     snakeGridBody = snakeGridBody.map((gridNum) => translateGridNum(gridNum, graphPrevSz, graphSizeForAlgo));
    //     console.log("Snake Head: ", snakeHeadGridNum, " Apple: ", appleGridNum, " Snake Body: ", snakeGridBody);
    // }*/

    //Choose Algorithm to use to find bestPath
    if (run_Hamil_Algo_force === true) {
            run_Hamil_Algo = true;
    }

    if (run_Hamil_Algo) {
        console.log("foundHamilPath: ", foundHamilPath, " graphChanged: ", graphChanged);
        if (foundHamilPath && !graphChanged) return snakePath;
        console.time("hamilCycle")
        let hamilPath = bestHamiltonianCycle(graph, snakeHeadGridNum, [], snakeGridBody, appleGridNum);
        console.timeEnd("hamilCycle")
        console.log("hamilPath: ", hamilPath);

        if(hamilPath.length === 0){
            console.error("Good luck A* failed and then we could not find hamil path");
            log.clear();
            log.d("Good luck A* failed and then we could not find hamil path");
            is_running_BestSnakeAI = false;
            foundHamilPath = false
            run_AI_Find_Path = false;
            return [];
        }
        foundHamilPath = true;
        bestPath = hamilPath;
    } else {
        console.time("A* Search")
        let shortestPath = shortestPathToApple(graph, snakeHeadGridNum, appleGridNum, snakeGridBody);
        console.timeEnd("A* Search")
        console.log("Shortest Path: ", shortestPath, " from " + snakeHeadGridNum + " to " + appleGridNum);
        foundHamilPath = false;
        if(shortestPath.length === 0){
            //switch to Hamiltonian Cycle
            run_Hamil_Algo = true;
            run_Hamil_Algo_force = true;
            console.error("Switching to Hamiltonian Cycle : ");
            console.log("Snake Head: ", snakeHeadGridNum, " Apple: ", appleGridNum, " Snake Body: ", snakeGridBody);
            return bestPathToApple();
        }
        bestPath = shortestPath;
    }
    if (graphChanged)
        bestPath = bestPath.map((path) => path.map((gridNum) => translateGridNum(gridNum, graphSizeForAlgo, graphPrevSz, 0)));
    return bestPath;
}

function shortestPathToApple(graph, headGridNum, appleGridNum, snakeGridBody = []) {
    let gridBody = snakeGridBody.slice(0, -1); //Remove tail from body because it cannot hit it
    let shortestPath = graph.aStarSearch(headGridNum, appleGridNum, snakeGridBody);
    return shortestPath;
}

let pathsTried = 0;

function bestHamiltonianCycle(graph, snakeHeadGridNum, blocked, snakeGridBody, appleGridNum) {
    let hamilPaths = hamiltonianCycle(graph, snakeHeadGridNum, blocked, snakeGridBody, appleGridNum)
    console.log("Hamil Paths: ", hamilPaths);
    let bestPath = evalBestHamilPath(hamilPaths, appleGridNum);
    return bestPath
}

let pathWapple = 0;

///@desc Finds the shortest path where the snake eats the apple and return it
function evalBestHamilPath(hamilPaths = [[]], appleGridNum) {
    let bestPath = [];
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
    return bestPath;
}

/**
 * Removes duplicate arrays from a 2D array.
 * @param {Array} array2D - The 2D array to remove duplicates from.
 */
let numDuplicates = 0;

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

function moveSnakeAlongVelPath() {
    if (!is_running_BestSnakeAI) {
        frameSnakeStartsOn = frame + 1;
        is_running_BestSnakeAI = true;
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
}

/**
 * Translates a node from a previous graph to a new graph. Every new column descending the node changes by the formula below
 * @param {number} prevNode - The node in the previous graph
 * @param {Array} graphPrevSize - The size of the previous graph as [rows, cols]
 * @param {Array} newGraphSize - The size of the new graph as [rows, cols]
 Here is the documentation for the `translateGridNum` function:

 * @param {number} rowOffset - An integer that represents how many columns from the prevGraph is the newGraph shifted.
 * @param colOffset - An integer that represents how many columns from the prevGraph is the newGraph shifted.
 * from position 0,0. Therefore, rowOffset 0 mean they share the same top left corner
 * @returns {number} The translated node
 */
function translateGridNum(prevNode, graphPrevSize = [0, 0], newGraphSize = [0, 0],
                          rowOffset = 0, colOffset = 0) {

    const colDiff = graphPrevSize[1] - newGraphSize[1] - colOffset;
    if (colDiff === 0) return prevNode; //Until graph optimizes row as well

    const prevColSize = graphPrevSize[1];
    const colPrevGraph = (Math.floor(prevNode / prevColSize) + 1) - rowOffset;
    const rowPrevGraph = (prevNode % prevColSize) + 1;

    const translatedNode = (prevNode - rowOffset) - colDiff * (colPrevGraph - 1); //The first column's node does not change hence -1
    console.log(prevNode," => ", translatedNode);
    return translatedNode;
}



let testSnake = new Snake();

let drawTestSnake = () => {
    drawSnake(testSnake, "rgb(200,200,200)", "rgb(150,150,150)");
}

const log = {
    el: document.getElementById("log"),
    clear: () => log.el.innerHTML = "",
    d: (msg) => (log.el.innerHTML += msg + "<br>")
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
    run_Hamil_Algo_force = false;
    run_AI_Find_Path = false;

    snakePath = [];
    snakeVelPath = [];

    testSnake = new Snake;
    foundHamilPath = false;
}