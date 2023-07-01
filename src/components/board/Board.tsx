import './Board.css';
import { GameSquare } from "../../types";

type Props = {
    board: Array<Array<GameSquare>>,
    nickname: string,
    currentTurn?: number
}

export default function Board({ board, nickname, currentTurn }: Props) {
    return <div className="board">
        <h2>{nickname}</h2>
        {board.map((row, rowIndex) => (
            <div key={rowIndex} className={currentTurn === rowIndex ? 'board-row highlighted' : 'board-row'}>
                {row.map((item, colIndex) => (
                    <div key={colIndex} className={`board-cell ${item.bgColor}`}>{item.value}</div>
                ))}
            </div>
        ))}
    </div>
}