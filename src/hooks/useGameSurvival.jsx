import { useState, useCallback, useEffect } from "react";
import { useInterval } from "./useInterval";
import { useBoard, bottomedOut } from "./useBoard";
import { EmptyCell, randomTetromino } from "../components/tetrominos";
import {
  clearRows,
  playClearEffect,
  playSoundEffect,
  changeSEVolume,
  updateBoard,
} from "../helpers/helpers";
import Korobeiniki from "../assets/Korobeiniki.mp3";
const korobeinikiAudio = new Audio(Korobeiniki);


export function useGameSurvival() {
  const [inGame, setInGame] = useState(false);
  const [paused, setPaused] = useState(false);
  const [gameSpeed, setGameSpeed] = useState(null);
  const [numRowsCleared, setNumRowsCleared] = useState(0);
  const [nextBlocks, setNextBlocks] = useState([]);
  const [heldBlock, setHeldBlock] = useState(null);
  const [score, setScore] = useState(0);
  const keyRepeatDelay = 200;
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [level, setLevel] = useState(1);
  const [volumeLevel, setVolumeLevel] = useState(0.4);
  const [soundEffectVolume, setSoundEffectVolume] = useState(0.4);


  // Volume Functions
  changeSEVolume(soundEffectVolume);
  korobeinikiAudio.volume = volumeLevel;

  const [
    { board, position, tetrominoBlockType, tetromino },
    dispatchBoardState,
  ] = useBoard();

  const gameTick = useCallback(() => {
    if (bottomedOut(board, position, tetrominoBlockType, tetromino)) {
      place(board, position, tetrominoBlockType, tetromino);
    } else {
      dispatchBoardState({ type: "drop" });
    }
  }, [board, dispatchBoardState, tetrominoBlockType, tetromino, position]);

  useInterval(() => {
    if (!inGame) {
      return;
    }
    gameTick();
  }, gameSpeed);

  const start = useCallback(() => {
    setInGame(true);
    setNumRowsCleared(0);
    setScore(0);
    setLevel(1);
    setGameSpeed(800);
    setNextBlocks(generateNextBlocks());
    setHeldBlock(null);
    setTime(0);
    setIsRunning(true);
    korobeinikiAudio.play();
    dispatchBoardState({ type: "start" });
  }, [dispatchBoardState]);

  function checkFilledRows(board) {
    let amountCleared = 0;
    board.forEach((row, rowIndex) => {
      if (row.every((cell) => cell !== EmptyCell.Empty)) {
        setNumRowsCleared((prevNumRowsCleared) => (prevNumRowsCleared += 1));
        amountCleared += 1;
        clearRows(board, rowIndex);
      }
    });
    return amountCleared;
  }
  function findGhostPosition(board, position, tetrominoBlockType, tetromino) {
    let lowestRow = -1;
    for (let rowIndex = 19; rowIndex >= 0; rowIndex--) {
      if (
        bottomedOut(
          board,
          { ...position, y: rowIndex },
          tetrominoBlockType,
          tetromino
        )
      ) {
        lowestRow = rowIndex;
      } else {
        break;
      }
    }
    return lowestRow;
  }

  function generateNextBlocks() {
    let nextBlockArray = [];
    for (let i = 0; i < 4; i++) {
      nextBlockArray.push(randomTetromino());
    }
    return nextBlockArray;
  }

  const place = useCallback(
    (board, position, tetrominoBlockType, tetromino) => {
      const updatedBoard = updateBoard(
        board,
        position,
        tetrominoBlockType,
        tetromino
      );
      playClearEffect(checkFilledRows(updatedBoard));
      setScore(
        (prevScore) =>
          (prevScore += scoreValue(checkFilledRows(updatedBoard), level))
      );
      if (
        bottomedOut(
          updatedBoard,
          { x: 3, y: -1 },
          tetrominoBlockType,
          tetromino
        )
      ) {
        setInGame(false);
        setGameOver(true);
        setIsRunning(false);
        playSoundEffect("gameover");
        korobeinikiAudio.pause();
      }
      const newBlockType = randomTetromino();
      setNextBlocks((prevNextBlocks) => {
        const updatedNextBlocks = [...prevNextBlocks, newBlockType];
        return updatedNextBlocks.slice(1);
      });
      dispatchBoardState({
        type: "place",
        updatedBoard: updatedBoard,
        newBlockType: nextBlocks[0],
      });
    },
    [board, dispatchBoardState, position, tetromino, tetrominoBlockType]
  );

  const moveLeft = (movingLeft) => {
    dispatchBoardState({ type: "moveLeft", movingLeft: movingLeft });
  };
  const moveRight = (movingRight) => {
    dispatchBoardState({ type: "moveRight", movingRight: movingRight });
  };
  const moveDown = () => {
    setGameSpeed(25);
  };
  const rotate = (tetromino) => {
    playSoundEffect("rotate");
    dispatchBoardState({ type: "rotate", tetromino: tetromino });
  };
  const fastDrop = (board, position, tetrominoBlockType, tetromino) => {
    place(
      board,
      {
        ...position,
        y: findGhostPosition(board, position, tetrominoBlockType, tetromino),
      },
      tetrominoBlockType,
      tetromino
    );
  };
  const hold = (tetromino) => {
    if (heldBlock === null) {
      setHeldBlock(tetromino);
      const newBlockType = randomTetromino();
      setNextBlocks((prevNextBlocks) => {
        const updatedNextBlocks = [...prevNextBlocks, newBlockType];
        return updatedNextBlocks.slice(1);
      });
      dispatchBoardState({ type: "hold", heldBlockType: nextBlocks[0] });
    } else {
      const currentHeldBlock = heldBlock;
      dispatchBoardState({ type: "hold", heldBlockType: currentHeldBlock });
      setHeldBlock(tetromino);
    }
  };
  const pause = () => {
    if (inGame === true) {
      korobeinikiAudio.pause();
      setInGame(false);
      setPaused(true);
    } else {
      korobeinikiAudio.play();
      setInGame(true);
      setPaused(false);

    }
  };
  useEffect(() => {
    // // eslint-disable-next-line no-unused-vars
    let intervalId = 0;
    if (isRunning) {
      intervalId = setInterval(() => setTime(time + 1), 10);
    }
    if (numRowsCleared >= level * 10) {
      setLevel(Math.round(numRowsCleared / 10) + 1);
      setGameSpeed(800 - Math.round(numRowsCleared / 10) * 7);
      playSoundEffect("nextlevel");
    }

    if (korobeinikiAudio.ended && inGame) {
      korobeinikiAudio.play();
    }
    // eslint-disable-next-line no-unused-vars
    let movingRight = false;
    // eslint-disable-next-line no-unused-vars
    let movingLeft = false;
    let movementInterval = null;
    console.log(
      findGhostPosition(board, position, tetrominoBlockType, tetromino)
    );
    const startMovement = (action) => {
      movementInterval = setInterval(() => {
        action();
      }, keyRepeatDelay);
    };

    const stopMovement = () => {
      clearInterval(movementInterval);
    };

    const handleKeyDown = (event) => {
      switch (event.key) {
        case "ArrowLeft":
          playSoundEffect("move");
          startMovement(moveLeft((movingLeft = true)));
          break;
        case "ArrowRight":
          playSoundEffect("move");
          startMovement(moveRight((movingRight = true)));
          break;
        case "ArrowDown":
          playSoundEffect("harddrop");
          moveDown();
          break;
        case "ArrowUp":
          rotate(tetromino);
          break;
        case "Shift":
          hold(tetrominoBlockType);
          break;
        case " ":
          startMovement(
            fastDrop(board, position, tetrominoBlockType, tetromino)
          );
          break;
        case "Escape":
          pause();
          break;
        default:
          break;
      }
    };

    const handleKeyUp = () => {
      stopMovement();
      setGameSpeed(800 - Math.round(numRowsCleared / 10) * 7);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      clearInterval(movementInterval);
      clearInterval(intervalId);
    };
  }, [moveLeft, moveRight, dispatchBoardState, time, setIsRunning]);

  const renderedBoard = structuredClone(board);
  updateBoard(renderedBoard, position, tetrominoBlockType, tetromino);

  return {
    board: renderedBoard,
    start,
    inGame,
    numRowsCleared,
    score,
    nextBlocks,
    heldBlock,
    paused,
    gameOver,
    time,
    level,
    gameSpeed,
    volumeLevel,
    setVolumeLevel,
    soundEffectVolume,
    setSoundEffectVolume,
  };
}

export const findGhostPosition = (
  board,
  position,
  tetrominoBlockType,
  tetromino
) => {
  if (position != undefined) {
    let lowestGhostPosition = position.y;

    while (
      canMoveToPosition(
        board,
        { y: lowestGhostPosition + 1, x: position.x },
        tetromino
      )
    ) {
      lowestGhostPosition++;
    }

    return lowestGhostPosition;
  }
};

const canMoveToPosition = (board, position, tetromino) => {
  for (let rowIndex = 0; rowIndex < tetromino.length; rowIndex++) {
    for (let colIndex = 0; colIndex < tetromino[rowIndex].length; colIndex++) {
      if (tetromino[rowIndex][colIndex] !== 0) {
        if (
          position.y + rowIndex < 0 ||
          position.y + rowIndex >= board.length ||
          position.x + colIndex < 0 ||
          position.x + colIndex >= board[0].length ||
          board[position.y + rowIndex][position.x + colIndex] !==
            EmptyCell.Empty
        ) {
          return false;
        }
      }
    }
  }

  return true;
};

function scoreValue(rowsCleared, level) {
  let scoreAmount = 0;
  switch (rowsCleared) {
    case 1:
      scoreAmount = 100 * level;
      break;
    case 2:
      scoreAmount = 300 * level;
      break;
    case 3:
      scoreAmount = 500 * level;
      break;
    case 4:
      scoreAmount = 800 * level;
      break;
    default:
      break;
  }
  return scoreAmount;
}
