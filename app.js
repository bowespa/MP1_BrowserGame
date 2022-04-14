var scoreDisplayElem = document.querySelector(".scoreboard");
var hiScoreDisplayElem = document.querySelector(".hi");
var score = 0;
var hiScore = 0;

//keeps high score displayed after new game
if (sessionStorage.getItem("highscore")) {
     hiScore = sessionStorage.getItem("highscore")
} 

hiScoreDisplayElem.innerHTML = hiScore;

//board
var blockSize = 25;
var rows = 20;
var cols = 20;
var board;
var context; 

//snake head
var snakeX = blockSize * 5;
var snakeY = blockSize * 5;

//movement speed of snake
var velocityX = 0;
var velocityY = 0;

var snakeBody = [];

//food
var foodX;
var foodY;

var gameOver = false;

//music and sound effects
const mySound = new Audio("assets/mixkit-player-select-notification-2037.mp3")

const theme = document.getElementById("bgd-music");
theme.volume = 0.8;
theme.loop = true;

function playMusic(){
    theme.play()
}

//when the game first loads
window.onload = function() {
    board = document.getElementById("board");
    board.height = rows * blockSize;
    board.width = cols * blockSize;
    context = board.getContext("2d"); //used for drawing on the board

    placeFood();
    document.addEventListener("keyup", changeDirection);
    document.addEventListener("keyup", playMusic)
    setInterval(update, 1000/10); //100 milliseconds
}

function update() {
    //game over 
    if (gameOver) {
        return;
    }

    //draws board
    context.fillStyle="black";
    context.fillRect(0, 0, board.width, board.height);

    //draws food
    context.fillStyle="red";
    context.fillRect(foodX, foodY, blockSize, blockSize);

    //when snake eats food, food moves and is added to score
    if (snakeX == foodX && snakeY == foodY) {
        snakeBody.push([foodX, foodY]);
        placeFood();
        score++
        scoreDisplayElem.innerHTML = score;
        if (score > hiScore) {
            hiScore = score;
            sessionStorage.setItem("highscore", hiScore);
            hiScoreDisplayElem.innerHTML = sessionStorage.getItem("highscore");
        }
        //sound effect plays when food is eaten
        mySound.play();
    }

    //adding blocks to snake body when food is eaten
    for (let i = snakeBody.length-1; i > 0; i--) {
        snakeBody[i] = snakeBody[i-1];
    }
    if (snakeBody.length) {
        snakeBody[0] = [snakeX, snakeY];
    }

    //draws snake
    context.fillStyle="lime";
    snakeX += velocityX * blockSize;
    snakeY += velocityY * blockSize;
    context.fillRect(snakeX, snakeY, blockSize, blockSize);
    for (let i = 0; i < snakeBody.length; i++) {
        context.fillRect(snakeBody[i][0], snakeBody[i][1], blockSize, blockSize);
    }


    //game over conditions
    //if the snake hits the border of board
    if (snakeX < 0 || snakeX > cols*blockSize || snakeY < 0 || snakeY > rows*blockSize) {
        gameOver = true;
        alert("Game Over");
        scoreDisplayElem.innerHTML = ' 0';
        score = 0;
    }

    //if the snake eats itself
    for (let i = 0; i < snakeBody.length; i++) {
        if (snakeX == snakeBody[i][0] && snakeY == snakeBody[i][1]) {
            gameOver = true;
            alert("Game Over");
            scoreDisplayElem.innerHTML = ' 0';
            score = 0;
        }
    }
}

//key directions to move snake
function changeDirection(e) {
    if (e.code == "ArrowUp" && velocityY != 1) {
        velocityX = 0;
        velocityY = -1;
    }
    else if (e.code == "ArrowDown" && velocityY != -1) {
        velocityX = 0;
        velocityY = 1;
    }
    else if (e.code == "ArrowLeft" && velocityX != 1) {
        velocityX = -1;
        velocityY = 0;
    }
    else if (e.code == "ArrowRight" && velocityX != -1) {
        velocityX = 1;
        velocityY = 0;
    }
}

//randomizes food placement on board
function placeFood() {
    //(0-1) * cols -> (0-19.9999) -> (0-19) * 25
    foodX = Math.floor(Math.random() * cols) * blockSize;
    foodY = Math.floor(Math.random() * rows) * blockSize;
}



