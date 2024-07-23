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

function snakeBestAI() {
    console.group("AI logs");
    if (!is_running_BestSnakeAI) {
        testSnake = cloneObject(snake, Snake);
        drawTestSnake();

        snakePath = bestPathToApple().then((value) => console.log(value + " frame:" + frame));
        console.log("Best Path: ", snakePath);
        snakeVelPath = gridPathToSnakeVelPath(snakePath);

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
        setTimeout(() => {}, 1000);
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
    console.groupEnd();
}

async function bestPathToApple() {
    let graph = new GridGraph(rows, cols);
    let snakeHeadGridNum = coordToGridNum(snake.head);
    let appleGridNum = coordToGridNum([appleX, appleY]);
    let snakeBodyGrid = snake.body.map((pos) => coordToGridNum(pos));
    let block = snakeBodyGrid.slice(0, -1); //Exclude tail end because head cannot hit the tail end
    // console.log("Snake Head GridNum: ", snakeHeadGridNum, "Apple GridPos: ", appleGridNum, "Blocks: ", block);

    if (run_Hamil_Algo) {
        let hamilPath = await hamiltonianCycle(graph, snakeHeadGridNum, [],
            {
                snakeBlock: snakeBodyGrid, appleGridNum: appleGridNum, optimize: {
                    async: true, findApple: true, graph: true
                }
            });
        return hamilPath;
    } else {
        let shortestPath = shortestPathToApple(graph, snakeHeadGridNum, appleGridNum, block);
        console.log("Shortest Path: ", shortestPath, " from " + snakeHeadGridNum + " to " + appleGridNum);
        return shortestPath;
    }
}

function shortestPathToApple(graph, headGridNum, appleGridNum, snakeGridBody = []) {
    let gridBody = snakeGridBody.flat();
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

function bestHamiltonianCycle(graph, snakeHeadGridNumber, appleGridPos) {
    let hamilPaths = generateHamiltonianCycles(graph, snakeHeadGridNumber);
    hamilPaths = removeDuplicateArr(hamilPaths);

    console.group("Hamil Logs");
    console.log("BadPaths found: ", badPaths);
    console.log("Paths tried: ", pathsTried);
    console.log("Average BadPath: ", badPaths / pathsTried);
    console.log("New Culled HamilPaths:", hamilPaths);
    badPaths = 0;
    pathsTried = 0;
    console.groupEnd();

    let bestPath = evalBestHamilPath(hamilPaths, appleGridPos);
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

function generateHamiltonianCycles(graph = new Graph(), startNode = 0, attempts = cols) {
    let hamilPaths = [];
    tryPaths(graph, startNode);
    hamilPaths = hamilCycles;
    hamilCycles = [];
    console.log("Paths created sire: ", hamilPaths);
    return hamilPaths;
}

let pathsTried = 0;

function tryPaths(graph = new Graph(), startAt = 0) {
    // Snake body is [2,1,0] where 2 is popped and the head is shifted in to update body
    // but we want the gridPath to be [0,1,2,3] where 3 is the head hence the reverse
    let snakeGridBody = testSnake.body.reverse().map((pos) => coordToGridNum(pos));
    let vertex = graph.V[startAt];
    let trackPath = [].concat(snakeGridBody).concat(startAt);

    let limit = 0;
    let appleGridPos = coordToGridNum([appleX, appleY]);
    console.log("Apple GridPos: ", appleGridPos);
    pathsTried++;

    ///TODO: Implement Depth First Search Algorithm

    console.group("Hamil DFS Results")
    let lastPath = DFSearchPath(graph, trackPath, vertex);
    console.groupEnd();
    console.log(hamilCycles);

    /* //Choose edge closer to apple
       let closestEdge = findClosestEdge(vertexEdges, appleGridPos);
          if(closestEdge !== -1)
            vertex = cloneObject(graph.V[closestEdge])
    */

    hamilCycles.forEach((path) => {
        if (!path.includes(appleGridPos)) {
            badPaths++;
        }
    });
    console.log("no apple Paths: ", badPaths);
    console.log("Edges explored: ", edgesExplored);
    return hamilCycles;
}

let hamilCycles = [];
let edgesExplored = 0;

function DFSearchPath(graph, initPath = [], vertex) {
    let visited = [].concat(initPath);
    if (hamilCycles.length === 100) {
        return visited;
    }

    //Recursion terminator
    if (isHamilPath(graph, visited) || visited.length >= rows * cols) {
        if (visited.length >= rows * cols) {
            console.error("failed finding hamil gridPath.");
            visited.pop();
            return visited;
        } else {
            console.log("Hamiltonian Path found 🥳 @:", visited);
            // Move snake body from the front to the end of the array
            // so that the path starts again from head.
            let hamilCycle = visited.slice(3).concat(visited.slice(0, 3), visited[3]);
            hamilCycles.push(hamilCycle);
        }
        return visited;
    }

    let vertexEdges = vertex.edges;
    for (let i = 0; i < vertexEdges.length; i++) {
        let nextEdge = vertexEdges[i];
        let adjVertex = graph.V[nextEdge];

        // Mark edge as visited, remove Edge

        if (!visited.includes(nextEdge)) {
            visited.push(nextEdge);
            DFSearchPath(graph, visited, adjVertex);
            visited.pop();
        }
    }
    edgesExplored += vertexEdges.length;
    return visited;
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

function coordToGridNum(coord2D = [0, 0], _rows = rows, gridSz = gridSize) {
    let row = Math.floor(coord2D[0] / gridSz);
    let column = Math.floor(coord2D[1] / gridSz);

    let gridNum = column * _rows + row;
    return gridNum;
}

function gridPathToSnakeVelPath(gridPath) {
    let snakeVelPath = [];
    for (let i = 1; i < gridPath.length; i++) {
        let gridPosBefore = gridPath[i - 1];
        let gridPosAfter = gridPath[i];
        let dif = gridPosAfter - gridPosBefore;

        vel = (dif === 1) ? [1, 0] : //Snake moved right
            (dif === -1) ? [-1, 0] : //Snake moved left
                (dif === cols) ? [0, 1] : //Snake moved down
                    (dif === -cols) ? [0, -1] : //Snake moved up
                        null;

        if (vel == null)
            console.error(gridPosBefore + " to " + gridPosAfter + "could not be evaluated.\n"
                + "Grid Path not possible");
        else
            snakeVelPath.push(vel);
    }
    return snakeVelPath;
}

function isGameOver(position, block) {
    return isSnakeCollide(position, block);
}

function isObjectEmpty(obj) {
    return Object.keys(obj).length === 0 && (obj.constructor === Object || obj.constructor === Array);
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