import React, { useEffect, useState } from 'react';
import { FormatLettersOptions, GameSquare, UsedKey } from '../types';
import { VALID_GUESSES } from '../validGuesses';
import useWebSocket from '../hooks/useWebSocket';
import { useShared } from './shared.context';
import { MAX_TURNS, createNewBoard } from '../consts';
import useWordle from '../hooks/useWordle';

const GameContext = React.createContext<UseGameDataReturnType | null>(null);

const useGameData = (name: string) => {
    const { solution, isLoading, opponentNickname, opponentBoard, roomId,
        isGameOver, isGameWon, isPlayerLeft, updateGameState, setIsLoading } = useShared();
    const { sendMessage } = useWebSocket(name);
    const { formatLetters, formatUsedKey } = useWordle();

    const [playerName] = useState(name);
    const [board, setBoard] = useState<GameSquare[][]>([[]]);
    const [usedKeys, setUsedKeys] = useState<UsedKey[] | null>(null);
    const [currentTurn, setCurrentTurn] = useState(0);
    const [currentGuess, setCurrentGuess] = useState('');

    useEffect(() => initBoard(), []);

    const insertLetter = (char: string) => {
        const updatedBoard = board.map(row => row.slice());
        updatedBoard[currentTurn][currentGuess.length].value = char;

        setCurrentGuess((prevGuess) => prevGuess + char);
        setBoard(updatedBoard);
    }

    const deleteLetter = () => {
        const updatedBoard = board.map(row => row.slice());
        updatedBoard[currentTurn][currentGuess.length - 1].value = '';

        setCurrentGuess((prevGuess) => prevGuess.slice(0, -1));
        setBoard(updatedBoard);
    }

    const checkGuess = () => {
        if (currentGuess.length !== 5) {
            // alert 'Not enough letters'
            return;
        }

        if (!VALID_GUESSES.includes(currentGuess)) {
            // alert 'Word not found'
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
    }

    const handleKeyPress = (event: KeyboardEvent) => {
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
    };

    const initBoard = () => {
        const playerBoard = createNewBoard();
        setBoard(playerBoard);
    }

    const onGameWon = () => {
        setTimeout(() => {
            sendMessage('game_over', { roomId, isWon: true });
            updateGameState({ isWon: true});
        }, 1200);
    }

    const onGameLost = () => {
        setTimeout(() => {
            sendMessage('game_over', { roomId, isWon: false });
            updateGameState({ isWon: false});
        }, 1200);
    }

    const onGameMove = (guess: GameSquare[]) => {
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
    }

    const resetGame = () => {
        const board = createNewBoard();

        setIsLoading(true);
        setCurrentTurn(0);
        setCurrentGuess('');
        setUsedKeys([]);
        setBoard(board);
        //setOpponentBoard(board);

        sendMessage('reset_game', { name: playerName})
    }

    return {
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
        roomId,
        solution,
        handleKeyPress,
        resetGame
    }
}

type UseGameDataReturnType = ReturnType<typeof useGameData>;

type Props = {
    playerName: string;
    children: React.ReactNode;
}

export const GameProvider = ({ playerName, children }: Props) => {
    return <GameContext.Provider value={useGameData(playerName)}>
        {children}
    </GameContext.Provider>
}

export const useGame = () => React.useContext(GameContext)!;