import './Game.css';
import Board from "../board/Board";
import Keyboard from "../keyboard/Keyboard";
import { useEffect } from 'react';
import GameOverDialog from '../../dialogs/game-over-dialog/GameOverDialog';
import { LOCAL_STORAGE_KEY } from '../../consts';
import { GameProvider } from '../../context/game.context';
import { SharedProvider } from '../../context/shared.context';
import { getItem } from '../../utils/localStorage';
import { SnackBarProvider } from '../../context/snackbar.context';
import useGame from '../../hooks/useGame';

function Game() {
    const { playerName, board, isGameOver, isGameWon,
        isPlayerLeft, currentTurn, usedKeys, isLoading,
        opponentNickname, opponentBoard, opponentCurrentTurn,
        solution, shakeAnimation, handleKeyPress, resetGame } = useGame();

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

    return <>
        {(isGameOver || isPlayerLeft) && <GameOverDialog isWon={isGameWon} isPlayerLeft={isPlayerLeft} solution={solution} onClick={closeDialog} />}
        <div className='boards'>
            <Board board={board} nickname={playerName} currentTurn={currentTurn} shakeAnimation={shakeAnimation} />
            <Board board={opponentBoard} nickname={opponentNickname} currentTurn={opponentCurrentTurn} isOpponent/>
        </div>
        <Keyboard usedKeys={usedKeys} />
    </>
}

export default function GameWrapper() {
    const playerName = JSON.parse(getItem(LOCAL_STORAGE_KEY) as string);

    return <SharedProvider>
        <SnackBarProvider>
            <GameProvider playerName={playerName}>
                <Game />
            </GameProvider>
        </SnackBarProvider>
    </SharedProvider>
}