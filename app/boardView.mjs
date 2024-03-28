import {
  STYLE_PER_NUMBER,
  ANIMATION_DURATION,
  TILE_SIZE,
  TILES_GAP,
} from "./constants.mjs";

function getOffset(index) {
  return TILES_GAP + index * (TILE_SIZE + TILES_GAP);
}

function renderBoard(board) {
  const boardElement = document.getElementById("board");
  boardElement.style.gridTemplateColumns = `repeat(${board.length},1fr)`;
  boardElement.style.gap = `${TILES_GAP}px`;
  boardElement.style.padding = `${TILES_GAP}px`;
  boardElement.style.width = `${
    board.length * (TILE_SIZE + TILES_GAP) + TILES_GAP
  }px`;

  boardElement.innerHTML = "";

  board.forEach((row, rowIndex) => {
    row.forEach((column, columnIndex) => {
      const divElement = document.createElement("div");
      divElement.style.height = `${TILE_SIZE}px`;
      divElement.style.width = `${TILE_SIZE}px`;
      const tileElement = document.createElement("span");
      if (column?.number) {
        tileElement.id = column.id;
        tileElement.style.height = `${TILE_SIZE}px`;
        tileElement.style.width = `${TILE_SIZE}px`;

        tileElement.style.background =
          STYLE_PER_NUMBER[column.number].backgroundColor;
        tileElement.style.color = STYLE_PER_NUMBER[column.number].color;
        tileElement.style.fontSize = STYLE_PER_NUMBER[column.number].fontSize;
        tileElement.style.position = `absolute`;
        tileElement.style.top = `${getOffset(rowIndex)}px`;
        tileElement.style.left = `${getOffset(columnIndex)}px`;
        tileElement.style.animationDuration = `${ANIMATION_DURATION}ms`;
      }
      tileElement.innerText = column?.number || "";
      divElement.appendChild(tileElement);
      boardElement.appendChild(divElement);
    });
  });
}

function renderMovement(positionsFrom, positionsTo) {
  Object.entries(positionsFrom).forEach(([key, positionFrom]) => {
    if (positionsTo[key]) {
      const elementToAnimate = document.getElementById(key);
      if (elementToAnimate) {
        if (
          positionsTo[key][0] !== positionFrom[0] ||
          positionsTo[key][1] !== positionFrom[1]
        ) {
          elementToAnimate.style.scale = "1.1";
        }
        elementToAnimate.style.top = `${getOffset(positionsTo[key][0])}px`;
        elementToAnimate.style.left = `${getOffset(positionsTo[key][1])}px`;
      }
    }
  });
}

export default {
  renderBoard,
	renderMovement,
};
