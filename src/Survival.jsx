import "./index.css";
import Board from "./components/board";
import { useGameSurvival } from "./hooks/useGameSurvival";
import {
  updateSmallBoard,
  rotateTetrominoClockwise,
  createBoard,
} from "./helpers/helpers";
import { tetrominoArrays } from "./components/tetrominos";
import { Link } from "react-router-dom";
import { useControlContext } from "./contexts/ControlContext";

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
function Survival() {
  const {
    board,
    start,
    inGame,
    numRowsCleared,
    nextBlocks,
    heldBlock,
    paused,
    score,
    time,
    gameOver,
    level,
    gameSpeed,
    volumeLevel,
    setVolumeLevel,
    soundEffectVolume, setSoundEffectVolume,
    // downKey,
    // upKey,
    // rightKey,
    // leftKey,
    // reassigningDirection,
    // setReassigningDirection,
  } = useGameSurvival();
  const {
    downKey,
    upKey,
    rightKey,
    leftKey,
    reassigningDirection,
    setReassigningDirection,
} = useControlContext();
  const idleBoard = createBoard();
  const heldBoard = createBoard(4, 4);

  const handleKeyReassignment = (direction) => {
    setReassigningDirection(direction);
  };

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
  const minutes = Math.floor((time % 360000) / 6000);
  const seconds = Math.floor((time % 6000) / 100);
  const milliseconds = time % 100;

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
      {!inGame && gameOver ? (
        <div className="gameOverScreen">
          <div className="gameOverScreenContent">
            <div className="menuHeader">GAMEOVER!</div>
            <div>Your Score was {score} </div>
            <div>Clearing {numRowsCleared} Lines!</div>
            <div>
              {" "}
              and surviving for: {minutes.toString().padStart(2, "0")}:
              {seconds.toString().padStart(2, "0")}:
              {milliseconds.toString().padStart(2, "0")}
            </div>
            <button className="startButton" onClick={start}>
              Try Again?
            </button>{" "}
          </div>{" "}
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

      {!inGame && paused ? (
        <div className="controls">
          <div className="pauseContainer">
            <div className="menuHeader">Paused</div>

            Music Volume:
            <input
              type="range"
              min={0}
              max={1}
              step={0.02}
              value={volumeLevel}
              onChange={(event) => {
                setVolumeLevel(event.target.valueAsNumber);
              }}
            />
            Sound Effect Volume:
               <input
              type="range"
              min={0}
              max={1}
              step={0.02}
              value={soundEffectVolume}
              onChange={(event) => {
                setSoundEffectVolume(event.target.valueAsNumber);
              }}
            />
              <div className="controlLine">
              <div className="controlPart">
                <a>Left: </a>{" "}
              </div>
              <div className="controlPart">
                <a
                  className={reassigningDirection === "left" ? "reassign" : " "}
                >
                  {leftKey}
                </a>{" "}
              </div>
              <div className="controlPart">
                <button className="pauseButtons" onClick={(e) => handleKeyReassignment("left", e)}>
                  Reassign
                </button>{" "}
              </div>
            </div>
            <div className="controlLine">
              <div className="controlPart">
                <a>Right: </a>{" "}
              </div>
              <div className="controlPart">
                <a
                  className={
                    reassigningDirection === "right" ? "reassign" : " "
                  }
                >
                  {rightKey}
                </a>{" "}
              </div>
              <div className="controlPart">
                <button className="pauseButtons" onClick={(e) => handleKeyReassignment("right", e)}>
                  Reassign
                </button>{" "}
              </div>
            </div>
            <div className="controlLine">
              <div className="controlPart">
                <a>Up: </a>{" "}
              </div>
              <div className="controlPart">
                <a className={reassigningDirection === "up" ? "reassign" : " "}>
                  {upKey}
                </a>{" "}
              </div>
              <div className="controlPart">
                <button className="pauseButtons" onClick={(e) => handleKeyReassignment("up", e)}>
                  Reassign
                </button>{" "}
              </div>
            </div>
            <div className="controlLine">
              <div className="controlPart movementDiv">
                <a>Down: </a>{" "}
              </div>
              <div className="controlPart">
                <a
                  className={reassigningDirection === "down" ? "reassign" : " "}
                >
                  {downKey}
                </a>{" "}
              </div>
              <div className="controlPart">
                <button className="pauseButtons" onClick={(e) => handleKeyReassignment("down", e)}>
                  Reassign
                </button>{" "}
              </div>
            </div>
            <button className="startButton" onClick={start}>
              {" "}
              Restart Game
            </button>{" "}
            <Link to={"/tetris"}>
              <button>Main Menu</button>
            </Link>
          </div>
        </div>
      ) : (
        <></>
      )}
      <div className="left-side">
        <div className="topLeft">
          <div className="heldText">Held Block</div>
          <div className="nextBlockContainer">
            {!inGame ? (
              <Board currentBoard={heldBoard} />
            ) : (
              <Board currentBoard={holdingBoard(heldBlock)} />
            )}
          </div>
        </div>
        <div className="gapSpace"></div>
        <div className="bottomLeft">
          <div className="scoringDetails">
            <div>Rows Count:</div>
            <div>{numRowsCleared}</div>
            <div>Score:</div>
            <div>{score}</div>
            <div>Level:</div>
            <div>{level}</div>
            <div>Gamespeed:</div>
            <div>{gameSpeed}</div>
            <div> Time:</div>
            <div>
              {" "}
              {minutes.toString().padStart(2, "0")}:
              {seconds.toString().padStart(2, "0")}:
              {milliseconds.toString().padStart(2, "0")}
            </div>
          </div>
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
        </div>
      </div>
    </div>
  );
}

export default Survival;
