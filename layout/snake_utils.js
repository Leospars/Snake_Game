//Customize user interface elements with js

class Button {
    idName;
    id = null;

    //Add button to UI if it doesn't exist
    constructor(id) {
        this.id = document.getElementById(id);
        this.idName = id;
        if (this.id === null) {
            let newButton = document.createElement("button");
            let ui_Buttons = document.getElementById("ui_buttons");
            ui_Buttons.appendChild(newButton);
            newButton.innerHTML = id;
            newButton.id = id;
            this.id = newButton;
        }
    }

    click(func) {
        this.id.addEventListener("click", func);
    }
}

let showing_gridlines = false;

function showGrid(show) {
    if (!show) {
        gridContext.clearRect(0, 0, field.width, field.height);
        return;
    }

    gridContext.strokeStyle = "grey";
    for (let i = 0; i < field.height; i++) {
        gridContext.moveTo(0, gridSize * i);
        gridContext.lineTo(field.width, gridSize * i);
        // gridContext.stroke();
    }
    for (let i = 0; i < field.width; i++) {
        gridContext.moveTo(gridSize * i, 0);
        gridContext.lineTo(gridSize * i, field.height);
        gridContext.stroke();
    }
}

let setButtonEvents = function () {
    //Button Listeners
    let restartButton = new Button("restart");
    restartButton.click(restart);

    let pauseButton = new Button("pause_play");
    pauseButton.click(pause_play);

    //AI buttons
    new Button("ai_pref_dir").click(function () {
        if (run_AI_Find_Path) run_AI_Find_Path = !run_AI_Find_Path;
        run_AI_Pref_Dir = !run_AI_Pref_Dir;
        console.log("AI_Pref_Dir: ", run_AI_Pref_Dir);
    });

    new Button("run_ai").click(function () {
        if (run_AI_Pref_Dir) run_AI_Pref_Dir = !run_AI_Pref_Dir;
        run_AI_Find_Path = !run_AI_Find_Path;
        console.log("AI_Find_Path: ", run_AI_Find_Path, " Algo: ", (run_Hamil_Algo) ? "Hamil Cycle" : "A*");
    });

    new Button("toggleAI").click(() => {
        run_Hamil_Algo = !run_Hamil_Algo;
        console.log("AI Algo: ", (run_Hamil_Algo) ? "Hamil Cycle" : "A*");
    });

    let gridlineButton = new Button("gridlines");
    gridlineButton.click(() => {
        (!showing_gridlines) ? showGrid(true) : showGrid(false);
        showing_gridlines = !showing_gridlines
    });

    let speedButton = new Button("boost");
    speedButton.id.addEventListener("mousedown", speedUp);

    //Create Button 1x
    let speed1x = new Button("speed1x");
    speed1x.id.innerHTML = "1x";

    //Make Button 1x return snake to initial speed
    speed1x.click(() => {
        changeFrameRate(() => frameRate = initialFrameRate);
    });

    //Create Button 10x
    let speed10x = new Button("speed10x");
    speed10x.innerHTML = "10x";

    //Make Button 10x speed up snake 10x and cap at 5ms
    speed10x.click(() => {
        changeFrameRate(x10 = () => frameRate /= 10);
    });

    //Create Super speed Button
    let superSpeedButton = new Button("superSpeed");
    superSpeedButton.click(function () {
        isSuperSpeedOn = !isSuperSpeedOn;
        console.log("Super Speed: ", isSuperSpeedOn);
    });
}

function changeFrameRate(changeFunc) {
    isSuperSpeedOn = false;
    changeFunc();
    refreshAnimation();
    console.log("frameRate: ", frameRate, "ms");
}

let isSuperSpeedOn = false;

function speedUp() {
    isSuperSpeedOn = false;
    let intervalID = setInterval(function () {
        frameRate = Math.max(frameRate * .65, 0.01);
        console.log("frRate: ", frameRate, "ms");
        refreshAnimation();
    }, 100);

    speedButton.id.addEventListener("mouseup", function () {
        clearInterval(intervalID);
    });
}

let storedVelocity;

function pause_play() {
    if (paused) {
        console.log("Game continued.");
        snake.velocity(storedVelocity[0], storedVelocity[1])
        document.getElementById("pause_play").innerHTML = "⏸️";
        paused = false;
    } else {
        storedVelocity = [snake.xVel, snake.yVel];
        snake.velocity(0, 0);
        console.log("Paused");
        document.getElementById("pause_play").innerHTML = "▶️";
        paused = true;
    }

    // var field = document.getElementById("field");
    // field.setAttribute()
}

function restart() {
    document.getElementById("GameOver").innerHTML = "";
    document.getElementById("score").innerHTML = "0";
    field.classList.remove("hidden");
    snake.velocity(0, 0);

    //Reset Global Variables
    gameOver = false;
    paused = false;
    score = 0;
    frame = 0;
    frameRate = initialFrameRate; //fps
    snakeTrack = [];
    restart_AI_variables();

    //Initialize Canvas
    snake.initializePosition();
    placeApple();
    window.blur();
    document.getElementById("restart").blur();
    /*  document.getElementById("alert").innerHTML = "Progress will not be saved.\nWould you still like to restart?";
    yes = document.createElement("a");
    yes.innerHTML = "Yes";
    yes.setAttribute("href", "javascript:window.location.reload();");
    // yes.setAttribute("class", "no");
    document.getElementById("alert").appendChild(yes);
    no = document.createElement("p");
    no.innerHTML = "No";
    document.getElementById("alert").appendChild(no);
*/
}