import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../../contexts/GameContext';
import { TrendingUp, Users, ArrowRight, CheckCircle } from 'lucide-react';

const STRATEGIES = [
  {
    id: 'albert',
    title: 'High Margin Skimming',
    description: 'Prix élevé, Ciblage par Data, Ads agressives.',
    kpi: 'Profitabilité',
    score: 1,
    icon: TrendingUp,
    color: 'indigo'
  },
  {
    id: 'eugenia',
    title: 'Community Drop',
    description: 'Prix coûtant, Liste d\'attente, Créateurs de contenu.',
    kpi: 'Engagement',
    score: 1,
    icon: Users,
    color: 'purple'
  }
];

export default function PhaseBusiness() {
  const { gameData, updateScore, updateGameData, nextPhase } = useGame();
  const [selectedStrategy, setSelectedStrategy] = useState(null);
  const [validated, setValidated] = useState(false);

  const handleSelectStrategy = (strategy) => {
    setSelectedStrategy(strategy);
  };

  const handleValidate = () => {
    if (selectedStrategy) {
      updateScore(selectedStrategy.id, selectedStrategy.score);
      updateGameData('strategy', selectedStrategy);
      setValidated(true);
    }
  };

  const handleContinue = () => {
    nextPhase();
  };

  return (
    <div className="fixed inset-0 w-screen h-screen bg-[#0B0C15] text-slate-100 overflow-y-auto">
      <div className="max-w-6xl mx-auto px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <TrendingUp className="h-8 w-8 text-indigo-400" />
            PHASE 2 : MARKET STRATEGY
          </h2>
          <p className="text-slate-400">Définissez la stratégie de vente</p>
        </motion.div>

        {/* Rappel du produit */}
        {gameData.productConcept && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-6 bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl"
          >
            <p className="text-sm text-slate-400 mb-2">Produit à lancer :</p>
            <p className="text-xl font-semibold text-indigo-400">
              {gameData.productConcept.name}
            </p>
            <p className="text-slate-300 mt-2">
              {gameData.productConcept.description}
            </p>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {!validated ? (
            <motion.div
              key="selection"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="grid md:grid-cols-2 gap-6">
                {STRATEGIES.map((strategy, index) => {
                  const Icon = strategy.icon;
                  const isSelected = selectedStrategy?.id === strategy.id;
                  
                  return (
                    <motion.button
                      key={strategy.id}
                      onClick={() => handleSelectStrategy(strategy)}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`relative p-8 rounded-xl border-2 text-left transition-all ${
                        isSelected
                          ? strategy.color === 'indigo'
                            ? 'border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/20'
                            : 'border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/20'
                          : 'border-slate-700 bg-slate-900/50 backdrop-blur-sm hover:border-slate-600'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <Icon
                          className={`h-10 w-10 ${
                            strategy.color === 'indigo'
                              ? 'text-indigo-400'
                              : 'text-purple-400'
                          }`}
                        />
                        {isSelected && (
                          <CheckCircle
                            className={`h-6 w-6 ${
                              strategy.color === 'indigo'
                                ? 'text-indigo-400'
                                : 'text-purple-400'
                            }`}
                          />
                        )}
                      </div>
                      <h3 className="text-2xl font-bold text-slate-100 mb-3">
                        {strategy.title}
                      </h3>
                      <p className="text-slate-300 mb-4 leading-relaxed">
                        {strategy.description}
                      </p>
                      <div className="mt-4 pt-4 border-t border-slate-700">
                        <p className="text-sm text-slate-400 mb-1">KPI visé</p>
                        <p
                          className={`text-lg font-semibold ${
                            strategy.color === 'indigo'
                              ? 'text-indigo-400'
                              : 'text-purple-400'
                          }`}
                        >
                          {strategy.kpi}
                        </p>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {selectedStrategy && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-center"
                >
                  <motion.button
                    onClick={handleValidate}
                    className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg text-white font-semibold flex items-center gap-3 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    VALIDER LA STRATÉGIE
                    <CheckCircle className="h-5 w-5" />
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="validated"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <div className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 backdrop-blur-sm border border-indigo-500/30 rounded-xl p-8">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle className="h-6 w-6 text-green-400" />
                  <h3 className="text-2xl font-bold text-slate-100">
                    Stratégie Validée
                  </h3>
                </div>
                <div className="space-y-4">
                  <h4 className="text-3xl font-bold text-indigo-400">
                    {selectedStrategy.title}
                  </h4>
                  <p className="text-slate-300 leading-relaxed">
                    {selectedStrategy.description}
                  </p>
                  <div className="mt-6 bg-slate-900/50 rounded-lg p-4">
                    <p className="text-sm text-slate-400 mb-1">KPI Principal</p>
                    <p className="text-2xl font-bold text-indigo-400">
                      {selectedStrategy.kpi}
                    </p>
                  </div>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex justify-center"
              >
                <motion.button
                  onClick={handleContinue}
                  className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg text-white font-semibold flex items-center gap-3 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  ANALYSER LES RÉSULTATS
                  <ArrowRight className="h-5 w-5" />
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

