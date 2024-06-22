
//Write funciton to implement Hamiltonian Cycle
function hamiltonianCycle(graph = new Graph(), startAt = 0) {
    //Check if startAt and search are in the graph
    if(!(startAt in graph.V)){
        new Error("Node not in graph.");
        return [];
    }

    let visited = [startAt];
    hamilPaths = [];
    recur= 0;
    console.group("Visited Nodes");
    hamilUtil(graph, startAt, visited);
    console.groupEnd();
    return hamilPaths;
}


let hamilPaths = [];
//Prevent stack overflow from recursion
let recurLimit = 1000;
let hamilLimit= 300;
let recur= 0;

//This functions job is to place hamilCycles into hamilPaths a
function hamilUtil(graph, node = 0, visited = [], justBeenThere = -1) {
    let visitedNodes = [...visited] //Allow visited to be unique and thread safe for each recursion

    if(isHamilCycle(graph, visitedNodes)) {
        hamilPaths.push(visitedNodes);
        console.log("Hamiltonian Cycle found: ", visitedNodes);
        return;
    }

    if(visitedNodes.length > graph.V.length) {
        console.error("Every vertex has been visited. Cannot find path.");
        console.log("Visited Nodes: ", visitedNodes);
        //Backtrack to find other paths.
        // Recall that the last node in visitedNodes is the current node being visited so remove it
        hamilUtil(graph, visitedNodes[visitedNodes.length - 2], visitedNodes.slice(0, -1), node);
    }

    if(hamilPaths.length >= hamilLimit) {
        console.log("Hamiltonian Paths is full. Stopping now.");
        return;
    }

    if(recur >= recurLimit) {
        console.error("Recursion recurLimit reached. Cannot find path.");
        return;
    }

    let paths = [];
    for (let testNode of graph.V[node].edges) {
        if(!visitedNodes.includes(testNode)) {
            if(justBeenThere === testNode) {
                console.log("Backtracked from ", justBeenThere, " to try ", testNode, " at node ", node);
                continue;
            }
            recur++;
            hamilUtil(graph, testNode, [...visitedNodes, testNode]);
        }
    }
}