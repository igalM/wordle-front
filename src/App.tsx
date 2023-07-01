import './App.css'
import Game from './components/game/Game';
import { useState } from 'react';
import WelcomeDialog from './dialogs/welcome-dialog/WelcomeDialog';

function App() {
  const [isWelcomeDialogOpen, setIsWelcomeDialogOpen] = useState(true);

  const closeDialog = () => {
    setIsWelcomeDialogOpen(false);
  }

  return (
      <div className='container'>
        {
          isWelcomeDialogOpen ? <WelcomeDialog onClick={closeDialog} /> : <Game />
        }
      </div>
  )
}

export default App;
