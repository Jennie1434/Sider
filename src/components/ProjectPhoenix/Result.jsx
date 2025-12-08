import { motion } from 'framer-motion';
import { useGame } from '../../contexts/GameContext';
import { Award, Sparkles, TrendingUp, BarChart3, Workflow, RotateCcw } from 'lucide-react';

export default function Result() {
  const { scores, gameData, resetGame } = useGame();

  const getBadge = () => {
    if (scores.albert > scores.eugenia) {
      return {
        title: 'ARCHITECTE SYSTÈME',
        subtitle: 'Profil Albert',
        description: 'Vous transformez le chaos en ordre par la logique et la data.',
        color: 'indigo',
        icon: TrendingUp
      };
    } else if (scores.eugenia > scores.albert) {
      return {
        title: 'VISIONNAIRE CRÉATIF',
        subtitle: 'Profil Eugenia',
        description: 'Vous utilisez la tech pour amplifier l\'émotion et l\'humain.',
        color: 'purple',
        icon: Sparkles
      };
    } else {
      return {
        title: 'HYBRIDE RARE',
        subtitle: 'Équilibre Parfait',
        description: 'Vous maîtrisez à la fois la logique technique et la créativité humaine.',
        color: 'pink',
        icon: Award
      };
    }
  };

  const badge = getBadge();
  const Icon = badge.icon;

  return (
    <div className="fixed inset-0 w-screen h-screen bg-[#0B0C15] text-slate-100 overflow-y-auto">
      <div className="max-w-4xl mx-auto px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-8"
        >
          {/* Badge Principal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={`backdrop-blur-sm border-2 rounded-2xl p-12 shadow-2xl ${
              badge.color === 'indigo'
                ? 'bg-gradient-to-br from-indigo-900/20 to-indigo-800/20 border-indigo-500/30'
                : badge.color === 'purple'
                ? 'bg-gradient-to-br from-purple-900/20 to-purple-800/20 border-purple-500/30'
                : 'bg-gradient-to-br from-pink-900/20 to-pink-800/20 border-pink-500/30'
            }`}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col items-center space-y-6"
            >
              <div className={`p-6 rounded-full ${
                badge.color === 'indigo'
                  ? 'bg-indigo-500/20'
                  : badge.color === 'purple'
                  ? 'bg-purple-500/20'
                  : 'bg-pink-500/20'
              }`}>
                <Icon className={`h-16 w-16 ${
                  badge.color === 'indigo'
                    ? 'text-indigo-400'
                    : badge.color === 'purple'
                    ? 'text-purple-400'
                    : 'text-pink-400'
                }`} />
              </div>
              <div>
                <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {badge.title}
                </h1>
                <p className="text-xl text-slate-400">{badge.subtitle}</p>
              </div>
              <p className="text-lg text-slate-300 max-w-2xl leading-relaxed">
                {badge.description}
              </p>
            </motion.div>
          </motion.div>

          {/* Scores */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid md:grid-cols-2 gap-6"
          >
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-indigo-400">
                  Score Albert
                </h3>
                <TrendingUp className="h-6 w-6 text-indigo-400" />
              </div>
              <p className="text-4xl font-bold text-slate-100">
                {scores.albert}
              </p>
              <div className="mt-4 h-2 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(scores.albert / (scores.albert + scores.eugenia || 1)) * 100}%` }}
                  transition={{ duration: 1, delay: 0.8 }}
                  className="h-full bg-indigo-500"
                />
              </div>
            </div>

            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-purple-400">
                  Score Eugenia
                </h3>
                <Sparkles className="h-6 w-6 text-purple-400" />
              </div>
              <p className="text-4xl font-bold text-slate-100">
                {scores.eugenia}
              </p>
              <div className="mt-4 h-2 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(scores.eugenia / (scores.albert + scores.eugenia || 1)) * 100}%` }}
                  transition={{ duration: 1, delay: 0.8 }}
                  className="h-full bg-purple-500"
                />
              </div>
            </div>
          </motion.div>

          {/* Résumé du Parcours */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-8"
          >
            <h3 className="text-2xl font-bold mb-6 text-slate-200">
              Votre Parcours
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {gameData.productConcept && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Sparkles className="h-4 w-4" />
                    <span>Produit</span>
                  </div>
                  <p className="text-slate-200 font-semibold">
                    {gameData.productConcept.name}
                  </p>
                </div>
              )}
              {gameData.strategy && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <TrendingUp className="h-4 w-4" />
                    <span>Stratégie</span>
                  </div>
                  <p className="text-slate-200 font-semibold">
                    {gameData.strategy.title}
                  </p>
                </div>
              )}
              {gameData.dataProblem && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <BarChart3 className="h-4 w-4" />
                    <span>Problème</span>
                  </div>
                  <p className="text-slate-200 font-semibold">
                    {gameData.dataProblem.label}
                  </p>
                </div>
              )}
              {gameData.automation && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Workflow className="h-4 w-4" />
                    <span>Solution</span>
                  </div>
                  <p className="text-slate-200 font-semibold">
                    {gameData.automation.title}
                  </p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Bouton Rejouer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="flex justify-center"
          >
            <motion.button
              onClick={resetGame}
              className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg text-white font-semibold flex items-center gap-3 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RotateCcw className="h-5 w-5" />
              REJOUER
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

