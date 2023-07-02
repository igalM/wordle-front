import React, { useCallback, useState } from 'react';
import { GameMove, GameSquare, GameStart } from '../types';
import { createNewBoard } from '../consts';

export const SharedContext = React.createContext<SharedContextReturnType | null>(null);

type SharedContextReturnType = {
    solution: string,
    isLoading: boolean,
    opponentNickname: string,
    opponentBoard: GameSquare[][],
    opponentCurrentTurn: number,
    roomId: string,
    isGameOver: boolean,
    isGameWon: boolean,
    isPlayerLeft: boolean,
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setOpponentBoard: React.Dispatch<React.SetStateAction<GameSquare[][]>>,
    startGame: ({ name, roomId, word }: GameStart) => void,
    updateOpponentBoard: ({ row, turn }: GameMove) => void,
    updateGameState: ({ isWon }: { isWon: boolean }) => void,
    updatePlayerLeft: () => void
}

type Props = {
    children: React.ReactNode;
}

export const SharedProvider = ({ children }: Props) => {
    const [solution, setSolution] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [opponentNickname, setOpponentNickname] = useState('');
    const [opponentBoard, setOpponentBoard] = useState<GameSquare[][]>([[]]);
    const [opponentCurrentTurn, setOpponentCurrentTurn] = useState<number>(0);
    const [roomId, setRoomId] = useState('');
    const [isGameWon, setIsGameWon] = useState(false);
    const [isGameOver, setIsGameOver] = useState(false);
    const [isPlayerLeft, setIsPlayerLeft] = useState(false);

    const startGame = useCallback(({ name, roomId, word }: GameStart) => {
        const board = createNewBoard();
        setOpponentBoard(board);
        setIsLoading(false);
        setOpponentNickname(name);
        setIsGameOver(false);
        setIsGameWon(false);
        setIsPlayerLeft(false);
        setOpponentCurrentTurn(0);
        setRoomId(roomId);
        setSolution(word);
    }, []);

    const updateOpponentBoard = useCallback(({ row, turn }: GameMove) => {
        setOpponentBoard(board => {
            const updatedBoard = board.map(row => row.slice());
            updatedBoard[turn] = row;
            return updatedBoard;
        });
        setOpponentCurrentTurn(prevTurn => prevTurn + 1);
    }, []);

    const updateGameState = useCallback(({ isWon }: { isWon: boolean }) => {
        if (isWon) {
            setIsGameOver(true);
            setIsGameWon(true);
        } else {
            setIsGameOver(true);
            setIsGameWon(false);
        }
    }, []);

    const updatePlayerLeft = useCallback(() => {
        setIsPlayerLeft(true);
    }, []);

    return <SharedContext.Provider value={{
        solution,
        isLoading,
        opponentNickname,
        opponentBoard,
        opponentCurrentTurn,
        roomId,
        isGameOver,
        isGameWon,
        isPlayerLeft,
        setIsLoading,
        setOpponentBoard,
        startGame,
        updateOpponentBoard,
        updateGameState,
        updatePlayerLeft
    }}>
        {children}
    </SharedContext.Provider>
}