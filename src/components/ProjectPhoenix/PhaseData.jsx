import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../../contexts/GameContext';
import { BarChart3, AlertCircle, ArrowRight, CheckCircle } from 'lucide-react';

const METRICS = [
  { id: 'visits', label: 'Visites', value: 12500, color: 'indigo' },
  { id: 'signups', label: 'Inscriptions', value: 3200, color: 'purple' },
  { id: 'trials', label: 'Essais', value: 1800, color: 'pink' },
  { id: 'conversions', label: 'Conversions', value: 450, color: 'rose' },
  { id: 'retention', label: 'Rétention', value: 280, color: 'orange' }
];

const PROBLEMS = [
  {
    id: 'tech',
    label: 'Temps de chargement',
    value: '2.8s',
    type: 'albert',
    score: 1,
    description: 'Performance technique à optimiser'
  },
  {
    id: 'human',
    label: 'Score Net Promoter',
    value: '32',
    type: 'eugenia',
    score: 1,
    description: 'Satisfaction utilisateur faible'
  }
];

export default function PhaseData() {
  const { gameData, updateScore, updateGameData, nextPhase } = useGame();
  const [hoveredMetric, setHoveredMetric] = useState(null);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [validated, setValidated] = useState(false);

  // Générer les données basées sur la stratégie
  const getDataBasedOnStrategy = () => {
    if (gameData.strategy?.id === 'albert') {
      // High Margin = Profit élevé mais rétention basse
      return {
        profit: '€125K',
        retention: '12%',
        problem: 'Rétention faible malgré les conversions'
      };
    } else if (gameData.strategy?.id === 'eugenia') {
      // Community = Engagement élevé mais conversions faibles
      return {
        profit: '€45K',
        retention: '68%',
        problem: 'Engagement fort mais monétisation faible'
      };
    } else {
      // Par défaut
      return {
        profit: '€85K',
        retention: '40%',
        problem: 'Analyse en cours...'
      };
    }
  };

  const dashboardData = getDataBasedOnStrategy();

  const handleMetricHover = (metricId) => {
    setHoveredMetric(metricId);
  };

  const handleProblemSelect = (problem) => {
    setSelectedProblem(problem);
  };

  const handleValidate = () => {
    if (selectedProblem) {
      updateScore(selectedProblem.type, selectedProblem.score);
      updateGameData('dataProblem', selectedProblem);
      setValidated(true);
    }
  };

  const handleContinue = () => {
    nextPhase();
  };

  // Trouver l'anomalie (la métrique avec la plus grande chute)
  const anomalyMetric = METRICS.find(m => m.id === 'retention');

  return (
    <div className="fixed inset-0 w-screen h-screen bg-[#0B0C15] text-slate-100 overflow-y-auto">
      <div className="max-w-6xl mx-auto px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-indigo-400" />
            PHASE 3 : CRASH ANALYZER
          </h2>
          <p className="text-slate-400">Analysez les résultats du lancement</p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!validated ? (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              {/* Dashboard Summary */}
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-6">
                  <p className="text-sm text-slate-400 mb-2">Profitabilité</p>
                  <p className="text-3xl font-bold text-indigo-400">
                    {dashboardData.profit}
                  </p>
                </div>
                <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-6">
                  <p className="text-sm text-slate-400 mb-2">Rétention</p>
                  <p className="text-3xl font-bold text-purple-400">
                    {dashboardData.retention}
                  </p>
                </div>
                <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-6">
                  <p className="text-sm text-slate-400 mb-2">Problème</p>
                  <p className="text-lg font-semibold text-rose-400">
                    {dashboardData.problem}
                  </p>
                </div>
              </div>

              {/* Funnel Graphique */}
              <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-8">
                <h3 className="text-xl font-semibold mb-6 text-slate-200">
                  Funnel de Conversion
                </h3>
                <div className="space-y-4">
                  {METRICS.map((metric, index) => {
                    const percentage = (metric.value / METRICS[0].value) * 100;
                    const isAnomaly = metric.id === anomalyMetric?.id;
                    const isHovered = hoveredMetric === metric.id;

                    return (
                      <motion.div
                        key={metric.id}
                        onMouseEnter={() => handleMetricHover(metric.id)}
                        onMouseLeave={() => handleMetricHover(null)}
                        className="relative"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="flex items-center gap-4 mb-2">
                          <span className="text-sm text-slate-400 w-24">
                            {metric.label}
                          </span>
                          <div className="flex-1 relative">
                            <div
                              className={`h-8 rounded-lg transition-all ${
                                isAnomaly
                                  ? 'bg-red-500'
                                  : metric.color === 'indigo'
                                  ? 'bg-gradient-to-r from-indigo-500 to-indigo-600'
                                  : metric.color === 'purple'
                                  ? 'bg-gradient-to-r from-purple-500 to-purple-600'
                                  : metric.color === 'pink'
                                  ? 'bg-gradient-to-r from-pink-500 to-pink-600'
                                  : metric.color === 'rose'
                                  ? 'bg-gradient-to-r from-rose-500 to-rose-600'
                                  : 'bg-gradient-to-r from-orange-500 to-orange-600'
                              } ${isHovered ? 'opacity-100' : 'opacity-80'}`}
                              style={{ width: `${percentage}%` }}
                            >
                              {isHovered && (
                                <motion.div
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  className="absolute right-0 top-full mt-2 px-3 py-1 bg-slate-800 rounded text-sm text-slate-200 whitespace-nowrap"
                                >
                                  {metric.value.toLocaleString()}
                                </motion.div>
                              )}
                            </div>
                          </div>
                          <span className="text-sm font-mono text-slate-300 w-20 text-right">
                            {metric.value.toLocaleString()}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="mt-6 text-sm text-rose-400 flex items-center gap-2"
                >
                  <AlertCircle className="h-4 w-4" />
                  Survolez les barres pour trouver l'anomalie rouge
                </motion.p>
              </div>

              {/* Dilemme d'Analyse */}
              <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-8">
                <h3 className="text-xl font-semibold mb-6 text-slate-200">
                  Dilemme d'Analyse
                </h3>
                <p className="text-slate-400 mb-6">
                  Quel problème identifiez-vous comme prioritaire ?
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  {PROBLEMS.map((problem, index) => {
                    const isSelected = selectedProblem?.id === problem.id;
                    return (
                      <motion.button
                        key={problem.id}
                        onClick={() => handleProblemSelect(problem)}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-6 rounded-xl border-2 text-left transition-all ${
                          isSelected
                            ? problem.type === 'albert'
                              ? 'border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/20'
                              : 'border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/20'
                            : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="text-xl font-bold text-slate-200">
                            {problem.label}
                          </h4>
                          {isSelected && (
                            <CheckCircle
                              className={`h-6 w-6 ${
                                problem.type === 'albert'
                                  ? 'text-indigo-400'
                                  : 'text-purple-400'
                              }`}
                            />
                          )}
                        </div>
                        <p className="text-3xl font-bold text-indigo-400 mb-2">
                          {problem.value}
                        </p>
                        <p className="text-sm text-slate-400">
                          {problem.description}
                        </p>
                      </motion.button>
                    );
                  })}
                </div>

                {selectedProblem && (
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
                      VALIDER L'ANALYSE
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
              <div className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 backdrop-blur-sm border border-indigo-500/30 rounded-xl p-8">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle className="h-6 w-6 text-green-400" />
                  <h3 className="text-2xl font-bold text-slate-100">
                    Problème Identifié
                  </h3>
                </div>
                <div className="space-y-4">
                  <h4 className="text-3xl font-bold text-indigo-400">
                    {selectedProblem.label}
                  </h4>
                  <p className="text-slate-300 leading-relaxed">
                    {selectedProblem.description}
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
                  AUTOMATISER LA SOLUTION
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

