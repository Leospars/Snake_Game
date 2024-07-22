/// @param snakeBlock - A block that dynamically moves along the path to simulate the snake's body

let bestPath = [];

async function hamilUtilSnakeOpt(
    {
        graph = new GridGraph(3, 3),
        path = [0],
        block = [],
        snakeBlock = [],
        appleGridNum = -1,
        optimize = {graph: true, findApple: true, async: true}
    }
) {
    //on first run
    if (path.length === 1 && optimize.graph) {
        if (appleGridNum !== -1)
            graph = optimizeGraph(graph, snakeBlock, appleGridNum);
        console.log("Optimized Graph Size: " + graph.size);
        pathWapple = 0;
        bestPath = [];
    }

    //Ensures the function in for loops end if the resulting path will be longer than the shortest path with the apple
    if (optimize.findApple && bestPath.length !== 0 && path.length > bestPath.length) return;

    if (isHamilCycle(path)) {
        hamilPaths.push(path);
        if (optimize.findApple && path.includes(appleGridNum)) {
            pathWapple++;

            if (bestPath.length === 0) {
                bestPath = path
                // console.log("First bestPath: ", bestPath);
            }

            if (path.length < bestPath.length) {
                bestPath = path;
                // console.log("Change bestPath: ", bestPath);
            }
        }
        return;
    }

    const prevLoc = (path.length >= 2) ? path[path.length - 2] : null;
    const node = graph.V[lastElement(path)];

    for (let edge of node.edges) {
        if (edge === prevLoc) continue;

        //remove last element without changing snakeBlock for virtual snake to move
        let newSnakeBlock = snakeBlock.slice(0, -1);
        if (!path.slice(1).includes(edge) && !block.includes(edge) && !newSnakeBlock.includes(edge)) {
            // console.log("node: " + node.location +  " -> edge: " + edge + "-> path: " + path)
            let newPath = [...path, edge];

            //MOVE SNAKE
            newSnakeBlock.unshift(node.location); //Move virtual snake forward after "popping" snakeBlock earlier

            countChecked++;
            (optimize.async) ? hamilUtilSnakeOpt({
                    graph: graph,
                    path: newPath,
                    block: block,
                    snakeBlock: newSnakeBlock,
                    appleGridNum: appleGridNum,
                    optimize: optimize
                }) :
                await hamilUtilSnakeOpt({
                    graph: graph,
                    path: newPath,
                    block: block,
                    snakeBlock: newSnakeBlock,
                    appleGridNum: appleGridNum,
                    optimize: optimize
                })
            ;
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