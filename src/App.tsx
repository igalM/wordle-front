import './App.css'
import Game from './components/game/Game';
import { useState } from 'react';
import WelcomeDialog from './dialogs/welcome-dialog/WelcomeDialog';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const lightTheme = createTheme({
  palette: {
    mode: 'light',
  },
});

function App() {
  const [isWelcomeDialogOpen, setIsWelcomeDialogOpen] = useState(true);

  const closeDialog = () => {
    setIsWelcomeDialogOpen(false);
  }

  return (
      <ThemeProvider theme={lightTheme}>
        <CssBaseline />
        <div className='container'>
        {
          isWelcomeDialogOpen ? <WelcomeDialog onClick={closeDialog} /> : <Game />
        }
      </div>
      </ThemeProvider>
  )
}

export default App;
