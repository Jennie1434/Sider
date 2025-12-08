import { createContext, useContext, useState } from 'react';

const GameContext = createContext(null);

export const GameProvider = ({ children }) => {
  const [currentPhase, setCurrentPhase] = useState('INTRO');
  const [scores, setScores] = useState({ albert: 0, eugenia: 0 });
  const [gameData, setGameData] = useState({
    productConcept: null,
    strategy: null,
    dataProblem: null,
    automation: null
  });

  const updateScore = (type, value) => {
    setScores(prev => ({
      ...prev,
      [type]: prev[type] + value
    }));
  };

  const updateGameData = (key, value) => {
    setGameData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const nextPhase = () => {
    const phases = ['INTRO', 'IA', 'BUSINESS', 'DATA', 'NOCODE', 'RESULT'];
    const currentIndex = phases.indexOf(currentPhase);
    if (currentIndex < phases.length - 1) {
      setCurrentPhase(phases[currentIndex + 1]);
    }
  };

  const resetGame = () => {
    setCurrentPhase('INTRO');
    setScores({ albert: 0, eugenia: 0 });
    setGameData({
      productConcept: null,
      strategy: null,
      dataProblem: null,
      automation: null
    });
  };

  return (
    <GameContext.Provider
      value={{
        currentPhase,
        setCurrentPhase,
        scores,
        updateScore,
        gameData,
        updateGameData,
        nextPhase,
        resetGame
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }
  return context;
};


