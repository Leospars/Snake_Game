let hamilPaths = [];
const lastElement = (arr) => arr[arr.length - 1]
let countChecked = 0;

//Function that finds all possible Hamiltonian Cycles and stores them in hamilPaths
async function hamiltonianCycle(graph = new GridGraph(), startAt = 0, blocked = [], snakeGame =
    {snakeBlock: [], appleGridNum: -1, optimize: {graph: true, findApple: true, async: true}}) {

    if (!(startAt in graph.V) || !(snakeGame.appleGridNum in graph.V)) {
        throw new Error("Node not in graph.");
        return [];
    }

    countChecked = 0;
    hamilPaths = [];
    let visited = [startAt];

    console.group("HamilUtil Run");
    console.time("hamilCycle");
    (snakeGame.snakeBlock.length !== 0) ?
        await hamilUtilSnakeOpt({
            graph: graph, path: visited, block: blocked,
            snakeBlock: snakeGame.snakeBlock,
            appleGridNum: snakeGame.appleGridNum,
            optimize: snakeGame.optimize
        }) :
        hamilUtil(graph, visited, blocked);
    console.log("countChecked: " + countChecked);
    console.timeEnd("hamilCycle")

    console.time("Cull Paths")
    console.log("bestPath: ", evalBestHamilPath(hamilPaths, snakeGame.appleGridNum));
    console.timeEnd("Cull Paths")
    console.groupEnd();
    return hamilPaths;
}

function hamilUtil(graph, path = [0], blocked = []) {
    if (isHamilCycle(path)) {
        hamilPaths.push(path);
        // console.log("Found Hamil Yayy: ", path)
        return;
    }

    if (path.length > graph.rows * graph.cols + 1)
        return;

    const startLoc = path[0];
    const prevLoc = (path.length >= 2) ? path[path.length - 2] : null;
    const node = graph.V[lastElement(path)];

    for (let edge of node.edges) {
        if (edge === prevLoc) continue;
        if (!path.slice(1).includes(edge) && !blocked.includes(edge)) {
            // console.log("node: " + node.location +  " -> edge: " + edge + "-> path: " + path)
            let newPath = [...path, edge];
            countChecked++;
            hamilUtil(graph, newPath, blocked);
        }
    }
}

function isHamilCycle(path = []) {
    if (path.length < 4)
        return false;

    let noDuplicates = containsDuplicates(path.slice(1))
    let endWithStart = path[0] === path[path.length - 1];
    // console.log(noDuplicates + " " + endWithStart + " : " + path[0] + " == "+ path[path.length - 1])
    return (noDuplicates && endWithStart);
}

function containsDuplicates(path) {
    //Check if array contains any duplicates
    for (let i = 0; i <= path.length - 2; i++) {
        if (path.slice(i + 1).includes(path[i]))
            return false;
    }
    return true;
}