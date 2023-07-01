import { Button, Dialog, DialogContent, DialogTitle } from "@mui/material";

type Props = {
    isWon: boolean,
    solution: string,
    isPlayerLeft: boolean,
    onClick: () => void
}

export default function GameOverDialog({ isWon, solution, isPlayerLeft, onClick }: Props) {
    return <Dialog open>
        <DialogTitle>{isPlayerLeft ? 'Opponent left' : 'Game Over'}</DialogTitle>
        <DialogContent>
            {!isPlayerLeft && <p>You {isWon ? 'won' : 'lost'} the game!</p>}
            {isPlayerLeft && <p>You won the game!</p>}
            <p>The word was <b>{solution}</b></p>
            <Button onClick={onClick}>PLAY AGAIN</Button>
        </DialogContent>
    </Dialog>
}