function createBoard(size) {
  const board = Array(size)
    .fill(1)
    .map(() => Array(size).fill(null));
  return board;
}

function generateValueOnBoard(boardToPopulate) {
	const board = boardToPopulate.map(row => [...row]);
  let row = Math.floor(Math.random() * board.length);
  let column = Math.floor(Math.random() * board[0].length);

  while (board[row][column]) {
    row = Math.floor(Math.random() * board.length);
    column = Math.floor(Math.random() * board[0].length);
  }

  board[row][column] = 2;
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

function moveHorizontal(board, direction) {
  const newBoard = board.map((row) => [...row]);

  const start = direction === "right" ? myBoard[0].length - 1 : 0;
  const end = direction === "right" ? 0 : myBoard[0].length - 1;
  const increment = direction === "right" ? -1 : 1;
  const sortMethod =
    direction === "right" ? sortNullsToBeginning : sortNullsToEnd;

  for (let row = 0; row < newBoard[0].length; row++) {
    let items = newBoard[row].sort(sortNullsToEnd);
    newBoard[row] = mergeAndSortItems({
      items,
      start,
      end,
      increment,
      sortMethod,
    });
  }

  return newBoard;
}

function moveVertical(board, direction) {
  const newBoard = board.map((row) => [...row]);

  const start = direction === "up" ? myBoard[0].length - 1 : 0;
  const end = direction === "up" ? 0 : myBoard[0].length - 1;
  const increment = direction === "up" ? -1 : 1;
  const sortMethod = direction === "up" ? sortNullsToEnd : sortNullsToBeginning;

  for (let column = 0; column < newBoard[0].length; column++) {
    let items = matrixColumnToArray(newBoard, column);
    items = mergeAndSortItems({ items, start, end, increment, sortMethod });
    for (let row = 0; row <= items.length - 1; row++) {
      newBoard[row][column] = items[row];
    }
  }
  return newBoard;
}

function move(board, direction){
	if (direction === 'up' || direction === 'down') {
		return moveVertical(board, direction);
	}
	if (direction === 'left' || direction === 'right') {
		return moveHorizontal(board, direction);
	}
}

// Populate
let myBoard = createBoard(4);

// myBoard[0][0] = 2;
// myBoard[0][1] = 2;
// myBoard[0][2] = 2;
// myBoard[0][3] = 2;
// myBoard[1][3] = 8;
// myBoard[2][2] = 4;
// myBoard[3][3] = 8;

myBoard = generateValueOnBoard(myBoard);
myBoard = generateValueOnBoard(myBoard);

console.table("Step 1.", myBoard);
myBoard = move(myBoard, "right");
console.table("Step 2.", myBoard);
myBoard = move(myBoard, "left");
console.table("Step 3.", myBoard);
myBoard = move(myBoard, "down");
console.table("Step 4.", myBoard);
myBoard = move(myBoard, "up");
console.table("Step 5.", myBoard);
