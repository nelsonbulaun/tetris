import { rowCount, columnCount } from "../components/constants";
import { EmptyCell } from "../components/tetrominos";
import { findGhostPosition } from "../hooks/useGameSurvival";
// import nextLevelSound from "../assets/next-level.mp3";
// import gameOverSound from "../assets/game-over.mp3";
// import Korobeiniki from "../assets/Korobeiniki.mp3";
import singleSoundEffect from "../assets/se_game_single.wav";
import doubleSoundEffect from "../assets/se_game_double.wav";
import tripleSoundEffect from "../assets/se_game_triple.wav";
import tetrisSoundEffect from "../assets/se_game_tetris.wav";
import hardDropSoundEffect from "../assets/se_game_harddrop.wav";
const singleSE = new Audio(singleSoundEffect);
const doubleSE = new Audio(doubleSoundEffect);
const tripleSE = new Audio(tripleSoundEffect);
const tetrisSE = new Audio(tetrisSoundEffect);
import nextLevelSoundFile from "../assets/next-level.mp3";
import gameOverSoundFile from "../assets/game-over.mp3";
import rotateSoundEffect from "../assets/se_game_rotate.wav";
import moveSoundEffect from "../assets/se_game_move.mp3";
const nextLevelSound = new Audio(nextLevelSoundFile);
const gameOverSound = new Audio(gameOverSoundFile);
const rotateSE = new Audio(rotateSoundEffect);
const moveSE = new Audio(moveSoundEffect);
const hardDropSE = new Audio(hardDropSoundEffect);

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

export function playClearEffect(val){
  switch (val){
    case 1:
      singleSE.play();
      break;
    case 2:
      doubleSE.play();
      break;
    case 3:
      tripleSE.play();
      break;
    case 4:
      tetrisSE.play();
      break;
  }
}
export function changeSEVolume(val){
  singleSE.volume = val;
  doubleSE.volume = val;
  tripleSE.volume = val;
  tetrisSE.volume = val;
  nextLevelSound.volume = val;
  gameOverSound.volume = val;
  rotateSE.volume = val;
  moveSE.volume = val;
}

export function playSoundEffect(val){
  switch (val){
    case "nextlevel":
      nextLevelSound.play();
      break;
    case "gameover":
      gameOverSound.play();
      break;
    case "rotate":
      rotateSE.play();
      break;
    case "move":
      moveSE.play();
      break;
    case "harddrop":
      hardDropSE.play();
    default:
      break;
  }
}