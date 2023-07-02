import { useEffect } from 'react';
import { socket } from '../utils/socket';
import useShared from './useShared';

export default function useWebSocket(playerName: string) {
    const { updateOpponentBoard, startGame, updateGameState, updatePlayerLeft } = useShared();

    const sendMessage = (event: string, payload: object) => {
        socket.emit(event, payload);
    }

    useEffect(() => {
        socket.connect();

        socket.on('start_game', startGame);
        socket.on('message', updateOpponentBoard);
        socket.on('game_over', updateGameState);
        socket.on('player_left', updatePlayerLeft);

        sendMessage('join_room', { name: playerName });

        return () => {
            socket.off('start_game', startGame);
            socket.off('message', updateOpponentBoard);
            socket.off('game_over', updateGameState);
            socket.off('player_left', updatePlayerLeft);
        };
    }, [playerName, startGame, updateGameState, updateOpponentBoard, updatePlayerLeft]);

    return { sendMessage };
}