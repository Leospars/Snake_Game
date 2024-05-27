// import { field_params } from "./snake_solid.js";
// const {gridSize, cols, rows} = field_params;

class Snake {
    xPos; 
    yPos;
    xVel = 0;
    yVel = 0;
    head = [0,0];
    body = [];

    //constructor for getting gridsize, rows and columns of field
    initializePosition(pos = [-1, -1]) {
        if(pos[0] === -1 || pos[1] === -1) {
            this.xPos = rand(3, cols / 4) * gridSize;
            this.yPos = rand(0, rows / 4) * gridSize;
        } else {
            this.xPos = pos[0];
            this.yPos = pos[1];
        }
        this.head = [this.xPos, this.yPos];
        this.body = [[this.xPos - gridSize, this.yPos], [this.xPos - gridSize * 2, this.yPos], [this.xPos - gridSize * 3, this.yPos]];
    }

    velocity (horizontal = 0, vertical = 0){
        this.xVel = horizontal;
        this.yVel = vertical;
    }

    //Generate snake possible movements from current location, initializing this.right, this.left, this.up, this.down
    possibleMovements(snakePosition = this.head) {
        this.right = [snakePosition[0] + gridSize, snakePosition[1]];
        this.left = [snakePosition[0] - gridSize, snakePosition[1]];
        this.up = [snakePosition[0], snakePosition[1] - gridSize];
        this.down = [snakePosition[0], snakePosition[1] + gridSize];
    }

    update() {
        let snakeIsMoving = !(this.xVel == 0 && this.yVel == 0);
        if (snakeIsMoving) {
            //Update Snake Body
            this.body.unshift([this.xPos, this.yPos]);
            this.body.pop();

            //Update Snake Head
            [this.xPos, this.yPos] = [this.xPos + this.xVel * gridSize, this.yPos + this.yVel * gridSize];
            this.head = [this.xPos, this.yPos];
        }
    }
}

function rand(smallest, largest) {
    return Math.floor(Math.random() * (largest + 1 - smallest) + smallest);
}
