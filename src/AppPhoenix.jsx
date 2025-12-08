import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { GameProvider } from './contexts/GameContext';
import ProjectPhoenixApp from './components/ProjectPhoenix/App';
import WelcomeScreen from './components/WelcomeScreen';

function App() {
  const [showWelcome, setShowWelcome] = useState(true);

  const handleStart = () => {
    setShowWelcome(false);
  };

  return (
    <div className="fixed inset-0 w-screen h-screen bg-[#0B0C15] font-sans antialiased overflow-hidden">
      <div className="max-w-[1400px] mx-auto h-screen flex flex-col">
        <AnimatePresence mode="wait">
          {showWelcome ? (
            <WelcomeScreen key="welcome" onStart={handleStart} />
          ) : (
            <GameProvider key="game">
              <ProjectPhoenixApp />
            </GameProvider>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;
