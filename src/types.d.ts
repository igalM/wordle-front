export interface GameSquare {
    value: string;
    bgColor: string;
}

export interface UsedKey {
    char: string;
    bgColor: string;
}

export interface GameStart {
    name: string;
    roomId: string;
    word: string;
}

export interface GameMove {
    row: GameSquare[];
    turn: number;
}