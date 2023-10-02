import { rowCount, columnCount } from "../components/constants";
import { EmptyCell } from "../components/tetrominos";
import { findGhostPosition } from "../hooks/useGame";

export const createBoard = (rows = rowCount, columns = columnCount) => {
  return Array(rows)
    .fill(null)
    .map(() => Array(columns).fill(EmptyCell.Empty));
};

export function clearRows(board, rowIndex) {
  const newRow = Array(board[0].length).fill(EmptyCell.Empty);
  board.splice(rowIndex, 1);
  board.unshift(newRow);
}

export const updateBoard = (board, position, tetrominoBlockType, tetromino) => {
  const ghostPosition = findGhostPosition(
    board,
    position,
    tetrominoBlockType,
    tetromino
  );
  const clonedBoard = [...board];
  tetromino.forEach((row, rowIndex) => {
    if (row.some((value) => value !== 0)) {
      row.forEach((value, colIndex) => {
        if (value !== 0) {
          clonedBoard[position.y + rowIndex][position.x + colIndex] =
            tetrominoBlockType;
        }
      });
    }
  });
  if (ghostPosition > position.y) {
    tetromino.forEach((row, rowIndex) => {
      row.forEach((value, colIndex) => {
        if (value !== 0) {
          if (
            ghostPosition + rowIndex >= 0 &&
            clonedBoard[ghostPosition + rowIndex][position.x + colIndex] ===
              EmptyCell.Empty
          ) {
            clonedBoard[ghostPosition + rowIndex][position.x + colIndex] = "G"; 
          }
        }
      });
    });
  }
  return clonedBoard;
};

export const updateSmallBoard = (board, tetrominoBlockType, tetromino) => {
  const clonedBoard = [...board];
  tetromino.forEach((row, rowIndex) => {
    if (row.some((value) => value !== 0)) {
      row.forEach((value, colIndex) => {
        if (value !== 0) {
          clonedBoard[rowIndex][colIndex] = tetrominoBlockType;
        }
      });
    }
  });
  return clonedBoard;
};

export function rotateTetrominoClockwise(currentTetromino) {
  const numRows = currentTetromino.length;
  const numCols = currentTetromino[0].length;
  const rotatedShape = [];

  for (let col = 0; col < numCols; col++) {
    const newRow = [];
    for (let row = numRows - 1; row >= 0; row--) {
      newRow.push(currentTetromino[row][col]);
    }
    rotatedShape.push(newRow);
  }

  return rotatedShape;
}
