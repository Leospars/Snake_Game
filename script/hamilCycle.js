import {GridGraph} from "./graph.js";

//Write funciton to implement Hamiltonian Cycle
let hamilPaths = [];

function hamiltonianCycle(graph = new GridGraph(), startAt = 0, blocked = []) {
    //Check if startAt and search are in the graph
    if(!(startAt in graph.V)){
        new Error("Node not in graph.");
        return [];
    }

    hamilPaths = [];
    let visited = [startAt];

    console.group("Visited Nodes");
    hamilUtil(graph, visited, blocked);
    console.groupEnd();
    console.log("countChecked: " + countChecked);
    return hamilPaths;
}

const lastElement = (arr) => arr[arr.length - 1]
let countChecked = 0;

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
        // console.log("node: " + node.location +  " -> edge: " + edge + "-> path: " + path)
        if (!path.slice(1).includes(edge) && !blocked.includes(edge)) {
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