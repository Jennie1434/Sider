import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Share2, Heart } from 'lucide-react';

const choices = [
  {
    id: 'albert',
    title: 'LA RÉTENTION (Albert)',
    description: 'Est-ce que les utilisateurs reviennent ? (Cohortes, Churn).',
    icon: TrendingUp,
    score: { albert: 1, eugenia: 0 }
  },
  {
    id: 'eugenia',
    title: 'LA VIRALITÉ (Eugenia)',
    description: 'Est-ce que les utilisateurs en parlent ? (K-Factor, Partages).',
    icon: Share2,
    score: { albert: 0, eugenia: 1 }
  },
  {
    id: 'neutral',
    title: 'LA SATISFACTION (Neutre)',
    description: 'Sont-ils contents ? (Note moyenne, NPS).',
    icon: Heart,
    score: { albert: 0, eugenia: 0 }
  }
];

export default function PhaseData({ onComplete }) {
  const [selected, setSelected] = useState(null);

  const handleChoice = (choice) => {
    setSelected(choice.id);
    setTimeout(() => {
      onComplete(choice.score);
    }, 500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl font-bold text-white mb-3">
        ÉTAPE 3 : DATA (LE KPI)
      </h2>
      <p className="text-slate-400 mb-8 text-lg">
        Le lancement est fait. Quel indicateur regardez-vous le lundi matin ?
      </p>

      <div className="space-y-4">
        <AnimatePresence>
          {choices.map((choice, index) => {
            const Icon = choice.icon;
            const isSelected = selected === choice.id;
            
            return (
              <motion.div
                key={choice.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                onClick={() => !selected && handleChoice(choice)}
                className={`
                  bg-[#13151F] border rounded-xl p-6 cursor-pointer transition-all
                  ${isSelected 
                    ? 'border-indigo-500/50 bg-indigo-500/10' 
                    : 'border-white/10 hover:border-indigo-500/50'
                  }
                  ${selected && !isSelected ? 'opacity-50' : ''}
                `}
                whileHover={!selected ? { scale: 1.02 } : {}}
                whileTap={!selected ? { scale: 0.98 } : {}}
              >
                <div className="flex items-start gap-4">
                  <div className={`
                    p-3 rounded-lg flex-shrink-0
                    ${choice.id === 'albert' ? 'bg-blue-500/20 text-blue-400' : ''}
                    ${choice.id === 'eugenia' ? 'bg-purple-500/20 text-purple-400' : ''}
                    ${choice.id === 'neutral' ? 'bg-slate-500/20 text-slate-400' : ''}
                  `}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold mb-2">{choice.title}</h3>
                    <p className="text-slate-400 text-sm">{choice.description}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}


