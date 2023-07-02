import './Board.css';
import { GameSquare } from "../../types";
import classNames from "classnames";

type Props = {
    board: Array<Array<GameSquare>>,
    nickname: string,
    currentTurn: number,
    shakeAnimation?: boolean,
    isOpponent?: boolean,
}

export default function Board({ board, nickname, isOpponent, shakeAnimation, currentTurn }: Props) {
    return <div className={isOpponent ? 'opponent board' : 'board'}>
        {!isOpponent && <h2>{nickname} <span style={{ fontSize: '1rem' }}>(You)</span></h2>}
        {isOpponent && <h2 className='opponent-nickname'>{nickname}</h2>}
        {board.map((row, rowIndex) => (
            <div key={rowIndex} className={classNames({
                'board-row': true,
                'highlighted': currentTurn === rowIndex,
                'invalid': shakeAnimation && currentTurn === rowIndex
            })}>
                {row.map((item, colIndex) => (
                    <div key={colIndex} className={`board-cell ${item.bgColor} ${(item.value && !item.bgColor) ? 'filled' : ''}`}>{item.value}</div>
                ))}
            </div>
        ))}
    </div>
}