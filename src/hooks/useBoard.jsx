import { useReducer } from "react";
import { createBoard, rotateTetrominoClockwise } from "../helpers/helpers";
import { tetrominoArrays, randomTetromino } from "../components/tetrominos";
import { EmptyCell } from "../components/tetrominos";
// import { updateBoard } from "./useGame"; // Make sure the path is correct

export function useBoard() {
  const [boardState, dispatchBoardState] = useReducer(boardStateReducer, {
    board: createBoard(),
    position: { x: 3, y: 0 },
    tetrominoBlockType: "T",
    tetromino: tetrominoArrays.T.shape,
    bottomedOut: false,
  });
  return [boardState, dispatchBoardState];
}

function boardStateReducer(state, action) {
  let newState = { ...state };
  switch (action.type) {
    case "start": {
      const getRandomTetromino = randomTetromino();
      return {
        board: createBoard(),
        position: { x: 3, y: 0 },
        tetrominoBlockType: getRandomTetromino,
        tetromino: tetrominoArrays[getRandomTetromino].shape,
        bottomedOut: false,
      };
    }
    case "moveRight": {
      let canMoveRight = true;
      if (newState.position.x != undefined) {
        // eslint-disable-next-line no-unused-vars
        newState.tetromino.forEach((row, rowIndex) => {
          if (row.some((value) => value !== 0)) {
            row.forEach((value, colIndex) => {
              if (value !== 0) {
                if (
                  newState.position.x + colIndex + 1 >=
                    newState.board[0].length ||
                  (newState.board[newState.position.y + rowIndex][
                    newState.position.x + colIndex + 1
                  ] !== EmptyCell.Empty && newState.board[newState.position.y + rowIndex][
                    newState.position.x + colIndex - 1
                  ] !== "G" )
                )
                  canMoveRight = false;
                console.log(canMoveRight);
              }
            });
          }
        });
      }
      if (canMoveRight && action.movingRight)
        return {
          ...newState,
          position: {
            ...newState.position,
            x: newState.position.x + 1,
          },
        };
      else {
        return { ...newState };
      }
    }

    case "moveLeft": {
      let canMoveLeft = true;
      if (newState.position.x != undefined) {
        // eslint-disable-next-line no-unused-vars
        newState.tetromino.forEach((row, rowIndex) => {
          if (row.some((value) => value !== 0)) {
            //filters out rows that are only 0s
            row.forEach((value, colIndex) => {
              if (value !== 0) {
                if (
                  newState.position.x + colIndex === 0 ||
                  (newState.board[newState.position.y + rowIndex][
                    newState.position.x + colIndex - 1
                  ] !== EmptyCell.Empty && newState.board[newState.position.y + rowIndex][
                    newState.position.x + colIndex - 1
                  ] !== "G" )
                )
                  canMoveLeft = false;
              }
            });
          }
        });
      }
      if (canMoveLeft && action.movingLeft) {
        return {
          ...newState,
          position: {
            ...newState.position,
            x: newState.position.x - 1,
          },
        };
      } else {
        return { ...newState };
      }
    }

    case "drop":
      newState.position.y++;
      break;

    case "place": {
      const placementX = 3;
      return {
        board: action.updatedBoard,
        position: { x: placementX, y: 0 },
        tetrominoBlockType: action.newBlockType,
        tetromino: tetrominoArrays[action.newBlockType].shape,
        bottomedOut: false,
      };
    }
    case "rotate": {
      const rotatedShape = rotateTetrominoClockwise(action.tetromino);
      let canRotate = true;
      if (rotatedShape != undefined) {
        // eslint-disable-next-line no-unused-vars
        rotatedShape.forEach((row, rowIndex) => {
          if (row.some((value) => value !== 0)) {
            //filters out rows that are only 0s
            row.forEach((value, colIndex) => {
              if (value !== 0) {
                if (
                  0 >
                    newState.position.x + colIndex >=
                    newState.board[0].length ||
                  (newState.board[newState.position.y + rowIndex][
                    newState.position.x + colIndex
                  ] !== EmptyCell.Empty && newState.board[newState.position.y + rowIndex][
                    newState.position.x + colIndex
                  ] !== "G")
                )
                  canRotate = false;
              }
            });
          }
        });
      }
      if (canRotate === true) {
        return {
          ...newState,
          tetromino: rotatedShape,
        };
      }
      if (canRotate === false && newState.position.x > 5) {
        return {
          ...newState,
          position: {
            ...newState.position,
            x: newState.position.x - 1,
          },
          tetromino: rotatedShape,
        };
      }
      if (canRotate === false && newState.position.x < 5) {
        return {
          ...newState,
          tetromino: rotatedShape,
          position: {
            ...newState.position,
            x: newState.position.x + 1,
          },
        };
      } else {
        return { ...newState };
      }
    }
    case "hold": {
      const placementX = 3;
      return {
        board: newState.board,
        position: { x: placementX, y: 0 },
        tetrominoBlockType: action.heldBlockType,
        tetromino: tetrominoArrays[action.heldBlockType].shape,
        bottomedOut: false,
      };
    }
    default:
      return;
  }
  return { ...newState };
}

// eslint-disable-next-line no-unused-vars
export function bottomedOut(board, position, tetrominoBlockType, tetromino) {
  let bottomedOut = false;
  // eslint-disable-next-line no-unused-vars
  tetromino.forEach((row, rowIndex) => {
    if (row.some((value) => value !== 0)) {
      row.forEach((value, colIndex) => {
        if (value !== 0) {
          if (
            position.y + rowIndex + 1 >= board.length ||
            (board[position.y + rowIndex + 1][position.x + colIndex] !==
              EmptyCell.Empty && board[position.y + rowIndex + 1][position.x + colIndex] !== "G")
          )
            return (bottomedOut = true);
        }
      });
    }
  });
  return bottomedOut;
}
