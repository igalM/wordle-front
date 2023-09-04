import { FormatLettersOptions, UsedKey } from "../types";

export default function useWordle() {
    
    const formatLetters = (options: FormatLettersOptions) => {
        const { solution, guess } = options;
        
        const solutionArray = [...solution];
        const formattedGuess = [...guess].map(l => ({value: l, bgColor: 'gray'}));

        formattedGuess.forEach((square, i) => {
            if(solutionArray[i] === square.value) {
                formattedGuess[i].bgColor = 'green';
                solutionArray[i] = '_';
            }
        });

        formattedGuess.forEach((square, i) => {
        if(solutionArray.includes(square.value) && square.bgColor !== 'green') {
            formattedGuess[i].bgColor = 'yellow';
            solutionArray[solutionArray.indexOf(square.value)] = '_';
        }
        });

        return formattedGuess;


        // return board[turn].map((square, index) => {
        //     if (guess[index] === solution[index]) {
        //         return {
        //             ...square,
        //             bgColor: 'green'
        //         }
        //     }

        //     if (solution.includes(guess[index]) && solution.charAt(index) === guess[index]) {
        //         return {
        //             ...square,
        //             bgColor: 'yellow'
        //         }
        //     }

        //     return {
        //         ...square,
        //         bgColor: 'gray'
        //     }
        // });
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