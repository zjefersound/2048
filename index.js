import { BOARD_SIZE, ANIMATION_DURATION } from "./app/constants.mjs";

import Board from "./app/board.mjs";
import BoardView from "./app/boardView.mjs";

let myBoard = [];
const lostScreen = document.getElementById("lost-game");

function startGame() {
  myBoard = Board.getInitialBoard(BOARD_SIZE);
  BoardView.renderBoard(myBoard);
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
    const positionsFrom = Board.getPositionsById(myBoard);

    if (event.key === "ArrowRight") {
      myBoard = Board.move(myBoard, "right");
    }
    if (event.key === "ArrowLeft") {
      myBoard = Board.move(myBoard, "left");
    }
    if (event.key === "ArrowUp") {
      myBoard = Board.move(myBoard, "up");
    }
    if (event.key === "ArrowDown") {
      myBoard = Board.move(myBoard, "down");
    }

    const positionsTo = Board.getPositionsById(myBoard);
    BoardView.renderMovement(positionsFrom, positionsTo);
    setTimeout(() => {
      BoardView.renderBoard(myBoard);
      if (!Board.hasMoves(myBoard)) {
        lostScreen.style.display = "flex";
      }
    }, ANIMATION_DURATION);
  }
});
