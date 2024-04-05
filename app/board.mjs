import {
  sortNullsToBeginning,
  sortNullsToEnd,
  matrixColumnToArray,
  areMatrixesEqual,
} from "./helpers.mjs";

// start
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

function getInitialBoard(size) {
  let newBoard = createBoard(size).map((column) => [...column]);

  // Populate
  newBoard = generateTileOnBoard(newBoard);
  newBoard = generateTileOnBoard(newBoard);
  return newBoard;
}

// move tiles
function mergeItems({ items: itemsToMerge, start, end, increment, onMerge }) {
  const items = [...itemsToMerge];
  for (let column = start; column !== end; column += increment) {
    const indexToMerge = column + increment;
    if (
      items[indexToMerge] &&
      items[indexToMerge]?.number === items[column]?.number
    ) {
      items[column].number += items[indexToMerge].number;
      items[column].id = items[indexToMerge].id;
      onMerge({
        id: items[column].id,
        value: items[column].number
      })
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
  onMerge,
  start,
  end,
  increment,
  sortMethod,
}) {
  let items = [...itemsToMerge];
  items = items.sort(sortMethod);
  items = mergeItems({ items, start, end, increment, onMerge });
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

function move(board, direction, { onMerge }) {
  let newBoard = board.map((row) => [...row]);
  const moveParams = getMoveParams(board[0].length, direction);

  if (direction === "up" || direction === "down") {
    for (let column = 0; column < newBoard[0].length; column++) {
      let items = matrixColumnToArray(newBoard, column);
      items = mergeAndSortItems({ items, onMerge, ...moveParams });
      for (let row = 0; row <= items.length - 1; row++) {
        newBoard[row][column] = items[row];
      }
    }
  }
  if (direction === "left" || direction === "right") {
    for (let row = 0; row < newBoard[0].length; row++) {
      newBoard[row] = mergeAndSortItems({
        items: newBoard[row],
        onMerge,
        ...moveParams,
      });
    }
  }

  if (!areMatrixesEqual(board, newBoard)) {
    newBoard = generateTileOnBoard(newBoard);
  }
  return newBoard;
}

// helpers
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
    }
  }
  return hasMoves;
}

export default {
  getInitialBoard,
  hasMoves,
  move,
  getPositionsById,
};
