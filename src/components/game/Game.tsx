import './Game.css';
import Board from "../board/Board";
import Keyboard from "../keyboard/Keyboard";
import { useEffect } from 'react';
import GameOverDialog from '../../dialogs/game-over-dialog/GameOverDialog';
import { LOCAL_STORAGE_KEY } from '../../consts';
import { GameProvider, useGame } from '../../context/game.context';
import { SharedProvider } from '../../context/shared.context';
import { getItem } from '../../utils/localStorage';

function Game() {
    const { playerName, board, isGameOver, isGameWon,
        isPlayerLeft, currentTurn, usedKeys, isLoading,
        opponentNickname, opponentBoard, roomId,
        solution, handleKeyPress, resetGame } = useGame();

    useEffect(() => {
        document.addEventListener('keyup', handleKeyPress);
        return () => {
            document.removeEventListener('keyup', handleKeyPress);
        }
    }, [handleKeyPress]);

    const closeDialog = () => {
        resetGame();
    }

    if (isLoading) {
        return <p>Looking for an opponent...</p>
    }

    return <div key={roomId}>
        {(isGameOver || isPlayerLeft) && <GameOverDialog isWon={isGameWon} isPlayerLeft={isPlayerLeft} solution={solution} onClick={closeDialog} />}
        <div className='boards'>
            <Board board={board} nickname={playerName} currentTurn={currentTurn} />
            <Board board={opponentBoard} nickname={opponentNickname} />
        </div>
        <Keyboard usedKeys={usedKeys} />
    </div>
}

export default function GameWrapper() {
    const playerName = JSON.parse(getItem(LOCAL_STORAGE_KEY) as string);

    return <SharedProvider>
        <GameProvider playerName={playerName}>
            <Game />
        </GameProvider>
    </SharedProvider>
}