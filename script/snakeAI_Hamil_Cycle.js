//HamiltonianCycle
// noinspection EqualityComparisonWithCoercionJS

let snakeTrack = [];
let testSnake = new Snake;
let drawTestSnake = () => {
    drawSnake(testSnake, "rgb(200,200,200)", "rgb(150,150,150)");
}

function snakeAIHamilCycle (){
    let vertexIsAlreadyInPath = (position) => !snakeWasAt(position) && !isGameOver(position, testSnake.body);
    if(snakeTrack.length === 0){
        console.log("Create test Snake");
        testSnake = new Snake;
        testSnake = cloneObject(snake, Snake);
        drawTestSnake();
    }

    //run virtual snake simulation
    for (let i = 0; i < rows*cols; i++) {
        context.clearRect(0,0,field.width, field.height);
        testSnake.possibleMovements();
        if(vertexIsAlreadyInPath(testSnake.right))
            moveRight(testSnake);
        else if(vertexIsAlreadyInPath(testSnake.down))
            moveDown(testSnake);
        else if(vertexIsAlreadyInPath(testSnake.up))
            moveUp(testSnake);
        else if(vertexIsAlreadyInPath(testSnake.left))
            moveLeft(testSnake);
        else {
            templog("Hamiltonian Cycle not found. Giving up.");
            testSnake.velocity(0,0);
            break;
        }
        testSnake.update();
        //Draw Apple
        context.fillStyle = "red";
        context.fillRect(appleX, appleY, gridSize, gridSize)
        
        drawTestSnake();
        snakeTrack.push(testSnake.head);
        if(isGameOver(testSnake.head, testSnake)){
            templog("Snake crashed at:" + testSnake.head);
            break;
        }
    }
    templog(snakeTrack);
    snakeTrack = [];

    // console.log("Ai is running", snakeTrack.length, snakeWasAt(snake.right));
    if(snakeTrack.length === rows*cols){
        templog("Hamiltonian Cycle found.");
        templog("Track reset at: " + snakeTrack.length);
        templog(snakeTrack);
        snakeTrack = [];
        // snakeTrack = snakeTrack.concat(snake.body);
    }

}

function snakeAIHC(){
    let nextPosition = [];
    let isVertexSafe = (position) => !snakeWasAt(position) && !isGameOver(position, testSnake);

    if(snakeTrack.length === 0){
        console.log("Create test Snake");
        testSnake = new Snake;
        testSnake = cloneObject(snake, Snake);
        drawTestSnake();
    }

    testSnake.possibleMovements();
    if(isVertexSafe(testSnake.right)) {moveRight(testSnake); nextPosition = testSnake.right;}
    else if(isVertexSafe(testSnake.down)){ moveDown(testSnake); nextPosition = testSnake.down;}
    else if(isVertexSafe(testSnake.up)){ moveUp(testSnake); nextPosition = testSnake.up}
    else if(isVertexSafe(testSnake.left)){ moveLeft(testSnake); nextPosition = testSnake.down;}
    snakeTrack.push(testSnake.head);

    if(snakeTrack.length == rows*cols || isSamePoint(nextPosition,[appleX,appleY])){
        console.log("Track reset at: " + snakeTrack.length);
        snakeTrack = [];
        console.log(snakeTrack);
        // snakeTrack = snakeTrack.concat(snake.body);
    }
    console.log(snakeTrack);
    testSnake.update();
    drawTestSnake();
}

// has snake been at that position before
function snakeWasAt([xPos, yPos]){
    for (let i=0; i <= snakeTrack.length-1; i++) {
        if(isSamePoint([xPos,yPos], [snakeTrack[i][0], snakeTrack[i][1]]))
            return true;
    }
    return false;
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
                if(JSON.stringify(arr) === '[]')
                    numEmptyArr++;
            }
        }
    }
    // console.log("Removed: " + numDuplicates );
    return array2D;
}

let frameStartedOn = 0;
let isRunningHamilCycle = true;
function snakeAI_Hamil_Cycle() {
    let snakePath = [[1,0],[1,0],[1,0],
        [0,1],[0,1],[0,1],
        [-1,0],[-1,0],[-1,0],
        [0,-1],[0,-1],[0,-1]];
    snakePath = [ moveRight, moveRight, moveRight,
        moveDown, moveDown, moveDown,
        moveLeft, moveLeft, moveLeft,
        moveUp, moveUp, moveUp
    ];
        if(!isRunningHamilCycle){
            //Generate Hamiltonian Cycle
            let graph = generateFieldGraph(rows, cols);
            let snakeGridPos = canvasPosToGridPos(snake.head);
            let specialCondition = isGameOver;
            testSnake = cloneObject(snake, Snake);
            let sum = 0;
            let hamilPaths = [];
            hamilPaths = generateHamiltonianCycles(graph, snakeGridPos, 1000, specialCondition);
            hamilPaths = removeDuplicateArr(hamilPaths);

            console.log("Average Duplicates: ", sum/100);
            console.log("BadPaths found: ", badPaths);
            console.log("Paths tried: ", pathsTried);
            console.log("Average BadPath: ", badPaths/pathsTried);

            console.log("New Culled HamilPaths:",hamilPaths);
            let snakeGridPath = bestHamilPath(hamilPaths);
            console.log("Best Hamil Path: ", snakeGridPath);
            // snakePath = gridPosToSnakeVel(snakeGridPath);
            isRunningHamilCycle = true;
            frameStartedOn = frame+1;
        }
        else {
            //Run a single movement command per frame until path is complete
            let iterator = frame - frameStartedOn;
            if (iterator <= snakePath.length - 1) {
                console.log(iterator, snakePath[iterator], snakePath.length);
                // snake.velocity(snakePath[iterator][0], snakePath[iterator][1]);
                snakePath[iterator]();
            }
            else if (iterator === snakePath.length) {
                snake.velocity(0,0);
                isRunningHamilCycle = false;
                templog(snakePath);
            }
        }
    return snakePath;
}

function canvasPosToGridPos ([xPos, yPos], row = rows, grid = gridSize) {
    let gridPos = {
        x: Math.floor(xPos/grid),
        y: Math.floor(yPos/grid)
    }
    let gridNumber = (gridPos.y * row) + gridPos.x;
    templog("Position evaluated to: " + gridNumber);
    return gridNumber;
}

function gridPosToSnakeVel(gridPath) {
    let snakeMovements = [];
    for (let i = 1; i < gridPath.length; i++) {
        let gridPosBefore = gridPath[i-1];
        let gridPosAfter = gridPath[i];

        if(gridPosBefore + 1 === gridPosAfter && gridPath[i] % cols !== 0)
            //Snake moved right
            snakeMovements.push([1,0]);
        else if(gridPosBefore - 1 === gridPosAfter && gridPath[i] % cols !== 0)
            //Snake moved left
            snakeMovements.push([-1,0]);
        else if(gridPosBefore + cols === gridPosAfter)
            //Snake moved down
            snakeMovements.push([0,1]);
        else if(gridPosBefore - cols === gridPosAfter)
            //Snake moved up
            snakeMovements.push([0,-1]);

    }
    return snakeMovements;
}

function isGameOver (position, block) {
    return isSnakeCollide(position, block);
}

function generateFieldGraph(_rows = rows, columns=cols) {
    //graph holds each vertex
    let graph = {};

    const gridValueOutOfBounds = (vertexpos) => {
        if (vertexpos < 0 || vertexpos > _rows * columns - 1) {
            return -1;
        }
        return vertexpos;
    };

    //each vertex holds its neighbors and form a square cross
    //Initialize Base Graph Values
    for (let i = 0; i < _rows * columns; i++) {
        let vertex = graph[i.toString()] = {
            position: i,
            left: gridValueOutOfBounds(i - 1),
            top: gridValueOutOfBounds(i - _rows),
            right: gridValueOutOfBounds(i + 1),
            bottom: gridValueOutOfBounds(i + _rows),
        };
        
        vertex.edges = [];
        for (let attr in vertex) {
            //Remove out of bounds attributes
            if (vertex[attr] === -1)
                delete vertex[attr];

            //Fix edges that are out of bounds

            
            //Add connections/edge attribute to each vertex
            if(vertex.hasOwnProperty(attr) && attr !== "position" && attr !== "edges"){
                vertex["edges"].push(vertex[attr]);
            }
        }
    }
    return graph;
}

let  showLogs = true;
function templog(...data){
    let showStartWith = [
        "Sire",
    ];

    if(showLogs)
        console.log(...data);
    else{
        for (let text of showStartWith) {
            if(data[0].toString().toLowerCase().startsWith(text))
                console.log(...data);
        }
    }
}

function generateHamiltonianCycles(graph, startAt = 0, attempts = cols, condition = () => {}) {
    let testGraph = cloneObject(graph);
    let index = 0;
    
    //Add visited attribute to each vertex and Change all attribute name to integers starting at 0
    for (let attr in testGraph){
        //check is attr is a string that is a number
        if(!Number.isNaN(attr)) 
            continue;
        
        testGraph[attr].visited = false;
        testGraph[index] = cloneObject(testGraph[attr]);
        index++;
        delete testGraph[attr];
    }
    
    let hamilPaths = [];
    for (let i = 1; i <= attempts; i++) {
        templog("\x1b[1;33mAttempt: ", i);
        hamilPaths.push(tryPath(testGraph, startAt));
    }
    console.log("Paths created sire: ", hamilPaths);
    return hamilPaths;
}

var pathsTried = 0;
function tryPath(graph = {position: 0, edges: []}, startAt = 0) {
    let snakeGridBody = testSnake.body.map((pos) => canvasPosToGridPos(pos));
    let trackPath = [].concat(snakeGridBody);
    let vertex = cloneObject(graph[startAt]);
    let limit = 0;
    let appleGridPos = canvasPosToGridPos([appleX, appleY]);
    pathsTried++;
    while (!isHamilPath(graph, trackPath) && limit < rows * cols) {
        //&& !isGameOver(testSnake.head, testSnake.body)
        trackPath.push(vertex.position);
        let vertexEdges = vertex.edges;

        while(trackPath.includes(vertex.position)){
            let randomEdge = vertexEdges[rand(0, vertexEdges.length - 1)];
            vertex = cloneObject(graph[randomEdge]);

            if (isHamilCycle(graph, trackPath)) {
                templog("Hamiltonian Cycle found 🥳💃. @:", limit);
                return trackPath;
            }

            //Remove vertex from vertexEdges
            if(trackPath.includes(vertex.position))
                vertexEdges = vertexEdges.filter((edge) => edge !== vertex.position);

            //If every vertex is removed and is not Hamil Cycle, Give Up
            if (vertexEdges.length === 0){
                // console.error("Ohh... I don't know where to go🤷🏾‍♂️.\n All edges were visited.\n" +
                //     "and it is not a Hamiltonian Cycle/Path. 😭 I give up.");
                // console.error("Bad Path @: ", limit);
                badPaths++;
                return trackPath = tryPath(graph, startAt);
            }
        }

            limit++;
        /* //Choose edge closer to apple
           let closestEdge = findClosestEdge(vertexEdges, appleGridPos);
              if(closestEdge !== -1)
                vertex = cloneObject(graph[closestEdge])
        */
    }
    templog("Hamil Path Found 🥳🙌", trackPath, "@: ",limit, rows * cols);
    return trackPath;
}

// const wasTravellerAt = (vertex, trackPath) => {
//     //check if vertex.visited is a boolean value
//     // if(Object.hasOwn(vertex, "visited") && typeof vertex.visited === "boolean"){
//     //     return vertex.visited;
//     // }
//     return trackPath.includes(vertex.position);
// }

function isObjectEmpty(obj) {
    return Object.keys(obj).length === 0 && (obj.constructor === Object || obj.constructor === Array);
}

function isHamilPath(graph = {position: 0, edges: []}, path = []) {
    if(isObjectEmpty(graph))
        throw new Error("Graph is empty");
    if(path.length < 3)
        return false;

    let endWithEdge = graph[path[0]].edges.includes(path[(path.length - 1)]);
    if(endWithEdge){
        //Check if path has repeated/duplicate vertexes
        for (let i = 1; i < path.length - 1; i++) {
            if (path.slice(i+1).includes(path[i]))
                return false;
        }
        templog("Is Hamil Path. Yaay 🙌");
        return true;
    }
    else
        return false;
}

function isHamilCycle(graph, path) {
    if(isObjectEmpty(graph))
        throw new Error("Graph is empty");
    if(path.length < 3)
        return false;

    let endWithEdge = graph[path[0]].edges.includes(path[(path.length - 1)]);
    let endWithStart = path[0] === path[(path.length - 1)];
    let numVertexes = Object.keys(graph).length;
    if((endWithEdge || endWithStart) && path.length === numVertexes){
        //Check if path has repeated vertexes
        for (let i = 1; i < path.length - 1; i++) {
            if (path.slice(i+1).includes(path[i]))
                return false;
        }
        return true;
    }
    else 
        return false;
}

function bestHamilPath(hamilPaths) {
    let bestPath = [];
    let appleGridPos = canvasPosToGridPos([appleX, appleY]);
    for (let i = 0; i < hamilPaths.length; i++) {
        if(hamilPaths.includes(appleGridPos)){
            console.log("Sire 🙋 there is an apple my path: ", hamilPaths[i]);
            if(hamilPaths[i].length < bestPath.length)
                bestPath = hamilPaths[i];
        }
        else if(hamilPaths[i].length > bestPath.length)
            bestPath = hamilPaths[i];
    }
    return bestPath;
}

function idleSnake(){
    //make snake follow tail in other words previous position in path

}

function cloneObject(obj, classType = Object){
    if(obj == null || typeof(obj) != 'object'){
        return obj;
    }
    let copy = new classType;

    //Handle Date
    if(obj instanceof Date){
        copy = new Date();
        copy.setTime(obj.getTime());
    }

    //Handle Array
    else if(obj instanceof Array){
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
