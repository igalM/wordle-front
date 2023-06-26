import { useEffect, useState } from "react";
import { createNewBoard, MAX_TURNS } from "../consts";
import { VALID_GUESSES } from "../validGuesses";
import { GameSquare, UsedKey } from "../types";
import useWebSocket from "./useWebSocket";

export default function useWordle() {
    const { sendMessage, roomId, solution } = useWebSocket();
    const [board, setBoard] = useState<GameSquare[][]>([[]]);
    const [opponentBoard, setOpponentBoard] = useState<GameSquare[][]>([[]]);
    const [usedKeys, setUsedKeys] = useState<UsedKey[] | null>(null);
    const [currentTurn, setCurrentTurn] = useState(0);
    const [currentGuess, setCurrentGuess] = useState('');
    const [isGameWon, setIsGameWon] = useState(false);
    const [isGameOver, setIsGameOver] = useState(false);

    useEffect(() => initGame(), []);

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
        const formattedRow = formatLetters();

        const updatedBoard = board.map(row => row.slice());
        updatedBoard[currentTurn] = formattedRow;

        setBoard(updatedBoard);
        sendMessage('guess', { 
            roomId,
            turn: currentTurn, 
            row: formattedRow.map(cell => ({ ...cell, value: '' })) 
        });

        if (formattedRow.every(item => item.bgColor === 'green')) {
            setTimeout(() => {
                setIsGameOver(true);
                setIsGameWon(true);
            }, 1200);
            return;
        }

        if (MAX_TURNS === currentTurn + 1) {
            setTimeout(() => {
                setIsGameOver(true);
                setIsGameWon(false);
            }, 1200);
            return;
        }

        setTimeout(() => {
            setCurrentGuess('');
            setCurrentTurn((prevTurn) => prevTurn + 1);
            setUsedKeys((prevUsedKeys) => {
                const newKeys = [...prevUsedKeys || []];
                formattedRow.forEach(item => {
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

    const formatLetters = () => {
        return board[currentTurn].map((square, index) => {

            if (currentGuess[index] === solution[index]) {
                return {
                    ...square,
                    bgColor: 'green'
                }
            }

            if (solution.includes(currentGuess[index])) {
                return {
                    ...square,
                    bgColor: 'yellow'
                }
            }

            return {
                ...square,
                bgColor: 'gray'
            }
        });
    }

    const formatUsedKey = (oldKey: UsedKey, color: string) => {
        if (oldKey.bgColor === 'yellow' && color === 'green') {
            return {
                ...oldKey,
                bgColor: 'green'
            }
        }
        return oldKey;
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

    const setOpponentBoardFn = (row: GameSquare[], turn: number) => {
        const updatedBoard = opponentBoard.map(row => row.slice());
        updatedBoard[turn] = row;

        setOpponentBoard(updatedBoard);
    }

    const getGameBoard = () => {
        return createNewBoard();
    }

    const initGame = () => {
        const playerBoard = getGameBoard();
        const opponentBoard = getGameBoard();
        setBoard(playerBoard);
        setOpponentBoard(opponentBoard);
    }

    const resetGame = () => {
        setIsGameOver(false);
        setIsGameWon(false);
        setCurrentTurn(0);
        setCurrentGuess('');
        setUsedKeys([]);
        initGame();
    }

    return { resetGame, handleKeyPress, setOpponentBoardFn, board, opponentBoard, isGameOver, isGameWon, currentTurn, usedKeys, solution }
}