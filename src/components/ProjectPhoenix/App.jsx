import { AnimatePresence } from 'framer-motion';
import { useGame } from '../../contexts/GameContext';
import Intro from './Intro';
import PhaseIA from './PhaseIA';
import PhaseBusiness from './PhaseBusiness';
import PhaseData from './PhaseData';
import PhaseNoCode from './PhaseNoCode';
import Result from './Result';

export default function ProjectPhoenixApp() {
  const { currentPhase } = useGame();

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <AnimatePresence mode="wait">
        {currentPhase === 'INTRO' && (
          <Intro key="intro" />
        )}
        {currentPhase === 'IA' && (
          <PhaseIA key="ia" />
        )}
        {currentPhase === 'BUSINESS' && (
          <PhaseBusiness key="business" />
        )}
        {currentPhase === 'DATA' && (
          <PhaseData key="data" />
        )}
        {currentPhase === 'NOCODE' && (
          <PhaseNoCode key="nocode" />
        )}
        {currentPhase === 'RESULT' && (
          <Result key="result" />
        )}
      </AnimatePresence>
    </div>
  );
}
