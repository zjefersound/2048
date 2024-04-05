import { BOARD_SIZE, ANIMATION_DURATION } from "./app/constants.mjs";

import Board from "./app/board.mjs";
import BoardView from "./app/boardView.mjs";
import { handleTouchMove, handleTouchStart } from "./app/touchDetector.mjs";

let score = 0;
let highscore = 0;
let myBoard = [];
const lostScreen = document.getElementById("lost-game");

function startGame() {
  score = 0;
  myBoard = Board.getInitialBoard(BOARD_SIZE);
  BoardView.renderBoard(myBoard);
  renderScore();
}

function renderScore() {
  const scoreElement = document.getElementById("score");
  scoreElement.innerText = score;
  const highscoreElement = document.getElementById("highscore");
  highscoreElement.innerText = highscore;
}

function addToScore(value) {
  score += value;
  if (score > highscore) {
    highscore = score;
  }
  if (value > 0) {
    const scoreTextElement = document.getElementById("score-text");
    const numberToAddElement = document.createElement("span");
    numberToAddElement.id = "addNumber";
    numberToAddElement.innerText = "+ " + value;
    scoreTextElement.appendChild(numberToAddElement);
    setTimeout(() => {
      scoreTextElement.removeChild(numberToAddElement);
    }, 300);
  }
  renderScore();
}

function performMove(direction) {
  let scoreToAdd = 0;
  const positionsFrom = Board.getPositionsById(myBoard);
  myBoard = Board.move(myBoard, direction, {
    onMerge: ({ id, value }) => {
      scoreToAdd += value;
    },
  });
  addToScore(scoreToAdd);
  const positionsTo = Board.getPositionsById(myBoard);

  BoardView.renderMovement(positionsFrom, positionsTo);
  setTimeout(() => {
    BoardView.renderBoard(myBoard);
    if (!Board.hasMoves(myBoard)) {
      lostScreen.style.display = "flex";
    }
  }, ANIMATION_DURATION);
}

window.restartGame = () => {
  startGame();
  lostScreen.style.display = "none";
};

startGame(myBoard);

window.addEventListener("keydown", (event) => {
  const isValidKey =
    event.key === "ArrowRight" ||
    event.key === "ArrowLeft" ||
    event.key === "ArrowUp" ||
    event.key === "ArrowDown";

  if (isValidKey) {
    const ARROW_DIRECTIONS = {
      ArrowRight: "right",
      ArrowLeft: "left",
      ArrowUp: "up",
      ArrowDown: "down",
    };
    performMove(ARROW_DIRECTIONS[event.key]);
  }
});

document.addEventListener("touchstart", handleTouchStart, false);
document.addEventListener(
  "touchmove",
  (event) => handleTouchMove(event, { onMove: performMove }),
  false
);
