export const Piece = {
    T: "T",
    O: "O",
    I: "I",
    S: "S",
    Z: "Z",
    J: "J",
    L: "L",
  };

export const EmptyCell = {
  Empty: "Empty",
};

export const tetrominoArrays = {
  T: {
    shape: [
      [0, 1, 0, 0],
      [1, 1, 1, 0],
      [0, 0, 0, 0],
    ],
  },
  O: {
    shape: [
      [1, 1, 0, 0],
      [1, 1, 0, 0],
      [0, 0, 0, 0],
    ],
  },
  I: {
    shape: [
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  },
  S: {
    shape: [
      [0, 1, 1, 0],
      [1, 1, 0, 0],
      [0, 0, 0, 0],
    ],
  },
  Z: {
    shape: [
      [1, 1, 0, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0],
    ],
  },
  J: {
    shape: [
      [1, 0, 0, 0],
      [1, 1, 1, 0],
      [0, 0, 0, 0],
    ],
  },
  L: {
    shape: [
      [0, 0, 1, 0],
      [1, 1, 1, 0],
      [0, 0, 0, 0],
    ],
  },

};


export function randomTetromino() {
  const tetrominos = ["T", "O", "I", "S", "Z", "J", "L"];
  const randomTetromino =
    tetrominos[Math.floor(Math.random() * tetrominos.length)];
    console.log(tetrominos[Math.floor(Math.random() * tetrominos.length)]);
  return randomTetromino;
}
