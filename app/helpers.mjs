export function sortNullsToBeginning(a, b) {
  if (a === null) return -1;
  if (b === null) return 1;
  return 0;
}

export function sortNullsToEnd(a, b) {
  if (a === null) return 1;
  if (b === null) return -1;
  return 0;
}

export function matrixColumnToArray(matrix, column) {
  const array = [];
  for (let row = 0; row <= matrix.length - 1; row++) {
    array[row] = matrix[row][column];
  }
  return array;
}

export function areMatrixesEqual(board1, board2) {
  const array1 = board1.reduce((arr, row) => [...arr, ...row], []);
  const array2 = board2.reduce((arr, row) => [...arr, ...row], []);
  return JSON.stringify(array1) === JSON.stringify(array2);
}
