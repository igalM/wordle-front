import Snackbar from '@mui/material/Snackbar';
import React, { createContext, useState } from 'react';

type SnackBarContextReturnType = {
    showSnackBar: (text: string) => void;
};

export const SnackBarContext = createContext<SnackBarContextReturnType | null>(null);

type Props = {
    children: React.ReactNode;
}

export const SnackBarProvider = ({ children }: Props) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');

    const showSnackBar = (text: string) => {
        setMessage(text);
        setIsOpen(true);
    };

    const handleClose = () => {
        setIsOpen(false);
    };

    return (
        <SnackBarContext.Provider value={{ showSnackBar }}>
            <Snackbar
                className="toast"
                open={isOpen}
                autoHideDuration={3000}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                onClose={handleClose}>
                <p>{message}</p>
            </Snackbar>
            {children}
        </SnackBarContext.Provider>
    );
};