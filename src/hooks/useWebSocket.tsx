import { useEffect, useState } from 'react';
import socketIO from 'socket.io-client';
import { GameMove, GameSquare, GameStart } from '../types';

const socket = socketIO('http://localhost:8081');

export default function useWebSocket(playerName?: string) {
    const [solution, setSolution] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [opponentNickname, setOpponentNickname] = useState('');
    const [opponentRow, setOpponentRow] = useState<{ row: GameSquare[], turn: number }>({ row: [], turn: 0 });
    const [roomId, setRoomId] = useState('');

    const onConnect = () => {
        //console.log('connected');
    }

    const onDisconnect = () => {
        //setIsLoading(true);
    }

    const onStartGame = ({ name, roomId, word }: GameStart) => {
        setIsLoading(false);
        setOpponentNickname(name);
        setRoomId(roomId);
        setSolution(word);
    }

    const onMessage = ({ row, turn }: GameMove) => {
        setOpponentRow({ row, turn });
    }

    const sendMessage = (event: string, payload: any) => {
        socket.emit(event, payload);
    }

    useEffect(() => {
        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);
        socket.on('start_game', onStartGame);
        socket.on('message', onMessage);

        if (playerName) {
            sendMessage('join_room', { name: playerName });
        }

        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
            socket.off('start_game', onStartGame);
            socket.off('message', onMessage);
        };
    }, [playerName]);

    return { sendMessage, solution, isLoading, opponentNickname, roomId, opponentRow };
}