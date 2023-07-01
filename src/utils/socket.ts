import { io } from 'socket.io-client';

const URL = 'https://wordle-backend-71db5114721b.herokuapp.com/';

export const socket = io(URL, {
    autoConnect: false
});