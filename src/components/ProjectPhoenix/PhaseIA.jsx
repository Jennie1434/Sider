import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../../contexts/GameContext';
import { 
  CheckCircle, 
  ArrowRight,
  Bell,
  FileText,
  Image as ImageIcon,
  Volume2,
  Database,
  Brain,
  AlertCircle,
  Send,
  TrendingUp
} from 'lucide-react';

const STEPS = {
  INTRO: 'INTRO',
  CHOIX_IA: 'CHOIX_IA',
  CHOIX_DATA: 'CHOIX_DATA',
  CHOIX_LOGIQUE: 'CHOIX_LOGIQUE',
  RESULTAT: 'RESULTAT'
};

const AI_MODELS = [
  {
    id: 'text',
    label: 'IA GÉNÉRATIVE DE TEXTE (LLM)',
    description: 'Analyse sémantique, synthèse, rédaction.',
    icon: FileText,
    correct: true,
    type: 'albert'
  },
  {
    id: 'image',
    label: 'IA GÉNÉRATION D\'IMAGE',
    description: 'Création de visuels, logos, designs.',
    icon: ImageIcon,
    correct: false
  },
  {
    id: 'audio',
    label: 'IA AUDIO / VOCALE',
    description: 'Text-to-Speech, clonage de voix.',
    icon: Volume2,
    correct: false
  }
];

const DATA_SOURCES = [
  {
    id: 'reviews',
    label: 'SOURCE A : Reviews Utilisateurs',
    count: '500 avis',
    tag: 'Haute Valeur / Bruité',
    description: 'Avis réels sur l\'App Store. Beaucoup de bruit mais des insights pépites.',
    icon: Database
  },
  {
    id: 'ministere',
    label: 'SOURCE B : Rapport Ministère de l\'Éducation',
    count: 'Données officielles',
    tag: 'Fiable / Généraliste',
    description: 'Données officielles. Très fiable mais date de l\'an dernier.',
    icon: FileText
  },
  {
    id: 'tiktok',
    label: 'SOURCE C : TikTok Analytics',
    count: 'Trends virales',
    tag: 'Volatile / Tendance',
    description: 'Trends virales de la semaine. Peu stable pour une stratégie long terme.',
    icon: TrendingUp
  }
];

const LOGIC_MODES = [
  {
    id: 'strategie',
    label: 'MODE STRATÉGIE',
    output: '3 Recommandations Business concrètes.',
    icon: Brain,
    type: 'eugenia'
  },
  {
    id: 'synthese',
    label: 'MODE SYNTHÈSE',
    output: 'Résumé exécutif en 4 lignes.',
    icon: FileText,
    type: 'albert'
  },
  {
    id: 'comparatif',
    label: 'MODE ANALYSE COMPARATIVE',
    output: 'Tableau comparatif des segments.',
    icon: TrendingUp,
    type: 'albert'
  }
];

export default function PhaseIA() {
  const { updateScore, updateGameData, nextPhase } = useGame();
  const [step, setStep] = useState(STEPS.INTRO);
  const [selectedAI, setSelectedAI] = useState(null);
  const [selectedData, setSelectedData] = useState([]);
  const [selectedLogic, setSelectedLogic] = useState(null);
  const [showAIWarning, setShowAIWarning] = useState(false);

  // Toggle data source (max 2)
  const handleDataToggle = (sourceId) => {
    if (selectedData.includes(sourceId)) {
      setSelectedData(selectedData.filter(id => id !== sourceId));
    } else {
      if (selectedData.length < 2) {
        setSelectedData([...selectedData, sourceId]);
      }
    }
  };

  // Passer à l'étape suivante
  const handleNext = () => {
    if (step === STEPS.INTRO) {
      setStep(STEPS.CHOIX_IA);
    } else if (step === STEPS.CHOIX_IA) {
      if (!selectedAI || !AI_MODELS.find(m => m.id === selectedAI)?.correct) {
        setShowAIWarning(true);
        return;
      }
      setShowAIWarning(false);
      setStep(STEPS.CHOIX_DATA);
    } else if (step === STEPS.CHOIX_DATA && selectedData.length > 0) {
      setStep(STEPS.CHOIX_LOGIQUE);
    } else if (step === STEPS.CHOIX_LOGIQUE && selectedLogic) {
      // Calculer les scores
      const aiModel = AI_MODELS.find(m => m.id === selectedAI);
      if (aiModel?.type) {
        updateScore(aiModel.type, 1);
      }
      
      const logicMode = LOGIC_MODES.find(m => m.id === selectedLogic);
      if (logicMode?.type) {
        updateScore(logicMode.type, 0.5);
      }
      
      // Sauvegarder les données
      updateGameData('productConcept', {
        ai: selectedAI,
        data: selectedData,
        logic: selectedLogic
      });
      
      setStep(STEPS.RESULTAT);
    }
  };

  // Continuer vers Business
  const handleContinue = () => {
    nextPhase();
  };

  // Générer le rapport
  const generateReport = () => {
    const sources = selectedData.map(id => {
      const source = DATA_SOURCES.find(s => s.id === id);
      return source?.label.split(':')[1]?.trim() || '';
    }).filter(Boolean);
    
    return {
      sources: sources.join(' + '),
      trends: [
        {
          title: 'Hyper-Personnalisation',
          desc: 'Les utilisateurs rejettent les parcours linéaires.'
        },
        {
          title: 'Micro-Learning',
          desc: 'La demande explose pour les formats < 3 minutes.'
        },
        {
          title: 'Gamification Sociale',
          desc: 'Apprendre seul ne suffit plus, ils veulent défier leurs amis.'
        }
      ]
    };
  };

  const report = selectedData.length > 0 ? generateReport() : null;

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0B0C15] p-6">
      <motion.div
        key={step}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-4xl bg-[#13151f] border border-white/5 rounded-2xl p-12 shadow-2xl"
      >
        <AnimatePresence mode="wait">
          {/* ÉTAPE 0 : INTRO */}
          {step === STEPS.INTRO && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-amber-500/10 rounded-lg">
                  <Bell className="h-6 w-6 text-amber-400" />
                </div>
                <h1 className="text-xl font-medium text-white">NOUVELLE NOTIFICATION - CEO</h1>
              </div>

              <div className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.06] rounded-xl p-8 space-y-4">
                <p className="text-slate-300 leading-relaxed">
                  Le client arrive dans <span className="text-white font-medium">1h</span> pour la démo. On n'a rien préparé.
                </p>
                <p className="text-slate-300 leading-relaxed">
                  Sors-moi une analyse rapide des tendances du marché des <span className="text-white font-medium">'Apps Éducatives'</span>.
                </p>
                <p className="text-slate-400 italic">
                  L'IA doit produire un livrable court et actionnable. GO.
                </p>
              </div>

              <motion.button
                onClick={handleNext}
                className="w-full px-6 py-3 bg-[#6366f1] hover:bg-[#4f46e5] border border-[#6366f1]/20 rounded-xl text-white font-medium transition-all flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                OUVRIR LA CONSOLE IA
                <ArrowRight className="h-4 w-4" />
              </motion.button>
            </motion.div>
          )}

          {/* ÉTAPE 1 : CHOIX IA */}
          {step === STEPS.CHOIX_IA && (
            <motion.div
              key="choix-ia"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div>
                <h1 className="text-2xl font-medium text-white mb-2">1. QUEL MODÈLE ACTIVER ?</h1>
                <p className="text-slate-400">Choisissez l'IA adaptée à une analyse de tendances.</p>
              </div>

              <div className="space-y-4">
                {AI_MODELS.map((model) => {
                  const Icon = model.icon;
                  const isSelected = selectedAI === model.id;
                  
                  return (
                    <motion.button
                      key={model.id}
                      onClick={() => {
                        setSelectedAI(model.id);
                        setShowAIWarning(false);
                      }}
                      className={`w-full p-6 rounded-xl border text-left transition-all ${
                        isSelected
                          ? model.correct
                            ? 'border-green-500/50 bg-green-500/10'
                            : 'border-rose-500/50 bg-rose-500/10'
                          : 'border-white/10 hover:border-indigo-400/50 bg-white/[0.02] backdrop-blur-xl'
                      }`}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <div className="flex items-start gap-4">
                        <Icon className={`h-6 w-6 mt-1 flex-shrink-0 ${
                          isSelected
                            ? model.correct ? 'text-green-400' : 'text-rose-400'
                            : 'text-slate-400'
                        }`} />
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-white mb-1">{model.label}</h3>
                          <p className="text-sm text-slate-400">{model.description}</p>
                        </div>
                        {isSelected && (
                          model.correct ? (
                            <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                          ) : (
                            <AlertCircle className="h-5 w-5 text-rose-400 flex-shrink-0" />
                          )
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {showAIWarning && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl"
                >
                  <p className="text-sm text-rose-400 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    Ce modèle ne peut pas analyser des tendances.
                  </p>
                </motion.div>
              )}

              {selectedAI && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-end pt-4"
                >
                  <motion.button
                    onClick={handleNext}
                    className="px-6 py-3 bg-[#6366f1] hover:bg-[#4f46e5] border border-[#6366f1]/20 rounded-xl text-white font-medium text-sm transition-all flex items-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    SUIVANT
                    <ArrowRight className="h-4 w-4" />
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* ÉTAPE 2 : CHOIX DATA */}
          {step === STEPS.CHOIX_DATA && (
            <motion.div
              key="choix-data"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div>
                <h1 className="text-2xl font-medium text-white mb-2">2. NOURRIR L'IA</h1>
                <p className="text-slate-400">Sélectionnez 2 sources pertinentes et fiables maximum.</p>
              </div>

              <div className="space-y-4">
                {DATA_SOURCES.map((source) => {
                  const Icon = source.icon;
                  const isSelected = selectedData.includes(source.id);
                  const isDisabled = !isSelected && selectedData.length >= 2;
                  
                  return (
                    <motion.button
                      key={source.id}
                      onClick={() => handleDataToggle(source.id)}
                      disabled={isDisabled}
                      className={`w-full p-6 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'border-indigo-500/50 bg-indigo-500/10'
                          : isDisabled
                          ? 'border-white/5 bg-slate-800/20 opacity-50 cursor-not-allowed'
                          : 'border-white/10 hover:border-indigo-400/50 bg-white/[0.02] backdrop-blur-xl'
                      }`}
                      whileHover={!isDisabled ? { scale: 1.01 } : {}}
                      whileTap={!isDisabled ? { scale: 0.99 } : {}}
                    >
                      <div className="flex items-start gap-4">
                        <Icon className={`h-6 w-6 mt-1 flex-shrink-0 ${
                          isSelected ? 'text-indigo-400' : 'text-slate-400'
                        }`} />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-medium text-white">{source.label}</h3>
                            {isSelected && (
                              <CheckCircle className="h-4 w-4 text-indigo-400" />
                            )}
                          </div>
                          <span className="inline-block px-2 py-0.5 bg-slate-800 rounded text-xs text-slate-400 mb-2">
                            {source.tag}
                          </span>
                          <p className="text-sm text-slate-400">{source.description}</p>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {selectedData.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-end pt-4"
                >
                  <motion.button
                    onClick={handleNext}
                    className="px-6 py-3 bg-[#6366f1] hover:bg-[#4f46e5] border border-[#6366f1]/20 rounded-xl text-white font-medium text-sm transition-all flex items-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    SUIVANT
                    <ArrowRight className="h-4 w-4" />
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* ÉTAPE 3 : CHOIX LOGIQUE */}
          {step === STEPS.CHOIX_LOGIQUE && (
            <motion.div
              key="choix-logique"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div>
                <h1 className="text-2xl font-medium text-white mb-2">3. MODE DE TRAITEMENT</h1>
                <p className="text-slate-400">Comment l'IA doit-elle structurer la réponse ?</p>
              </div>

              <div className="space-y-4">
                {LOGIC_MODES.map((mode) => {
                  const Icon = mode.icon;
                  const isSelected = selectedLogic === mode.id;
                  
                  return (
                    <motion.button
                      key={mode.id}
                      onClick={() => setSelectedLogic(mode.id)}
                      className={`w-full p-6 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'border-indigo-500/50 bg-indigo-500/10'
                          : 'border-white/10 hover:border-indigo-400/50 bg-white/[0.02] backdrop-blur-xl'
                      }`}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <div className="flex items-start gap-4">
                        <Icon className={`h-6 w-6 mt-1 flex-shrink-0 ${
                          isSelected ? 'text-indigo-400' : 'text-slate-400'
                        }`} />
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-white mb-1">{mode.label}</h3>
                          <p className="text-sm text-slate-400">Output : {mode.output}</p>
                        </div>
                        {isSelected && (
                          <CheckCircle className="h-5 w-5 text-indigo-400 flex-shrink-0" />
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {selectedLogic && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-end pt-4"
                >
                  <motion.button
                    onClick={handleNext}
                    className="px-6 py-3 bg-[#6366f1] hover:bg-[#4f46e5] border border-[#6366f1]/20 rounded-xl text-white font-medium text-sm transition-all flex items-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    GÉNÉRER LE RAPPORT
                    <ArrowRight className="h-4 w-4" />
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* ÉTAPE 4 : RÉSULTAT */}
          {step === STEPS.RESULTAT && report && (
            <motion.div
              key="resultat"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div>
                <h1 className="text-2xl font-medium text-white mb-2">RAPPORT GÉNÉRÉ</h1>
                <p className="text-slate-400">Livrable prêt pour la démo</p>
              </div>

              {/* Rapport */}
              <div className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.06] rounded-xl p-8">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-medium text-white mb-4">ANALYSE DE MARCHÉ : APPS ÉDUCATIVES</h2>
                    <div className="h-px bg-white/10 mb-6" />
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span>Analyse basée sur : <span className="text-white">{report.sources}</span></span>
                    </div>
                    
                    <div className="pt-4">
                      <h3 className="text-lg font-medium text-white mb-4">TENDANCES IDENTIFIÉES :</h3>
                      <div className="space-y-4">
                        {report.trends.map((trend, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <span className="text-indigo-400 font-medium mt-0.5">{index + 1}.</span>
                            <div>
                              <p className="text-white font-medium mb-1">
                                <strong>{trend.title} :</strong>
                              </p>
                              <p className="text-slate-300 text-sm">{trend.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-6 border-t border-white/10">
                    <p className="text-xs text-slate-500">
                      Indice sauvegardé pour la phase Business.
                    </p>
                  </div>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-end pt-4"
              >
                <motion.button
                  onClick={handleContinue}
                  className="px-6 py-3 bg-[#6366f1] hover:bg-[#4f46e5] border border-[#6366f1]/20 rounded-xl text-white font-medium text-sm transition-all flex items-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Send className="h-4 w-4" />
                  ENVOYER AU CEO & PASSER AU BUSINESS
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
