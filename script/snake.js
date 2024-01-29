export class Snake{
    xPos; 
    yPos;
    xVel = 0;
    yVel = 0;
    head = [0,0];
    body = [];
    
    initialPosition(){
        this.xPos = rand(3,cols/4) * gridSize;
        this.yPos = rand(0,rows/4) * gridSize;
        this.xPos = this.yPos = gridSize*3;
        this.head = [this.xPos,this.yPos]; 
        // this.body = [[this.xPos-gridSize, this.yPos], [this.xPos-gridSize*2, this.yPos], [this.xPos-gridSize*3, this.yPos]];
    }

    velocity (horizontal = 0, vertical = 0){
        this.xVel = horizontal;
        this.yVel = vertical;
    }

    possibleMovements(snakePosition = snake.head){
        this.right = [snake.head[0]+gridSize, snake.head[1]];
        this.left = [snake.head[0]-gridSize, snake.head[1]];
        this.up = [snake.head[0], snake.head[1]-gridSize];
        this.down = [snake.head[0], snake.head[1]+gridSize];
    }
    
    updateSnake(){
        let snakeIsMoving = !(snake.xVel == 0 && snake.yVel == 0);
        if(snakeIsMoving){
            //Update Snake Body
            snake.body.unshift([snake.xPos, snake.yPos]);
            snake.body.pop();

            //Update Snake Head
            [snake.xPos, snake.yPos] = [snake.xPos + snake.xVel * gridSize, snake.yPos + snake.yVel * gridSize];
            snake.head = [snake.xPos, snake.yPos];
        }
    }
}
