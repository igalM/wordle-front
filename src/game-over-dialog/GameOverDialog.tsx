import { Button, Dialog, DialogContent, DialogTitle } from "@mui/material";

type Props = {
    isWon: boolean,
    solution: string,
    onClick: () => void
}

export default function GameOverDialog({ isWon, solution, onClick }: Props) {
    return <Dialog open>
    <DialogTitle>Game Over</DialogTitle>
    <DialogContent>
       <p>You {isWon ? 'won' : 'lost'} the game!</p>
       <p>The word was <b>{solution}</b></p>
        <Button onClick={onClick}>PLAY AGAIN</Button>
    </DialogContent>
</Dialog>
}