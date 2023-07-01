import { Dialog, DialogContent, DialogTitle, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { Button } from '@mui/base';
import { LOCAL_STORAGE_KEY } from '../../consts';
import { getItem, removeItem, setItem } from '../../utils/localStorage';

type Props = {
    onClick: () => void;
}

export default function WelcomeDialog({ onClick }: Props) {
    const [nickname, setNickname] = useState('');
    const [isShowLogout, setIsShowLogout] = useState(false);

    useEffect(() => {
        const nickname = getItem(LOCAL_STORAGE_KEY);
        if (nickname) {
            setNickname(JSON.parse(nickname));
            setIsShowLogout(true);
        }
    }, []);

    const logout = () => {
        setNickname('');
        setIsShowLogout(false);
        removeItem(LOCAL_STORAGE_KEY);
    }

    const startGame = () => {
        const nicknameExists = getItem(LOCAL_STORAGE_KEY);
        if(!nicknameExists) {
            setItem(LOCAL_STORAGE_KEY, nickname);
        }
        onClick();
    }

    return <Dialog open>
        <DialogTitle>Multiplayer Mode</DialogTitle>
        <DialogContent>
            <p>
                You have to guess the word in 6 tries and do it faster than your random opponent.
                You can see your opponent's progress on the adjacent board. The one who guesses the word the fastest wins!
            </p>
            {
                isShowLogout
                    ? <p>You are logged in as {nickname} <span onClick={logout}>[Quit]</span></p>
                    : (
                        <>
                            <h4>Enter your nickname</h4>
                            <TextField variant="outlined" placeholder="Your nickname..." value={nickname} onChange={(e) => setNickname(e.target.value)} />
                        </>
                    )
            }
            <Button disabled={!nickname.length} onClick={startGame}>START THE GAME</Button>
        </DialogContent>
    </Dialog>
}