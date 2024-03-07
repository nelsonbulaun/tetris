import { useState, useCallback, useEffect } from "react";
import { useInterval } from "./useInterval";
import { useBoard, bottomedOut } from "./useBoard";
import { EmptyCell, randomTetromino } from "../components/tetrominos";
import {
  clearRows,
  updateBoard,
  playClearEffect,
  playSoundEffect,
  changeSEVolume,
} from "../helpers/helpers";
import { useControlContext } from "../contexts/ControlContext";
import Korobeiniki from "../assets/audio/Korobeiniki.mp3";
const korobeinikiAudio = new Audio(Korobeiniki);

export function useGameFortyLines() {
  const [inGame, setInGame] = useState(false);
  const [paused, setPaused] = useState(false);
  const [gameSpeed, setGameSpeed] = useState(null);
  const [numRowsCleared, setNumRowsCleared] = useState(0);
  const [nextBlocks, setNextBlocks] = useState([]);
  const [heldBlock, setHeldBlock] = useState(null);
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(0.4);
  const [soundEffectVolume, setSoundEffectVolume] = useState(0.4);
  const keyRepeatDelay = 200;
  const {leftKey, rightKey, upKey, downKey} = useControlContext();

  const [
    { board, position, tetrominoBlockType, tetromino },
    dispatchBoardState,
  ] = useBoard();

  // Volume Functions
  changeSEVolume(soundEffectVolume);
  korobeinikiAudio.volume = volumeLevel;

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
    setGameSpeed(500);
    setNumRowsCleared(0);
    setTime(0);
    setIsRunning(true);
    setNextBlocks(generateNextBlocks());
    setHeldBlock(null);
    dispatchBoardState({ type: "start" });
    korobeinikiAudio.play();
    setGameOver(false);
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
      playSoundEffect("landing");
      playClearEffect(checkFilledRows(updatedBoard));
      if (
        bottomedOut(updatedBoard, { x: 3, y: 0 }, tetrominoBlockType, tetromino)
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
    if (isRunning && !paused) {
      intervalId = setInterval(() => setTime(time + 1), 10);
    }
    if (numRowsCleared >= 40) {
      setIsRunning(false);
      setInGame(false);
      setGameOver(true);
      korobeinikiAudio.pause();
      playSoundEffect("finish");
    }

    // eslint-disable-next-line no-unused-vars
    let movingRight = false;
    // eslint-disable-next-line no-unused-vars
    let movingLeft = false;
    let movementInterval = null;
    const startMovement = (action) => {
      movementInterval = setInterval(() => {
        action();
      }, keyRepeatDelay);
    };
    if (korobeinikiAudio.ended && inGame) {
      korobeinikiAudio.play();
    }
    const stopMovement = () => {
      clearInterval(movementInterval);
    };

    const handleKeyDown = (event) => {
      switch (event.key) {
        case leftKey:
          playSoundEffect("move");
          startMovement(moveLeft((movingLeft = true)));
          break;
        case rightKey:
          playSoundEffect("move");
          startMovement(moveRight((movingRight = true)));
          break;
        case downKey:
          moveDown();
          break;
        case upKey:
          rotate(tetromino);
          break;
        case "Shift":
          hold(tetrominoBlockType);
          break;
        case " ":
          playSoundEffect("harddrop");
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
      setGameSpeed(500);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      clearInterval(movementInterval);
      clearInterval(intervalId);
    };
  }, [moveLeft, moveRight, dispatchBoardState, time, isRunning]);

  const renderedBoard = structuredClone(board);
  updateBoard(renderedBoard, position, tetrominoBlockType, tetromino);

  return {
    board: renderedBoard,
    start,
    inGame,
    numRowsCleared,
    nextBlocks,
    heldBlock,
    paused,
    isRunning,
    time,
    gameOver,
    volumeLevel,
    setVolumeLevel,
    soundEffectVolume,
    setSoundEffectVolume
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
