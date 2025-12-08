import { motion } from 'framer-motion';
import { useGame } from '../../contexts/GameContext';
import { Rocket } from 'lucide-react';

export default function Intro() {
  const { nextPhase } = useGame();

  return (
    <div className="fixed inset-0 w-screen h-screen bg-[#0B0C15] flex items-center justify-center overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="max-w-3xl mx-auto px-8 text-center space-y-8"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="text-6xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            PROJECT PHOENIX
          </h1>
          <div className="h-1 w-32 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto rounded-full" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="space-y-6"
        >
          <p className="text-xl text-slate-300 font-light leading-relaxed">
            Bienvenue.
          </p>
          <p className="text-2xl text-slate-200 font-medium">
            La startup <span className="text-purple-400">ECHO</span> coule.
          </p>
          <p className="text-lg text-slate-400 leading-relaxed">
            Vous avez <span className="text-indigo-400 font-semibold">4 étapes</span> pour lancer le modèle{' '}
            <span className="text-purple-400 font-semibold">PHOENIX</span>.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <motion.button
            onClick={nextPhase}
            className="group relative px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg text-white font-semibold text-lg shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all flex items-center gap-3 mx-auto"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Rocket className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            LANCER LA MISSION
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}

