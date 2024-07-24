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
        pathsTried++;
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

/** Optimize the graph by creating a graph that encapsulates the snakes body, the apple and an extra column
 * to allow the snake to unravel if it fills the graph overall reducing the number of nodes to search
 * TODO: Revaluate graph optimization by starting from furthest left node instead of from [0,0] to furthest
 *       this would use the right offset for the {@link: translateNode} function
 */
function optimizeGraph(graph, snakeBlock, appleGridNum) {
    let furthestRightRow = 0,
        furthestRightCol = 0;

    // Grid rows and cols are numbered starting at 1 while nodes start at 0; so we add 1
    let apple_row = Math.floor(appleGridNum / graph.cols) + 1,
        apple_col = (appleGridNum % graph.cols) + 1;

    snakeBlock.forEach(
        (node) => {
            let row = Math.floor(node / graph.cols) + 1;
            let col = (node % graph.cols) + 1;
            furthestRightRow = Math.max(furthestRightRow, row);
            furthestRightCol = Math.max(furthestRightCol, col);
        }
    )

    if (furthestRightRow < graph.rows)
        (furthestRightRow < apple_row) ? furthestRightRow = apple_row : furthestRightRow += 1;
    if (furthestRightCol < graph.rows)
        (furthestRightCol < apple_col) ? furthestRightCol = apple_col : furthestRightCol += 1;
    return new GridGraph(furthestRightRow, furthestRightCol);
}