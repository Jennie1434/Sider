import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../../contexts/GameContext';
import { Workflow, Zap, Mail, ArrowRight, CheckCircle } from 'lucide-react';

const AUTOMATIONS = [
  {
    id: 'albert',
    title: 'Auto-Refund & Discount Script',
    description: 'Logique automatisée de remboursement et réduction',
    type: 'albert',
    score: 1,
    icon: Zap,
    color: 'indigo'
  },
  {
    id: 'eugenia',
    title: 'Personalized Care Email Sequence',
    description: 'Séquence d\'emails personnalisés pour l\'engagement',
    type: 'eugenia',
    score: 1,
    icon: Mail,
    color: 'purple'
  }
];

export default function PhaseNoCode() {
  const { gameData, updateScore, updateGameData, nextPhase } = useGame();
  const [selectedAutomation, setSelectedAutomation] = useState(null);
  const [validated, setValidated] = useState(false);
  const [animationPlaying, setAnimationPlaying] = useState(false);

  const handleSelectAutomation = (automation) => {
    setSelectedAutomation(automation);
  };

  const handleValidate = () => {
    if (selectedAutomation) {
      updateScore(selectedAutomation.type, selectedAutomation.score);
      updateGameData('automation', selectedAutomation);
      setValidated(true);
      setAnimationPlaying(true);
      
      // Arrêter l'animation après 2 secondes
      setTimeout(() => {
        setAnimationPlaying(false);
      }, 2000);
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
            <Workflow className="h-8 w-8 text-indigo-400" />
            PHASE 4 : WORKFLOW BUILDER
          </h2>
          <p className="text-slate-400">Automatisez la solution au problème</p>
        </motion.div>

        {/* Rappel du problème */}
        {gameData.dataProblem && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-6 bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl"
          >
            <p className="text-sm text-slate-400 mb-2">Problème identifié :</p>
            <p className="text-xl font-semibold text-rose-400">
              {gameData.dataProblem.label} - {gameData.dataProblem.value}
            </p>
            <p className="text-slate-300 mt-2">
              {gameData.dataProblem.description}
            </p>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {!validated ? (
            <motion.div
              key="builder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              {/* Workflow Visual */}
              <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-8">
                <h3 className="text-xl font-semibold mb-6 text-slate-200">
                  Construire le Workflow
                </h3>
                
                <div className="flex items-center gap-6">
                  {/* Trigger (Fixe) */}
                  <div className="flex-1">
                    <div className="bg-indigo-500/20 border-2 border-indigo-500 rounded-lg p-6 text-center">
                      <Zap className="h-8 w-8 text-indigo-400 mx-auto mb-3" />
                      <h4 className="font-semibold text-slate-200 mb-2">
                        Alerte Problème Détecté
                      </h4>
                      <p className="text-sm text-slate-400">Trigger</p>
                    </div>
                  </div>

                  {/* Connection Line */}
                  <div className="relative w-16 h-1">
                    <div className="absolute inset-0 bg-slate-700 rounded-full" />
                    {selectedAutomation && (
                      <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                      />
                    )}
                    {selectedAutomation && (
                      <motion.div
                        initial={{ x: 0, opacity: 0 }}
                        animate={{ x: [0, 64, 0], opacity: [0, 1, 0] }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: 'linear'
                        }}
                        className="absolute top-1/2 left-0 w-3 h-3 bg-yellow-400 rounded-full -translate-y-1/2"
                      />
                    )}
                  </div>

                  {/* Action (À choisir) */}
                  <div className="flex-1">
                    {selectedAutomation ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-purple-500/20 border-2 border-purple-500 rounded-lg p-6 text-center"
                      >
                        {selectedAutomation.icon && (
                          <selectedAutomation.icon className="h-8 w-8 text-purple-400 mx-auto mb-3" />
                        )}
                        <h4 className="font-semibold text-slate-200 mb-2">
                          {selectedAutomation.title}
                        </h4>
                        <p className="text-sm text-slate-400">Action</p>
                      </motion.div>
                    ) : (
                      <div className="bg-slate-800/50 border-2 border-dashed border-slate-700 rounded-lg p-6 text-center">
                        <p className="text-slate-500 text-sm">
                          Sélectionnez une action
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Options d'Automation */}
              <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-8">
                <h3 className="text-xl font-semibold mb-6 text-slate-200">
                  Choisir l'Action
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {AUTOMATIONS.map((automation, index) => {
                    const Icon = automation.icon;
                    const isSelected = selectedAutomation?.id === automation.id;
                    
                    return (
                      <motion.button
                        key={automation.id}
                        onClick={() => handleSelectAutomation(automation)}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-6 rounded-xl border-2 text-left transition-all ${
                          isSelected
                            ? automation.color === 'indigo'
                              ? 'border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/20'
                              : 'border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/20'
                            : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <Icon
                            className={`h-10 w-10 ${
                              automation.color === 'indigo'
                                ? 'text-indigo-400'
                                : 'text-purple-400'
                            }`}
                          />
                          {isSelected && (
                            <CheckCircle
                              className={`h-6 w-6 ${
                                automation.color === 'indigo'
                                  ? 'text-indigo-400'
                                  : 'text-purple-400'
                              }`}
                            />
                          )}
                        </div>
                        <h4 className="text-xl font-bold text-slate-100 mb-2">
                          {automation.title}
                        </h4>
                        <p className="text-slate-300 text-sm">
                          {automation.description}
                        </p>
                      </motion.button>
                    );
                  })}
                </div>

                {selectedAutomation && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-center mt-6"
                  >
                    <motion.button
                      onClick={handleValidate}
                      className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg text-white font-semibold flex items-center gap-3 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      VALIDER LE WORKFLOW
                      <CheckCircle className="h-5 w-5" />
                    </motion.button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="validated"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              {/* Workflow avec animation */}
              <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-8">
                <div className="flex items-center gap-6">
                  <div className="flex-1">
                    <div className="bg-indigo-500/20 border-2 border-indigo-500 rounded-lg p-6 text-center">
                      <Zap className="h-8 w-8 text-indigo-400 mx-auto mb-3" />
                      <h4 className="font-semibold text-slate-200 mb-2">
                        Alerte Problème Détecté
                      </h4>
                      <p className="text-sm text-slate-400">Trigger</p>
                    </div>
                  </div>

                  <div className="relative w-16 h-1">
                    <div className="absolute inset-0 bg-slate-700 rounded-full" />
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                    />
                    {animationPlaying && (
                      <motion.div
                        initial={{ x: 0, opacity: 0 }}
                        animate={{ x: [0, 64, 0], opacity: [0, 1, 0] }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: 'linear'
                        }}
                        className="absolute top-1/2 left-0 w-3 h-3 bg-yellow-400 rounded-full -translate-y-1/2 shadow-lg shadow-yellow-400/50"
                      />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="bg-purple-500/20 border-2 border-purple-500 rounded-lg p-6 text-center">
                      {selectedAutomation.icon && (
                        <selectedAutomation.icon className="h-8 w-8 text-purple-400 mx-auto mb-3" />
                      )}
                      <h4 className="font-semibold text-slate-200 mb-2">
                        {selectedAutomation.title}
                      </h4>
                      <p className="text-sm text-slate-400">Action</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 backdrop-blur-sm border border-indigo-500/30 rounded-xl p-8">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle className="h-6 w-6 text-green-400" />
                  <h3 className="text-2xl font-bold text-slate-100">
                    Workflow Activé
                  </h3>
                </div>
                <div className="space-y-4">
                  <h4 className="text-3xl font-bold text-indigo-400">
                    {selectedAutomation.title}
                  </h4>
                  <p className="text-slate-300 leading-relaxed">
                    {selectedAutomation.description}
                  </p>
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
                  VOIR LES RÉSULTATS
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

