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
  board[row][column] = Math.floor(Math.random() * 10) ? 2 : 4;
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
    if (items[indexToMerge] && items[indexToMerge] === items[column]) {
      items[column] += items[indexToMerge];
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

function renderBoard(board) {
  const boardElement = document.getElementById("board");
  boardElement.innerHTML = "";
  console.log(board, boardElement);
  board.forEach((row) => {
    row.forEach((column) => {
      const divElement = document.createElement("div");
      const tileElement = document.createElement("span");
			if(column) {
				tileElement.style.backgroundColor = 'rgb(197, 159, 102)';
				tileElement.style.color = '#FFF';

			}
      tileElement.innerText = column || "";
      divElement.appendChild(tileElement);
      boardElement.appendChild(divElement);
    });
  });
}

let myBoard = createBoard(4);

function startGame(myBoard) {
  // Populate
  myBoard = generateTileOnBoard(myBoard);
  myBoard = generateTileOnBoard(myBoard);

  renderBoard(myBoard);

  window.addEventListener("keydown", (event) => {
    if (
      event.key === "ArrowRight" ||
      event.key === "ArrowLeft" ||
      event.key === "ArrowUp" ||
      event.key === "ArrowDown"
    ) {
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
      renderBoard(myBoard);
      console.table(myBoard);
    }
  });
}

startGame(myBoard);
