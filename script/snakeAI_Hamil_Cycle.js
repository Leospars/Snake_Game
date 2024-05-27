//HamiltonianCycle
// noinspection EqualityComparisonWithCoercionJS

let testSnake = new Snake();
let drawTestSnake = () => {
    drawSnake(testSnake, "rgb(200,200,200)", "rgb(150,150,150)");
}

let snakeVelPath = [];
let frameSnakeStartsOn = 0;
let isRunningHamilCycle = false;

let snakePath = [];
let gridPath = [15, 16, 17, 18, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
    29, 28, 27, 26, 25, 24, 23, 22, 21, 20, 19, 34, 33, 32, 31, 30, 15];
gridPath = gridPath.slice(3).toSpliced(-1).concat(gridPath.slice(0,3), gridPath[3]);

function snakeAI_Hamil_Cycle() {
    if (!isRunningHamilCycle) {
        testSnake = cloneObject(snake, Snake);
        drawTestSnake();

        snakePath = shortestPathToApple();
        console.log("Best Hamil Path: ", snakePath);
        snakeVelPath = gridPathToSnakeVelPath(snakePath);

        for (let vel of snakeVelPath){
            testSnake.velocity(vel[0], vel[1]);
            console.log(vel);
            //Move testSnake and store movement
            testSnake.update();
            drawTestSnake();
        }
        testSnake.velocity(0, 0);

        frameSnakeStartsOn = frame + 1;
        isRunningHamilCycle = true;
        pause_play();
    }
    else {
        //Run a single movement command per frame until gridPath is complete
        let iterator = frame - frameSnakeStartsOn;
        if (iterator <= snakeVelPath.length - 1) {
            // Move real Snake
            snake.velocity(snakeVelPath[iterator][0], snakeVelPath[iterator][1]);
        }
        else if (iterator === snakeVelPath.length) {
            snake.velocity(0, 0);
            isRunningHamilCycle = false;
        }
    }

    drawTestSnake(); //To keep test snake on the screen after press play
}

/**
 * Removes duplicate arrays from a 2D array.
 * @param {Array} array2D - The 2D array to remove duplicates from.
 */
var numDuplicates = 0;
var badPaths = 0;
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

function coordinatesToGridPos([xPos, yPos], row = rows, grid = gridSize) {
    let gridPos = {
        x: Math.floor(xPos / grid),
        y: Math.floor(yPos / grid)
    }
    let gridNumber = (gridPos.y * row) + gridPos.x;
    templog("Position evaluated to: " + gridNumber);
    return gridNumber;
}

function gridPosToCoordinate(gridNumber, col = cols, grid = gridSize) {
    let xPos = (gridNumber % cols) * grid;
    let yPos = Math.floor(gridNumber / 15) * grid;
    return [xPos, yPos];
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
            console.error("Grid Path not possible");
        else
            snakeVelPath.push(vel);
    }
    return snakeVelPath;
}

/** Compares current and previous coordinate and converts
 * it to snake x and y velocity */
function coordinatePathToSnakeVel(coordinatePath = snakeTrack) {
    let snakeVelPath = [];
    let vel = [0, 0];
    for (let i = 0; i < coordinatePath.length - 1; i++) {
        let xDif = coordinatePath[i + 1][0] - coordinatePath[i][0];
        let yDif = coordinatePath[i + 1][1] - coordinatePath[i][1];

        vel[0] = (xDif < 0) ? -1 : ((xDif > 0) ? 1 : 0);
        vel[1] = (yDif < 0) ? -1 : ((yDif > 0) ? 1 : 0);
        snakeVelPath.push([vel[0], vel[1]]);
    }
    return snakeVelPath;
}

function isGameOver(position, block) {
    return isSnakeCollide(position, block);
}

let showLogs = true;
function templog(...data) {
    let showStartWith = [
        "Sire",
    ];

    if (showLogs)
        console.log(...data);
    else {
        for (let text of showStartWith) {
            if (data[0].toString().toLowerCase().startsWith(text))
                console.log(...data);
        }
    }
}

function generateHamiltonianCycles(graph, startNode = 0, attempts = cols, condition = () => { }) {
    let testGraph = cloneObject(graph);

/*    // if attribute is a string changes it to integers starting at 0
    let index = 0;
    for (let attr in testGraph){
        //check is attr is a string that is a number
        if(!Number.isNaN(attr))
            continue;

        testGraph[index] = cloneObject(testGraph[attr]);
        index++;
        delete testGraph[attr];
    }*/

    let hamilPaths = [];
    tryPaths(testGraph, startNode);
    hamilPaths = hamilCycles;
    console.log("Paths created sire: ", hamilPaths);
    return hamilPaths;
}

var pathsTried = 0;
function tryPaths(graph = { position: 0, edges: [] }, startAt = 0) {
    // Snake body is [2,1,0] where 2 is popped and the head is shifted in to update body
    // but we want the gridPath to be [0,1,2,3] where 3 is the head hence the reverse
    let snakeGridBody = testSnake.body.reverse().map((pos) => coordinatesToGridPos(pos));
    let vertex = cloneObject(graph.V[startAt]);
    let trackPath = [].concat(snakeGridBody).concat(startAt);

    let limit = 0;
    let appleGridPos = coordinatesToGridPos([appleX, appleY]);
    pathsTried++;

    ///TODO: Implement Depth First Search Algorithm

        let lastPath = DFSearchPath(graph, trackPath, vertex);
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

let  hamilCycles = [];
let edgesExplored = 0;
function DFSearchPath(graph, initPath = [], vertex) {
    let visited = [].concat(initPath);
    console.log("new visited: ", visited);
    if(hamilCycles.length === 50){
        return visited;
    }

    //Recursion terminator
    if(isHamilPath(graph, visited)  || visited.length >= rows * cols){
        if(visited.length >= rows * cols){
            templog("failed finding hamil gridPath.");
        } else {
            templog("Hamiltonian Path found 🥳 @:", visited);
            // Move snake body from the front to the end of the array
            // so that the path starts again from head.
            let hamilCycle = visited.slice(3).concat(visited.slice(0,3), visited[3]);
            hamilCycles.push(hamilCycle);
        }
        return visited;
    }

    let vertexEdges = vertex.edges;
    for (let i = 0; i < vertexEdges.length; i++) {
        let nextEdge = vertexEdges[i];
        let adjVertex = graph.V[nextEdge];

        // Mark edge as visited, remove Edge
        if (!visited.includes(nextEdge)){
            visited.push(nextEdge);
            DFSearchPath(graph, visited, adjVertex);
            visited.pop();
        }
        else
            ;
    }
    edgesExplored += vertexEdges.length;
    templog("All edges explored. ");
    return visited;
}

// const wasTravellerAt = (vertex, trackPath) => {
//     //check if vertex.visited is a boolean value
//     // if(Object.hasOwn(vertex, "visited") && typeof vertex.visited === "boolean"){
//     //     return vertex.visited;
//     // }
//     return trackPath.includes(vertex.location);
// }

function isObjectEmpty(obj) {
    return Object.keys(obj).length === 0 && (obj.constructor === Object || obj.constructor === Array);
}

function isHamilPath(graph = { position: 0, edges: [] }, path = [0]) {
    if (isObjectEmpty(graph) || graph.V[0].edges.length === 0) {
        throw new Error("Graph is empty or node not tranversable");
        return false;
    }
    if (path.length < 3)
        return false;

    let endWithEdge = graph.V[path[0]].edges.includes(path[(path.length - 1)]);
    if (endWithEdge) {
        //Check if gridPath has repeated/duplicate V
        for (let i = 1; i < path.length - 1; i++) {
            if (path.slice(i + 1).includes(path[i]))
                return false;
        }
        templog("Is Hamil Path. Yaay 🙌");
        return true;
    }
    else
        return false;
}

function isHamilCycle(graph, path) {
    if (isObjectEmpty(graph))
        throw new Error("Graph is empty");
    if (path.length < 3)
        return false;

    let endWithEdge = graph.V[path[0]].edges.includes(path[(path.length - 1)]);
    let endWithStart = path[0] === path[(path.length - 1)];
    let numVertices = Object.keys(graph).length;
    if ((endWithEdge || endWithStart) && path.length === numVertices) {
        //Check if gridPath has repeated V
        for (let i = 1; i < path.length - 1; i++) {
            if (path.slice(i + 1).includes(path[i]))
                return false;
        }
        return true;
    }
    else
        return false;
}

function shortestPathToApple() {
    //Generate Hamiltonian Cycle
    let graph = new Graph().generateFieldGraph(rows, cols);
    let snakeHeadGridNumber = coordinatesToGridPos(snake.head);
    let specialCondition = isGameOver;

    let shortestPath = aStarSearch();
    let hamilPaths = [];
    hamilPaths = generateHamiltonianCycles(graph, snakeHeadGridNumber, specialCondition);
    hamilPaths = removeDuplicateArr(hamilPaths);

    console.log("BadPaths found: ", badPaths);
    console.log("Paths tried: ", pathsTried);
    console.log("Average BadPath: ", badPaths / pathsTried);
    console.log("New Culled HamilPaths:", hamilPaths);

    let bestPath = hamilPaths[0];
    let appleGridPos = coordinatesToGridPos([appleX, appleY]);

    for (let i = 0; i < hamilPaths.length; i++) {
        path = hamilPaths[i];
        if (path.includes(appleGridPos)) {
            console.log("Sire 🙋 there is an apple my gridPath: gridPath ");

            if (bestPath.includes(appleGridPos)) {
                if (path.length < bestPath.length)
                    bestPath = path;
            }
            else
                bestPath = path;
        }
    }
    return bestPath;
}

function idleSnake() {
    //make snake follow tail in other words previous location in gridPath

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
                }
                else
                    copy[attr] = obj[attr];
            }
        }
    }
    return copy;
}

function restart_AI_variables(){
    frameSnakeStartsOn = 0;
    isRunningHamilCycle = false;

    snakePath = [];
    snakeVelPath = [];

    testSnake = new Snake;
}