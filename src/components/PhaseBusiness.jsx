import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, 
  DollarSign, 
  Users, 
  TrendingUp, 
  Code, 
  Heart,
  Tag,
  Crown,
  Hand,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';

// Données des rounds
const ROUNDS = {
  problem: {
    id: 1,
    title: 'ROUND 1 : CHOISIS TON PROBLÈME',
    description: 'Quel problème veux-tu résoudre ?',
    choices: [
      {
        id: 'time',
        title: 'Perte de temps',
        description: 'Les utilisateurs perdent trop de temps sur des tâches répétitives',
        icon: Clock,
        emoji: '⏰'
      },
      {
        id: 'cost',
        title: 'Coût trop élevé',
        description: 'Les solutions existantes sont trop chères pour les petites entreprises',
        icon: DollarSign,
        emoji: '💰'
      },
      {
        id: 'complexity',
        title: 'Trop complexe',
        description: 'Les outils actuels sont difficiles à utiliser et nécessitent une formation',
        icon: AlertCircle,
        emoji: '🔧'
      },
      {
        id: 'isolation',
        title: 'Manque de connexion',
        description: 'Les équipes travaillent en silos sans communication efficace',
        icon: Users,
        emoji: '👥'
      }
    ]
  },
  solution: {
    id: 2,
    title: 'ROUND 2 : CHOISIS TA SOLUTION',
    description: 'Quelle approche privilégies-tu ?',
    choices: [
      {
        id: 'tech',
        title: 'Solution Tech',
        description: 'Automatisation intelligente avec IA et algorithmes avancés',
        icon: Code,
        emoji: '🤖'
      },
      {
        id: 'human',
        title: 'Solution Humaine',
        description: 'Plateforme de mise en relation avec des experts dédiés',
        icon: Heart,
        emoji: '💝'
      }
    ]
  },
  business: {
    id: 3,
    title: 'ROUND 3 : CHOISIS TON BUSINESS MODEL',
    description: 'Quel positionnement tarifaire ?',
    choices: [
      {
        id: 'lowcost',
        title: 'Low-cost',
        description: 'Prix accessible pour démocratiser l\'accès',
        icon: Tag,
        emoji: '🏷️',
        price: '9€/mois'
      },
      {
        id: 'premium',
        title: 'Premium',
        description: 'Tarif intermédiaire avec fonctionnalités avancées',
        icon: TrendingUp,
        emoji: '⭐',
        price: '49€/mois'
      },
      {
        id: 'luxe',
        title: 'Luxe',
        description: 'Offre haut de gamme avec support prioritaire',
        icon: Crown,
        emoji: '👑',
        price: '199€/mois'
      }
    ]
  },
  negotiation: {
    id: 4,
    title: 'FINAL BOSS : NÉGOCIATION',
    description: 'Un investisseur te propose une offre. Acceptes-tu ?',
    choices: [
      {
        id: 'offer',
        title: 'Offre : 500k€ pour 15%',
        description: 'Valuation de 3.3M€. Conditions : 3 ans de lock-up, droit de veto sur les décisions stratégiques.',
        icon: Hand,
        emoji: '🤝'
      }
    ]
  }
};

// Sharks avec leurs réactions
const SHARKS = [
  { id: 1, name: 'Marc', avatar: '👔', reactions: ['🤔 Hésitant', '🤩 Intéressé', '😤 Agacé', '💸 Prêt à investir'] },
  { id: 2, name: 'Sophie', avatar: '👩‍💼', reactions: ['🤔 Hésitant', '🤩 Intéressé', '😤 Agacé', '💸 Prêt à investir'] },
  { id: 3, name: 'Pierre', avatar: '🧑‍💻', reactions: ['🤔 Hésitant', '🤩 Intéressé', '😤 Agacé', '💸 Prêt à investir'] }
];

export default function PhaseBusiness({ onPhaseComplete, clueWon }) {
  const [currentRound, setCurrentRound] = useState('problem');
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [selectedSolution, setSelectedSolution] = useState(null);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [sharkMeter, setSharkMeter] = useState(50); // 0-100
  const [sharkReactions, setSharkReactions] = useState([0, 0, 0]); // Index de réaction pour chaque shark

  const round = ROUNDS[currentRound];

  // Calculer les réactions des sharks basées sur les choix
  const updateSharkReactions = (choice) => {
    // Logique simple : certains choix augmentent/diminuent l'intérêt
    let newMeter = sharkMeter;
    
    if (currentRound === 'problem') {
      if (choice.id === 'time' || choice.id === 'cost') {
        newMeter = Math.min(100, sharkMeter + 10);
      } else {
        newMeter = Math.max(0, sharkMeter - 5);
      }
    } else if (currentRound === 'solution') {
      if (choice.id === 'tech') {
        newMeter = Math.min(100, sharkMeter + 15);
      } else {
        newMeter = Math.max(0, sharkMeter - 10);
      }
    } else if (currentRound === 'business') {
      if (choice.id === 'premium') {
        newMeter = Math.min(100, sharkMeter + 20);
      } else if (choice.id === 'luxe') {
        newMeter = Math.min(100, sharkMeter + 10);
      } else {
        newMeter = Math.max(0, sharkMeter - 15);
      }
    }

    setSharkMeter(newMeter);
    
    // Mettre à jour les réactions des sharks
    const newReactions = sharkReactions.map(() => {
      if (newMeter >= 80) return 3; // Prêt à investir
      if (newMeter >= 60) return 1; // Intéressé
      if (newMeter >= 40) return 0; // Hésitant
      return 2; // Agacé
    });
    setSharkReactions(newReactions);
  };

  const handleChoice = (choice) => {
    // Enregistrer le choix selon le round
    if (currentRound === 'problem') {
      setSelectedProblem(choice);
    } else if (currentRound === 'solution') {
      setSelectedSolution(choice);
    } else if (currentRound === 'business') {
      setSelectedBusiness(choice);
    }

    // Mettre à jour les réactions
    updateSharkReactions(choice);

    // Passer au round suivant
    setTimeout(() => {
      if (currentRound === 'problem') {
        setCurrentRound('solution');
      } else if (currentRound === 'solution') {
        setCurrentRound('business');
      } else if (currentRound === 'business') {
        setCurrentRound('negotiation');
      } else {
        // Fin du jeu
        if (onPhaseComplete) {
          onPhaseComplete({
            albert: sharkMeter > 50 ? 1 : 0,
            eugenia: sharkMeter <= 50 ? 1 : 0,
            valuation: sharkMeter > 70 ? 500000 : sharkMeter > 50 ? 300000 : 100000
          });
        }
      }
    }, 1000);
  };

  const getSharkReaction = (sharkIndex) => {
    return SHARKS[sharkIndex].reactions[sharkReactions[sharkIndex]];
  };

  return (
    <div className="fixed inset-0 w-screen h-screen bg-slate-900 text-white font-sans flex overflow-hidden z-[9999]">
      {/* COLONNE GAUCHE (25%) - Le Contexte */}
      <div className="w-1/4 bg-slate-900 border-r border-white/10 p-6 flex flex-col">
        <h2 className="text-2xl font-bold mb-6 text-white">TA STARTUP</h2>
        
        {/* Choix précédents */}
        <div className="space-y-4 mb-6">
          {selectedProblem && (
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <p className="text-xs text-slate-400 mb-1">Problème choisi</p>
              <p className="text-sm font-semibold text-white">{selectedProblem.title}</p>
            </div>
          )}
          
          {selectedSolution && (
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <p className="text-xs text-slate-400 mb-1">Solution choisie</p>
              <p className="text-sm font-semibold text-white">{selectedSolution.title}</p>
            </div>
          )}
          
          {selectedBusiness && (
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <p className="text-xs text-slate-400 mb-1">Business Model</p>
              <p className="text-sm font-semibold text-white">{selectedBusiness.title}</p>
            </div>
          )}
        </div>

        {/* Shark-mètre */}
        <div className="mt-auto">
          <h3 className="text-lg font-semibold mb-3 text-white">SHARK-MÈTRE</h3>
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-400">Intérêt des investisseurs</span>
              <span className="text-lg font-bold text-white">{sharkMeter}%</span>
            </div>
            <div className="h-3 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${
                  sharkMeter >= 70 ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                  sharkMeter >= 50 ? 'bg-gradient-to-r from-yellow-500 to-amber-500' :
                  'bg-gradient-to-r from-red-500 to-orange-500'
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${sharkMeter}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* COLONNE CENTRALE (50%) - L'Action */}
      <div className="w-2/4 bg-slate-900 p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {/* Titre du Round */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl font-bold mb-3 text-white">{round.title}</h1>
            <p className="text-xl text-slate-400">{round.description}</p>
          </motion.div>

          {/* Grille de Cartes */}
          <div className={`grid gap-6 ${
            currentRound === 'negotiation' 
              ? 'grid-cols-1 max-w-2xl mx-auto' 
              : currentRound === 'solution'
              ? 'grid-cols-1 md:grid-cols-2 max-w-3xl mx-auto'
              : 'grid-cols-1 md:grid-cols-2'
          }`}>
            <AnimatePresence mode="wait">
              {round.choices.map((choice, index) => {
                const Icon = choice.icon;
                return (
                  <motion.button
                    key={choice.id}
                    onClick={() => handleChoice(choice)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-6 cursor-pointer transition-all hover:scale-105 text-left group"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex flex-col gap-4">
                      {/* Icône */}
                      <div className="flex items-center gap-4">
                        <div className="text-4xl">{choice.emoji}</div>
                        {Icon && (
                          <Icon className="h-8 w-8 text-indigo-400 group-hover:text-indigo-300 transition-colors" />
                        )}
                      </div>
                      
                      {/* Titre */}
                      <h3 className="text-2xl font-bold text-white">{choice.title}</h3>
                      
                      {/* Description */}
                      <p className="text-slate-300 leading-relaxed">{choice.description}</p>
                      
                      {/* Prix (si business model) */}
                      {choice.price && (
                        <div className="mt-2">
                          <span className="text-lg font-semibold text-indigo-400">{choice.price}</span>
                        </div>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* COLONNE DROITE (25%) - Les Sharks */}
      <div className="w-1/4 bg-slate-900 border-l border-white/10 p-6 flex flex-col">
        <h2 className="text-2xl font-bold mb-6 text-white">LES SHARKS</h2>
        
        <div className="space-y-6">
          {SHARKS.map((shark, index) => (
            <motion.div
              key={shark.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 rounded-lg p-4 border border-white/10"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="text-3xl">{shark.avatar}</div>
                <div>
                  <p className="font-semibold text-white">{shark.name}</p>
                  <p className="text-xs text-slate-400">Investisseur</p>
                </div>
              </div>
              
              {/* Réaction */}
              <motion.div
                key={sharkReactions[index]}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-sm text-slate-300 bg-white/5 rounded px-3 py-2"
              >
                {getSharkReaction(index)}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
