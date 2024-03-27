const TILE_SIZE = window.innerWidth < 800 ? window.innerWidth / 4 - 20 : 120; // px
const TILES_GAP = TILE_SIZE / 10; // px
const STYLE_PER_NUMBER = {
  2: { backgroundColor: "#f8cb77", fontSize: "32px", color: "#FFFFFF" },
  4: { backgroundColor: "#e8b961", fontSize: "32px", color: "#FFFFFF" },
  8: { backgroundColor: "#ff7d40", fontSize: "32px", color: "#FFFFFF" },
  16: { backgroundColor: "#cb5721", fontSize: "32px", color: "#FFFFFF" },
  32: { backgroundColor: "#ce321a", fontSize: "32px", color: "#FFFFFF" },
  64: { backgroundColor: "#a91700", fontSize: "32px", color: "#FFFFFF" },
  128: { backgroundColor: "#920050", fontSize: "30px", color: "#FFFFFF" },
  256: { backgroundColor: "#840092", fontSize: "30px", color: "#FFFFFF" },
  512: { backgroundColor: "#4d1a81", fontSize: "30px", color: "#FFFFFF" },
  1024: { backgroundColor: "#4d1a81", fontSize: "27px", color: "#FFFFFF" },
  2048: { backgroundColor: "#0091ff", fontSize: "27px", color: "#FFFFFF" },
  4096: { backgroundColor: "#008c54", fontSize: "27px", color: "#FFFFFF" },
  8192: { backgroundColor: "#09af00", fontSize: "27px", color: "#FFFFFF" },
  16384: { backgroundColor: "#151515", fontSize: "20px", color: "#FFFFFF" },
};
const BOARD_SIZE = 4;
const ANIMATION_DURATION = 100;

function createBoard(size) {
  const board = Array(size)
    .fill(1)
    .map(() => Array(size).fill(null));
  return board;
}

function generateTileOnBoard(boardToPopulate) {
  const board = boardToPopulate.map((row) => [...row]);
  let row = Math.floor(Math.random() * board.length);
  let column = Math.floor(Math.random() * board[0].length);

  while (board[row][column]) {
    row = Math.floor(Math.random() * board.length);
    column = Math.floor(Math.random() * board[0].length);
  }

  // 10% chance of 4 and 90% chance of 2
  board[row][column] = {
    id: Math.random(),
    number: Math.floor(Math.random() * 10) ? 2 : 4,
  };
  return board;
}

function sortNullsToBeginning(a, b) {
  if (a === null) return -1;
  if (b === null) return 1;
  return 0;
}

function sortNullsToEnd(a, b) {
  if (a === null) return 1;
  if (b === null) return -1;
  return 0;
}

function matrixColumnToArray(matrix, column) {
  const array = [];
  for (let row = 0; row <= matrix.length - 1; row++) {
    array[row] = matrix[row][column];
  }
  return array;
}

function areBoardsEqual(board1, board2) {
  const array1 = board1.reduce((arr, row) => [...arr, ...row], []);
  const array2 = board2.reduce((arr, row) => [...arr, ...row], []);
  return JSON.stringify(array1) === JSON.stringify(array2);
}

function mergeItems({ items: itemsToMerge, start, end, increment }) {
  const items = [...itemsToMerge];
  for (let column = start; column !== end; column += increment) {
    const indexToMerge = column + increment;
    if (
      items[indexToMerge] &&
      items[indexToMerge]?.number === items[column]?.number
    ) {
      items[column].number += items[indexToMerge].number;
      items[column].id = items[indexToMerge].id;

      if (items[column].number === 2048) {
        document.getElementById("win").className = "win";
      }

      items[indexToMerge] = null;
    }
  }
  return items;
}

function mergeAndSortItems({
  items: itemsToMerge,
  start,
  end,
  increment,
  sortMethod,
}) {
  items = [...itemsToMerge];
  items = items.sort(sortMethod);
  items = mergeItems({ items, start, end, increment });
  items = items.sort(sortMethod);
  return items;
}

function getMoveParams(length, direction) {
  const to = {
    up: "toStart", // <----
    left: "toStart", // <----
    down: "toEnd", // ---->
    right: "toEnd", // ---->
  };
  const lastIndex = length - 1;
  const start = to[direction] === "toEnd" ? lastIndex : 0;
  const end = to[direction] === "toEnd" ? 0 : lastIndex;
  const increment = to[direction] === "toEnd" ? -1 : 1;
  const sortMethod =
    to[direction] === "toEnd" ? sortNullsToBeginning : sortNullsToEnd;
  return { start, end, increment, sortMethod };
}

function move(board, direction) {
  let newBoard = board.map((row) => [...row]);
  const moveParams = getMoveParams(myBoard[0].length, direction);

  if (direction === "up" || direction === "down") {
    for (let column = 0; column < newBoard[0].length; column++) {
      let items = matrixColumnToArray(newBoard, column);
      items = mergeAndSortItems({ items, ...moveParams });
      for (let row = 0; row <= items.length - 1; row++) {
        newBoard[row][column] = items[row];
      }
    }
  }
  if (direction === "left" || direction === "right") {
    for (let row = 0; row < newBoard[0].length; row++) {
      newBoard[row] = mergeAndSortItems({
        items: newBoard[row],
        ...moveParams,
      });
    }
  }

  if (!areBoardsEqual(board, newBoard)) {
    newBoard = generateTileOnBoard(newBoard);
  }
  return newBoard;
}
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

function getPositionsById(board) {
  return board.reduce((obj, row, rowIndex) => {
    row.forEach((column, columnIndex) => {
      if (column?.id) {
        obj[column.id] = [rowIndex, columnIndex];
      }
    });
    return obj;
  }, {});
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

function hasMoves(boardToVerify) {
  const board = boardToVerify.map((row) => [...row]);
  let hasMoves = false;
  for (let row = 0; row < board.length; row++) {
    for (let column = 0; column < board.length; column++) {
      if (!board[row][column]) {
        hasMoves = true;
        break;
      }
    }
  }
  if (hasMoves) return hasMoves;
  for (let row = 0; row < board.length; row++) {
    for (let column = 0; column < board[0].length; column++) {
      if (
        board[row][column].number === board[row - 1]?.[column]?.number ||
        board[row][column].number === board[row][column - 1]?.number ||
        board[row][column].number === board[row + 1]?.[column]?.number ||
        board[row][column].number === board[row][column + 1]?.number
      ) {
        hasMoves = true;
        break;
      }
      console.log("****", row, column, board[row][column], hasMoves);
    }
  }
  return hasMoves;
}

let myBoard = createBoard(BOARD_SIZE);

function restartGame() {
  startGame(myBoard);
  const lostScreen = document.getElementById("lost-game");
  lostScreen.style.display = "none";
}

function startGame(myBoard) {
  myBoard = createBoard(BOARD_SIZE);

  // Populate
  myBoard = generateTileOnBoard(myBoard);
  myBoard = generateTileOnBoard(myBoard);
  renderBoard(myBoard);

  window.addEventListener("keydown", (event) => {
    const lostScreen = document.getElementById("lost-game");
    if (!hasMoves(myBoard)) {
      lostScreen.style.display = "flex";
      return;
    }

    if (
      event.key === "ArrowRight" ||
      event.key === "ArrowLeft" ||
      event.key === "ArrowUp" ||
      event.key === "ArrowDown"
    ) {
      const positionsFrom = getPositionsById(myBoard);

      if (event.key === "ArrowRight") {
        myBoard = move(myBoard, "right");
      }
      if (event.key === "ArrowLeft") {
        myBoard = move(myBoard, "left");
      }
      if (event.key === "ArrowUp") {
        myBoard = move(myBoard, "up");
      }
      if (event.key === "ArrowDown") {
        myBoard = move(myBoard, "down");
      }

      const positionsTo = getPositionsById(myBoard);
      renderMovement(positionsFrom, positionsTo);
      setTimeout(() => {
        renderBoard(myBoard);
      }, ANIMATION_DURATION);
    }
  });
}

startGame(myBoard);
