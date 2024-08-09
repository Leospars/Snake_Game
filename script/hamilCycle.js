let hamilPaths = [];
const lastElement = (arr) => arr[arr.length - 1]
let countChecked = 0;

//Function that finds all possible Hamiltonian Cycles and stores them in hamilPaths
function hamiltonianCycle(graph = new GridGraph(), startAt = 0, blocked = [],
                          snakeBlock = [], appleGridNum, optimize = {graph: false, findApple: false, async: true}) {
    if (!(startAt in graph.V) || !(appleGridNum in graph.V)) {
        console.error("Node not in graph.");
        return [];
    }

    countChecked = 0;
    hamilPaths = [];
    let visited = [startAt];

    (snakeBlock.length !== 0) ?
        //Using Immediately Invoked Function Expression (IIFE) to run async function and await its completion
        (async () => await hamilUtilSnakeOpt({
            graph: graph, path: visited, block: blocked,
            snakeBlock: snakeBlock,
            appleGridNum: appleGridNum,
            optimize: optimize
        }))() :
        hamilUtil(graph, visited, blocked);
    console.log("countChecked: " + countChecked);
    return hamilPaths;
}

async function hamilUtil(graph, path = [0], blocked = []) {
    if (isHamilCycle(graph, path)) {
        hamilPaths.push(path);
        return path;
    }

    if (hamilPaths.length >= 1) return;

    if (path.length > graph.rows * graph.cols + 1) {
        console.log("path exceeded grids")
        return;
    }

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

function isHamilPath(path = []) {
    if (path.length < 4)
        return false;

    let noDuplicates = !containsDuplicates(path.slice(1))
    let endWithStart = path[0] === path[path.length - 1];
    // console.log(noDuplicates + " " + endWithStart + " : " + path[0] + " == "+ path[path.length - 1])
    return (noDuplicates && endWithStart);
}

function isHamilCycle(graph = new GridGraph(), path = []) {
    if (path.length < 4)
        return false;
    return (path[0] === path[path.length - 1]) && graph.rows * graph.cols + 1 === path.length && !containsDuplicates(path.slice(1));
}

function containsDuplicates(path) {
    //Check if array contains any duplicates
    for (let i = 0; i <= path.length - 2; i++) {
        if (path.slice(i + 1).includes(path[i]))
            return true;
    }
    return false;
}