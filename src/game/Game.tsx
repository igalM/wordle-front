import './Game.css';
import Board from "../board/Board";
import Keyboard from "../keyboard/Keyboard";
import { useEffect } from 'react';
import useWordle from '../hooks/useWordle';
import GameOverDialog from '../game-over-dialog/GameOverDialog';
import useWebSocket from '../hooks/useWebSocket';
import useLocalStorage from '../hooks/useLocalStorage';
import { LOCAL_STORAGE_KEY } from '../consts';

export default function Game() {
    const { getItem } = useLocalStorage();
    const playerName = JSON.parse(getItem(LOCAL_STORAGE_KEY) as string);

    const { resetGame, handleKeyPress, setOpponentBoardFn, board, opponentBoard, isGameOver, isGameWon, currentTurn, usedKeys, solution } = useWordle();
    const { isLoading, opponentNickname, opponentRow, roomId } = useWebSocket(playerName);

    useEffect(() => {
        document.addEventListener('keyup', handleKeyPress);
        return () => {
            document.removeEventListener('keyup', handleKeyPress);
        }
    }, [handleKeyPress]);

    useEffect(() => {
        if (opponentRow.row.length) {
            setOpponentBoardFn(opponentRow.row, opponentRow.turn);
        }
    }, [opponentRow]);

    const closeDialog = () => {
        resetGame();
    }

    if (isLoading) {
        return <p>Looking for an opponent...</p>
    }

    return <div key={roomId}>
        {isGameOver && <GameOverDialog isWon={isGameWon} solution={solution} onClick={closeDialog} />}
        <div className='boards'>
            <Board board={board} nickname={playerName} currentTurn={currentTurn} />
            <Board board={opponentBoard} nickname={opponentNickname} />
        </div>
        <Keyboard usedKeys={usedKeys} />
    </div>
}