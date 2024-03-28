import { BOARD_SIZE, ANIMATION_DURATION } from "./app/constants.mjs";

import Board from "./app/board.mjs";
import BoardView from "./app/boardView.mjs";
import { handleTouchMove, handleTouchStart } from "./app/touchDetector.mjs";

let myBoard = [];
const lostScreen = document.getElementById("lost-game");

function startGame() {
  myBoard = Board.getInitialBoard(BOARD_SIZE);
  BoardView.renderBoard(myBoard);
}

function performMove(direction) {
  const positionsFrom = Board.getPositionsById(myBoard);
  myBoard = Board.move(myBoard, direction);
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
