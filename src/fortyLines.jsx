import "./index.css";
import Board from "./components/board";
import { useGameFortyLines } from "./hooks/useGameFortyLines";
import {
  updateSmallBoard,
  rotateTetrominoClockwise,
  createBoard,
} from "./helpers/helpers";
import { tetrominoArrays } from "./components/tetrominos";
import { Link } from "react-router-dom";

export const updateNextBoard = (
  board,
  position,
  tetrominoBlockType,
  tetromino
) => {
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
  return clonedBoard;
};
function FortyLines() {
  const {
    board,
    start,
    inGame,
    numRowsCleared,
    nextBlocks,
    heldBlock,
    paused,
    score,
    isRunning,
    time,
    gameOver,
  } = useGameFortyLines();
  const minutes = Math.floor((time % 360000) / 6000);
  const seconds = Math.floor((time % 6000) / 100);
  const milliseconds = time % 100;
  console.log(time);
  const idleBoard = createBoard();
  const heldBoard = createBoard(4, 4);
  function holdingBoard(heldBlock) {
    if (heldBlock === null) {
      return heldBoard;
    } else {
      return updateSmallBoard(
        heldBoard,
        heldBlock,
        rotateTetrominoClockwise(tetrominoArrays[heldBlock].shape)
      );
    }
  }
  function cleanUpShapes(nextBlock) {
    if (nextBlock != "I") {
      return rotateTetrominoClockwise(tetrominoArrays[nextBlock].shape);
    } else {
      return tetrominoArrays[nextBlock].shape;
    }
  }
  const nextBoard = createBoard(17, 4);
  function generateNextBoard(nextBlocks) {
    if (nextBlocks.length === 0) {
      return nextBoard;
    } else {
      for (let i = 0; i < nextBlocks.length; i++) {
        const nextBlock = nextBlocks[i];
        const tetrominoShape = cleanUpShapes(nextBlock);
        updateNextBoard(
          nextBoard,
          { y: 1 + 4 * i, x: 0 },
          nextBlock,
          tetrominoShape
        );
      }
      return nextBoard;
    }
  }

  return (
    <div className="container">
      {!inGame && gameOver && numRowsCleared < 2 ? (
        <div className="gameOverScreen">
          <div className="gameOverScreenContent">
            {" "}
            <div className="menuHeader"> GAMEOVER!</div>
            <div>
              You survived for: {minutes.toString().padStart(2, "0")}:
              {seconds.toString().padStart(2, "0")}:
              {milliseconds.toString().padStart(2, "0")}
            </div>
            <button className="startButton" onClick={start}>
              Try Again?
            </button>
            <Link to={"/"}>
              <button>Return to Title Screen</button>
            </Link>{" "}
          </div>
        </div>
      ) : (
        <></>
      )}
      {!inGame && gameOver && numRowsCleared >= 2 ? (
        <div className="gameOverScreen">
          <div className="gameOverScreenContent">
            {" "}
            <div> Congradulations! </div>{" "}
            <div>
              You completed 40 lines in: {minutes.toString().padStart(2, "0")}:
              {seconds.toString().padStart(2, "0")}:
              {milliseconds.toString().padStart(2, "0")}
            </div>
            <button className="startButton" onClick={start}>
              Try Again?
            </button>{" "}
          </div>
        </div>
      ) : (
        <></>
      )}
      {!inGame && !paused && !gameOver ? (
        <div className="controls">
          <div className="controlContent">
            <button className="startButton" onClick={start}>
              {" "}
              Start Game
            </button>{" "}
          </div>
        </div>
      ) : (
        <></>
      )}

      {!inGame && paused && !gameOver ? (
        <div className="controls">
          <div className="pauseContainer">
            <div className="menuHeader">Paused</div>
            <button className="startButton" onClick={start}>
              {" "}
              Restart Game
            </button>{" "}
            <Link to={"/"}>
              <button>Return to Title Screen</button>
            </Link>
          </div>
        </div>
      ) : (
        <></>
      )}

      <div className="left-side">
        <div className="heldText">Held Block</div>
        <div className="nextBlockContainer">
          {!inGame ? (
            <Board currentBoard={heldBoard} />
          ) : (
            <Board currentBoard={holdingBoard(heldBlock)} />
          )}
        </div>
        <div>Rows Count:{numRowsCleared}</div>
        <div>Score:{score}</div>
        <div>
          {" "}
          time: {minutes.toString().padStart(2, "0")}:
          {seconds.toString().padStart(2, "0")}:
          {milliseconds.toString().padStart(2, "0")}
        </div>
      </div>
      <div className="game">
        <div className="cellHolder">
          {!inGame ? (
            <Board currentBoard={idleBoard} />
          ) : (
            <Board currentBoard={board} />
          )}
        </div>
      </div>
      <div className="right-side">
        <div>Next Block</div>
        <div className="nextBlockContainer">
          {!inGame ? (
            <Board currentBoard={nextBoard} />
          ) : (
            <Board currentBoard={generateNextBoard(nextBlocks)} />
          )}{" "}
          {!isRunning ? false : true}
        </div>
      </div>
    </div>
  );
}

export default FortyLines;