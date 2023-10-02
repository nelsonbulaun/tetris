export const Cell = ({type}) => {
  return(
      <div className={`cell ${type}`} />
  )
}

const Board = ({ currentBoard }) => {
  console.log(currentBoard);
  return (
    <div className="board">
      {currentBoard.map((row, rowIndex) => (
        <div className="row" key={`${rowIndex}`}>
          {row.map((cell, colIndex) => (
            <Cell key={`${rowIndex}-${colIndex}`} type={cell} />
          ))}
        </div>
      ))}
    </div>
  )
}

export default Board;