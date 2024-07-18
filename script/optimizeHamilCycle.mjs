/// @param snakeBlock - A block that dynamically moves along the path to simulate the snake's body
var log = {
    el: document.getElementById("log"),
    d: (str) => {
        log.el.innerHTML += (str)
    }
};

let bestPath = [];

function hamilUtilSnake(graph, path = [0], block = [], snakeBlock = [], appleGridNum = -1) {
    //on first run
    if (path.length === 1) {
        if (appleGridNum !== -1)
            graph = optimizeGraph(graph, snakeBlock, appleGridNum);
        console.log("Graph: ", graph);
        log.d("<br>Loading. ");
        pathWapple = 0;
    }

    if (countChecked % 10000 === 0) {
        log.d(". ");
    }

    if (isHamilCycle(path)) {
        hamilPaths.push(path);
        return;
    }

    if (path.length > graph.rows * graph.cols + 1)
        return;

    const startLoc = path[0];
    const prevLoc = (path.length >= 2) ? path[path.length - 2] : null;
    const node = graph.V[lastElement(path)];

    for (let edge of node.edges) {
        if (edge === prevLoc) continue;

        if (!path.slice(1).includes(edge) && !block.includes(edge) && !snakeBlock.includes(edge)) {
            // console.log("node: " + node.location +  " -> edge: " + edge + "-> path: " + path)
            let newPath = [...path, edge];

            //MOVE SNAKE
            let newSnakeBlock = snakeBlock.slice(0, -1); //pop without changing snakeBlock
            newSnakeBlock.unshift(node.location); //Move snake foward

            countChecked++;
            hamilUtilSnake(graph, newPath, block, newSnakeBlock);
        }
    }
}

function optimizeGraph(graph, snakeBlock, appleGridNum) {
    let furthest_row = 0,
        furthest_col = 0;

    // Grid rows and cols is numbered based on non-starting zero while nodes are; so we add 1
    let apple_row = Math.floor(appleGridNum / graph.cols) + 1,
        apple_col = (appleGridNum % graph.cols) + 1;

    snakeBlock.forEach(
        (node) => {
            let row = Math.floor(node / graph.cols) + 1;
            let col = (node % graph.cols) + 1;
            furthest_row = Math.max(furthest_row, row);
            furthest_col = Math.max(furthest_col, col);
        }
    )

    if (furthest_row < graph.rows)
        (furthest_row < apple_row) ? furthest_row = apple_row : furthest_row += 1;
    if (furthest_col < graph.rows)
        (furthest_col < apple_col) ? furthest_col = apple_col : furthest_col += 1;
    return new GridGraph(furthest_row, furthest_col);
}

