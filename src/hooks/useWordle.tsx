import { FormatLettersOptions, UsedKey } from "../types";

export default function useWordle() {
    
    const formatLetters = (options: FormatLettersOptions) => {
        const { board, turn, solution, guess } = options;
        return board[turn].map((square, index) => {
            if (guess[index] === solution[index]) {
                return {
                    ...square,
                    bgColor: 'green'
                }
            }

            if (solution.includes(guess[index])) {
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

    return { formatLetters, formatUsedKey }
}