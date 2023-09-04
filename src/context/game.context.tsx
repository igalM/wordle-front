import React, { createContext, useCallback, useEffect, useState } from 'react';
import { FormatLettersOptions, GameSquare, UsedKey } from '../types';
import { VALID_GUESSES } from '../validGuesses';
import useWebSocket from '../hooks/useWebSocket';
import { MAX_TURNS, createNewBoard } from '../consts';
import useWordle from '../hooks/useWordle';
import useSnackBar from '../hooks/useSnackbar';
import useShared from '../hooks/useShared';

export const GameContext = createContext<GameContextReturnType | null>(null);

type GameContextReturnType = {
    playerName: string,
    board: GameSquare[][],
    usedKeys: UsedKey[] | null,
    currentTurn: number,
    isGameWon: boolean,
    isGameOver: boolean,
    isPlayerLeft: boolean,
    isLoading: boolean,
    opponentNickname: string,
    opponentBoard: GameSquare[][],
    opponentCurrentTurn: number,
    solution: string,
    shakeAnimation: boolean,
    handleKeyPress: (event: KeyboardEvent) => void,
    resetGame: () => void
}

type Props = {
    playerName: string;
    children: React.ReactNode;
}

export const GameProvider = ({ playerName, children }: Props) => {
    const { solution, isLoading, opponentNickname, opponentBoard,
        roomId, opponentCurrentTurn, isGameOver, isGameWon, isPlayerLeft,
        updateGameState, setIsLoading } = useShared();
    const { sendMessage } = useWebSocket(playerName);
    const { formatLetters, formatUsedKey } = useWordle();
    const { showSnackBar } = useSnackBar();

    const [board, setBoard] = useState<GameSquare[][]>([[]]);
    const [usedKeys, setUsedKeys] = useState<UsedKey[] | null>(null);
    const [currentTurn, setCurrentTurn] = useState(0);
    const [currentGuess, setCurrentGuess] = useState('');
    const [shakeAnimation, setShakeAnimation] = useState<boolean>(false);

    useEffect(() => initBoard(), []);

    const insertLetter = useCallback((char: string) => {
        const updatedBoard = board.map(row => row.slice());
        updatedBoard[currentTurn][currentGuess.length].value = char;

        setCurrentGuess((prevGuess) => prevGuess + char);
        setBoard(updatedBoard);
    }, [board, currentGuess, currentTurn]);

    const deleteLetter = useCallback(() => {
        const updatedBoard = board.map(row => row.slice());
        updatedBoard[currentTurn][currentGuess.length - 1].value = '';

        setCurrentGuess((prevGuess) => prevGuess.slice(0, -1));
        setBoard(updatedBoard);
    }, [board, currentGuess, currentTurn]);

    const initBoard = () => {
        const playerBoard = createNewBoard();
        setBoard(playerBoard);
    }

    const onGameWon = useCallback(() => {
        setTimeout(() => {
            sendMessage('game_over', { roomId, isWon: true });
            updateGameState({ isWon: true });
        }, 1200);
    }, [roomId, sendMessage, updateGameState]);

    const onGameLost = useCallback(() => {
        setTimeout(() => {
            sendMessage('game_over', { roomId, isWon: false });
            updateGameState({ isWon: false });
        }, 1200);
    }, [roomId, sendMessage, updateGameState]);

    const onGameMove = useCallback((guess: GameSquare[]) => {
        setTimeout(() => {
            setCurrentGuess('');
            setCurrentTurn((prevTurn) => prevTurn + 1);
            setUsedKeys((prevUsedKeys) => {
                const newKeys = [...prevUsedKeys || []];
                guess.forEach(item => {
                    const usedKeyIndex = newKeys.findIndex(usedKey => usedKey.char === item.value);
                    if (usedKeyIndex > 0) {
                        newKeys[usedKeyIndex] = formatUsedKey(newKeys[usedKeyIndex], item.bgColor);
                    } else {
                        newKeys.push({ char: item.value, bgColor: item.bgColor });
                    }
                });
                return newKeys;
            });
        }, 1200);
    }, [formatUsedKey]);

    const resetGame = () => {
        const board = createNewBoard();

        setIsLoading(true);
        setCurrentTurn(0);
        setCurrentGuess('');
        setUsedKeys([]);
        setBoard(board);

        sendMessage('reset_game', { name: playerName })
    }

    const checkGuess = useCallback(() => {
        if (currentGuess.length !== 5) {
            showSnackBar('Not enough letters');
            setShakeAnimation(true);
            setTimeout(() => setShakeAnimation(false), 800);
            return;
        }

        if (!VALID_GUESSES.includes(currentGuess)) {
            showSnackBar('Not in word list');
            setShakeAnimation(true);
            setTimeout(() => setShakeAnimation(false), 800);
            return;
        }

        const formatOptions: FormatLettersOptions = {
            board,
            solution,
            guess: currentGuess,
            turn: currentTurn
        }
        const formattedRow = formatLetters(formatOptions);

        const updatedBoard = board.map(row => row.slice());
        updatedBoard[currentTurn] = formattedRow;

        setBoard(updatedBoard);
        sendMessage('message', {
            roomId,
            turn: currentTurn,
            row: formattedRow.map(cell => ({ ...cell, value: '' }))
        });

        if (formattedRow.every(item => item.bgColor === 'green')) {
            return onGameWon();
        }

        if (MAX_TURNS === currentTurn + 1) {
            return onGameLost();
        }

        return onGameMove(formattedRow);
    }, [board, currentGuess, currentTurn, formatLetters, onGameLost, onGameMove, onGameWon, roomId, sendMessage, showSnackBar, solution]);

    const handleKeyPress = useCallback((event: KeyboardEvent) => {
        if (currentTurn === MAX_TURNS) {
            return;
        }

        const key = String(event.key);

        if (key === 'Backspace' && currentGuess.length) {
            return deleteLetter();
        }

        if (key === 'Enter') {
            return checkGuess();
        }

        if (key.match(/^[a-z]$/) && currentGuess.length !== 5) {
            return insertLetter(key);
        }
    }, [checkGuess, currentTurn, deleteLetter, insertLetter, currentGuess]);

    return <GameContext.Provider value={{
        playerName,
        board,
        usedKeys,
        currentTurn,
        isGameWon,
        isGameOver,
        isPlayerLeft,
        isLoading,
        opponentNickname,
        opponentBoard,
        opponentCurrentTurn,
        solution,
        shakeAnimation,
        handleKeyPress,
        resetGame
    }}>
        {children}
    </GameContext.Provider>
}