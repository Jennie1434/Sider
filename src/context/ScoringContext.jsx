import React, { createContext, useContext, useState, useCallback } from 'react';

const ScoringContext = createContext();

export const useScoring = () => {
  const context = useContext(ScoringContext);
  if (!context) {
    throw new Error('useScoring must be used within ScoringProvider');
  }
  return context;
};

export const ScoringProvider = ({ children }) => {
  const [scoreAlbert, setScoreAlbert] = useState(0);
  const [scoreEugenia, setScoreEugenia] = useState(0);
  const [scoringHistory, setScoringHistory] = useState([]);

  const addScore = useCallback((albert, eugenia, reason) => {
    setScoreAlbert(prev => {
      const newScore = prev + albert;
      console.log(`📊 Score Albert: ${prev} + ${albert} = ${newScore} (${reason})`);
      return newScore;
    });
    setScoreEugenia(prev => {
      const newScore = prev + eugenia;
      console.log(`📊 Score Eugenia: ${prev} + ${eugenia} = ${newScore} (${reason})`);
      return newScore;
    });
    setScoringHistory(prev => [...prev, { albert, eugenia, reason, timestamp: Date.now() }]);
  }, []);

  const resetScores = useCallback(() => {
    setScoreAlbert(0);
    setScoreEugenia(0);
    setScoringHistory([]);
    console.log('🔄 Scores réinitialisés');
  }, []);

  const getFinalProfile = useCallback(() => {
    if (scoreAlbert > scoreEugenia) {
      return 'Albert';
    } else if (scoreEugenia > scoreAlbert) {
      return 'Eugenia';
    } else {
      return 'Neutre';
    }
  }, [scoreAlbert, scoreEugenia]);

  const value = {
    scoreAlbert,
    scoreEugenia,
    addScore,
    resetScores,
    getFinalProfile,
    scoringHistory
  };

  return (
    <ScoringContext.Provider value={value}>
      {children}
    </ScoringContext.Provider>
  );
};

