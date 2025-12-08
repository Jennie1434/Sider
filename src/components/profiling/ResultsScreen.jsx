import { motion } from 'framer-motion';
import { RotateCcw, CheckCircle2 } from 'lucide-react';

export default function ResultsScreen({ scores, onRestart }) {
  const { albert, eugenia } = scores;
  
  let profile;
  let color;
  let message;
  let mention;
  let matchPercentage;

  if (albert > eugenia) {
    profile = 'THE ANALYST';
    color = 'blue';
    message = 'Vous êtes un architecte de la croissance. Pour vous, l\'intuition n\'est rien sans la donnée. Vous structurez, optimisez et pérennisez.';
    mention = 'Match Albert School : 95%';
    matchPercentage = 95;
  } else if (eugenia > albert) {
    profile = 'THE INNOVATOR';
    color = 'purple';
    message = 'Vous êtes un explorateur. L\'IA est votre pinceau, le marché votre toile. Vous privilégiez la vitesse, le risque et l\'impact viral.';
    mention = 'Match Eugenia School : 95%';
    matchPercentage = 95;
  } else {
    profile = 'THE EXPLORER';
    color = 'gray';
    message = 'Profil hybride rare. Vous savez alterner entre rigueur structurelle et vision créative selon les besoins.';
    mention = 'Double Compatibilité';
    matchPercentage = 50;
  }

  const colorClasses = {
    blue: {
      border: 'border-blue-500/50',
      bg: 'bg-blue-500/10',
      gradient: 'from-blue-500 to-blue-600',
      text: 'text-blue-400'
    },
    purple: {
      border: 'border-purple-500/50',
      bg: 'bg-purple-500/10',
      gradient: 'from-purple-500 to-pink-500',
      text: 'text-purple-400'
    },
    gray: {
      border: 'border-slate-500/50',
      bg: 'bg-slate-500/10',
      gradient: 'from-slate-400 to-slate-500',
      text: 'text-slate-400'
    }
  };

  const styles = colorClasses[color];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className={`
          bg-[#13151F] border ${styles.border} rounded-xl p-8 mb-6
        `}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
          className="mb-6"
        >
          <CheckCircle2 className={`w-16 h-16 ${styles.text} mx-auto`} />
        </motion.div>

        <h1 className={`text-4xl font-bold mb-4 bg-gradient-to-r ${styles.gradient} bg-clip-text text-transparent`}>
          PROFIL : {profile}
        </h1>

        <p className="text-slate-300 text-lg mb-6 leading-relaxed max-w-lg mx-auto">
          {message}
        </p>

        <div className={`
          inline-flex items-center gap-2 px-4 py-2 rounded-lg ${styles.bg}
        `}>
          <span className={`${styles.text} font-medium`}>
            {mention}
          </span>
        </div>

        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ delay: 0.6, duration: 1, ease: 'easeOut' }}
          className="mt-8 h-2 bg-white/5 rounded-full overflow-hidden"
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${matchPercentage}%` }}
            transition={{ delay: 0.8, duration: 1, ease: 'easeOut' }}
            className={`h-full bg-gradient-to-r ${styles.gradient} rounded-full`}
          />
        </motion.div>

        <div className="mt-6 flex gap-4 justify-center text-sm text-slate-500">
          <span>Albert: {albert}</span>
          <span>•</span>
          <span>Eugenia: {eugenia}</span>
        </div>
      </motion.div>

      <motion.button
        onClick={onRestart}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="inline-flex items-center gap-2 px-6 py-3 bg-[#13151F] border border-white/10 rounded-xl text-white font-medium hover:border-indigo-500/50 transition-all"
      >
        <RotateCcw className="w-5 h-5" />
        REFAIRE LE TEST
      </motion.button>
    </motion.div>
  );
}

