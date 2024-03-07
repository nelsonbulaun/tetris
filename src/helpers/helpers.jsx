import { rowCount, columnCount } from "../components/constants";
import { EmptyCell } from "../components/tetrominos";
import { findGhostPosition } from "../hooks/useGameSurvival";
import singleSoundEffect from "../assets/audio/se_game_single.wav";
import doubleSoundEffect from "../assets/audio/se_game_double.wav";
import tripleSoundEffect from "../assets/audio/se_game_triple.wav";
import tetrisSoundEffect from "../assets/audio/se_game_tetris.wav";
import hardDropSoundEffect from "../assets/audio/se_game_harddrop.wav";
import landingSoundEffect from "../assets/audio/se_game_landing.wav";
import nextLevelSoundFile from "../assets/audio/next-level.mp3";
import gameOverSoundFile from "../assets/audio/game-over.mp3";
import rotateSoundEffect from "../assets/audio/se_game_rotate.wav";
import finishSoundEffect from "../assets/audio/me_game_iget.wav";
import moveSoundEffect from "../assets/audio/se_game_move.mp3";
// const singleSE = new Audio(singleSoundEffect);
// const doubleSE = new Audio(doubleSoundEffect);
// const tripleSE = new Audio(tripleSoundEffect);
// const tetrisSE = new Audio(tetrisSoundEffect);
// const nextLevelSound = new Audio(nextLevelSoundFile);
// const gameOverSound = new Audio(gameOverSoundFile);
// const rotateSE = new Audio(rotateSoundEffect);
// const moveSE = new Audio(moveSoundEffect);
// const hardDropSE = new Audio(hardDropSoundEffect);
// const landingSE = new Audio(landingSoundEffect);
// const finishSE = new Audio(finishSoundEffect);

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

let audioContext = new AudioContext();
let gainNode = audioContext.createGain();
gainNode.connect(audioContext.destination);

// eslint-disable-next-line no-unused-vars
let singleSE, doubleSE, tripleSE, tetrisSE, nextLevelSound, gameOverSound, rotateSE, moveSE, hardDropSE, landingSE, finishSE;

function loadAudio(url, callback) {
    let request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';

    request.onload = function() {
        audioContext.decodeAudioData(request.response, function(buffer) {
            callback(buffer);
        });
    };

    request.send();
}

export function playClearEffect(val) {
  switch (val) {
    case 1:
      playSoundEffect(singleSE);
      break;
    case 2:
      playSoundEffect(doubleSE);
      break;
    case 3:
      playSoundEffect(tripleSE);
      break;
    case 4:
      playSoundEffect(tetrisSE);
      break;
    default:
      break;
  }
}

export function playSoundEffect(buffer) {
    let source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(gainNode);
    console.log(buffer);

    source.start();
}

export function initializeSounds() {
    loadAudio(singleSoundEffect, function(buffer) {
        singleSE = buffer;
    });
    loadAudio(doubleSoundEffect, function(buffer) {
        doubleSE = buffer;
    });
    loadAudio(tripleSoundEffect, function(buffer) {
        tripleSE = buffer;
    });
    loadAudio(tetrisSoundEffect, function(buffer) {
        tetrisSE = buffer;
    });
    loadAudio(nextLevelSoundFile, function(buffer) {
        nextLevelSound = buffer;
    });
    loadAudio(gameOverSoundFile, function(buffer) {
        gameOverSound = buffer;
    });
    loadAudio(rotateSoundEffect, function(buffer) {
        rotateSE = buffer;
    });
    loadAudio(moveSoundEffect, function(buffer) {
        moveSE = buffer;
    });
    loadAudio(hardDropSoundEffect, function(buffer) {
        hardDropSE = buffer;
    });
    loadAudio(landingSoundEffect, function(buffer) {
        landingSE = buffer;
    });
    loadAudio(finishSoundEffect, function(buffer) {
        finishSE = buffer;
    });
}
export {singleSE, doubleSE, tripleSE, nextLevelSound,gameOverSound, rotateSE, moveSE, hardDropSE, 
  landingSE, finishSE}

export function changeSEVolume(val) {
    gainNode.gain.value = val;
}

