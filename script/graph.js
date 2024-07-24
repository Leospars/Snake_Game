class Vertex {
    location = 0;
    edges = [];

    constructor(v, edge) {
        this.location = v;
        this.edges = edge;
    }
}

class Graph {
    V = {};

    constructor(Vs = [new Vertex()]) {
        Vs.forEach(v => {
            this.V[v.location] = v;
        });
    }
}

class GridGraph extends Graph {
    rows = 0;
    cols = 0;
    size = [];

    constructor(_rows = rows, _cols = cols, _grid = gridSize) {
        super();
        this.rows = _rows;
        this.cols = _cols;
        this.gridSize = _grid;
        this.size = [this.rows, this.cols];

        let V = {};
        for (let i = 0; i < _rows; i++) {
            for (let j = 0; j < _cols; j++) {
                let v = j + i * _cols;
                let edge = [];
                if (v % _cols !== 0) edge.push(v - 1); //if not left border add left edge
                if (v % _cols < _cols - 1) edge.push(v + 1); //if not right border add right edge
                if (v >= _cols) edge.push(v - _cols); //top border
                if (v < _rows * _cols - _cols) edge.push(v + _cols); //bottom border
                V[v] = new Vertex(v, edge);
            }
        }
        this.V = V;
    }

    /** @info: Implement A* Search Algorithm
     * @param {number} startAt - The starting node.
     * @param {number} search - The node to search for.
     * @param {Array} block - The nodes to avoid.
     * @returns {Array} - The shortest path to the search node.
     * @TODO: Properly implement a condition to find if it is not possible to find a path
     *       to prevent stack overflow from recursion and return error/empty array.
     *       Consider adding distance as a function for different types of graphs
     *       or not and just create child classes with overrides.
     */

    aStarSearch(startAt, search, block = []) {
        let path = [];
        let blockedNodes = block.flat(); //Allow blocks to be thread safe
        const aStarSearchUtil = (startAt, search, blocks) => {
            let shortestDist = Number.MAX_VALUE; //Allows for shortestDist to be first distance
            let closestNode = -1;

            //Check if startAt and search are nodes in the graph
            if (!(startAt in this.V) || !(search in this.V)) {
                throw new Error("Node not in graph.");
                return [];
            }

            if (path.length === this.rows * this.cols) {
                throw new Error("Every vertex has been visited. Cannot find path.");
                return [];
            }  //Prevent stack overflow from recursion


            if (path.length === 0) {
                path.push(startAt);
            }

            if (startAt === search) return path;

            for (let node of this.V[startAt].edges) {
                if (blocks.includes(node)) {
                    // if (!(node === startAt))
                        // console.log(startAt + " Node: ", node, " is blocked.");
                    continue;
                }

                let distance = this.distBetweenNodes(search, node);
                // console.log("Node: ", node, " Distance: ", distance, " Shortest Distance: ", shortestDist);
                if (distance < shortestDist) {
                    shortestDist = distance;
                    closestNode = node;
                }
            }

            if (closestNode === -1) {
                console.error("Cannot move to node, currently enclosed.", path);
                return [];
            }

            path.push(closestNode);

            //Update blocks/snakeBody only for SnakeGame
            blocks.unshift(startAt);
            blocks.pop();

            return aStarSearchUtil(closestNode, search, blocks);
        }

        return aStarSearchUtil(startAt, search, blockedNodes);
    }

    distBetweenNodes(a, b) {
        const gridNumToPoint = (gridNumber) => {
            let xPos = (gridNumber % this.cols) * this.gridSize;
            let yPos = Math.floor(gridNumber / this.cols) * this.gridSize;/* console.log("Node: ", gridNumber, " X: ", xPos, " Y: ", yPos) */
            return new Point(xPos, yPos);
        }

        let pointA = gridNumToPoint(a);
        let pointB = gridNumToPoint(b);
        return pointA.dist(pointB);
    }

    coordToGridNum(coord2D = [0, 0], _cols = this.cols, gridSz = this.gridSize) {
        let row = Math.floor(coord2D[0] / gridSz);
        let column = Math.floor(coord2D[1] / gridSz);

        let gridNum = column * _cols + row;
        return gridNum;
    }
}

class Point {
    x = 0;
    y = 0;

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    dist(p) {
        return Math.sqrt((this.x - p.x) ** 2 + (this.y - p.y) ** 2);
    }

    /// @deprecated
    toCoord = () => [this.x, this.y];
}