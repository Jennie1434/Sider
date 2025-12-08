import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Layout,
  AppWindow,
  FileSpreadsheet,
  Database,
  CreditCard,
  Wallet,
  ArrowRight,
  Rocket
} from 'lucide-react';

const springTransition = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
};

// ============================================
// THE ARCHITECT DESK - Jeu Unique & Massif
// ============================================
export default function PhaseNoCode({ onPhaseComplete }) {
  const [slots, setSlots] = useState([null, null, null]);
  const [showLaunch, setShowLaunch] = useState(false);

  const modules = [
    { id: 'wix', name: 'Wix', icon: Layout, category: 'frontend' },
    { id: 'bubble', name: 'Bubble', icon: AppWindow, category: 'frontend' },
    { id: 'excel', name: 'Excel', icon: FileSpreadsheet, category: 'backend' },
    { id: 'airtable', name: 'Airtable', icon: Database, category: 'backend' },
    { id: 'paypal', name: 'PayPal', icon: Wallet, category: 'payment' },
    { id: 'stripe', name: 'Stripe', icon: CreditCard, category: 'payment' },
  ];

  const slotCategories = ['frontend', 'backend', 'payment'];
  const slotLabels = ['FRONTEND (Interface)', 'BACKEND (Données)', 'PAIEMENT (Cash)'];

  const handleModuleClick = (module) => {
    // Trouver le premier slot vide
    const emptySlotIndex = slots.findIndex(slot => slot === null);
    
    if (emptySlotIndex === -1) return;
    
    // Vérifier si le module correspond à la catégorie du slot
    const targetCategory = slotCategories[emptySlotIndex];
    
    if (module.category === targetCategory) {
      const newSlots = [...slots];
      newSlots[emptySlotIndex] = module;
      setSlots(newSlots);
      
      // Si tous les slots sont remplis
      if (newSlots.every(slot => slot !== null)) {
        setTimeout(() => {
          setShowLaunch(true);
        }, 500);
      }
    }
  };

  const handleLaunch = () => {
    let score = { albert: 0, eugenia: 0 };
    
    // Stack "Maker" (Bubble + Airtable + Stripe)
    const isMakerStack = 
      slots[0]?.id === 'bubble' && 
      slots[1]?.id === 'airtable' && 
      slots[2]?.id === 'stripe';
    
    // Stack "Biz" (Wix + Excel + PayPal)
    const isBizStack = 
      slots[0]?.id === 'wix' && 
      slots[1]?.id === 'excel' && 
      slots[2]?.id === 'paypal';
    
    if (isMakerStack) {
      score.eugenia = 3;
    } else if (isBizStack) {
      score.albert = 3;
    } else {
      score.albert = 1;
      score.eugenia = 1;
    }
    
    if (onPhaseComplete) {
      onPhaseComplete(score);
    }
  };

  const isModuleUsed = (moduleId) => slots.some(slot => slot && slot.id === moduleId);
  const getNextSlotCategory = () => {
    const emptyIndex = slots.findIndex(slot => slot === null);
    return emptyIndex !== -1 ? slotCategories[emptyIndex] : null;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={springTransition}
      className="flex min-h-screen w-full items-center justify-center px-6 py-12"
      style={{
        backgroundImage: `
          linear-gradient(rgba(6, 182, 212, 0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(6, 182, 212, 0.03) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px'
      }}
    >
      {/* Main Container - 3 Columns Grid */}
      <div className="grid w-full max-w-7xl grid-cols-1 gap-8 lg:grid-cols-[1fr_2fr_1fr]">
        
        {/* ============================================
            COLONNE 1 : LE BRIEFING
        ============================================ */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, ...springTransition }}
          className="flex flex-col"
        >
          <div className="rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-slate-900/90 to-slate-950/90 p-8 backdrop-blur-xl">
            {/* Header */}
            <div className="mb-8">
              <p className="mb-2 font-mono text-xs font-semibold uppercase tracking-wider text-cyan-400">
                Phase 3 : No-Code
              </p>
              <h2 className="text-2xl font-bold text-white">
                THE ARCHITECT DESK
              </h2>
            </div>

            {/* Mission Card */}
            <div className="space-y-6">
              <div>
                <h3 className="mb-2 font-mono text-lg font-bold text-white">
                  MISSION : AIRBNB POUR CHIENS
                </h3>
                <p className="text-sm leading-relaxed text-slate-400">
                  Contraintes : Lancement en 24h. Zéro développeur.
                </p>
              </div>

              <div className="border-t border-white/10 pt-6">
                <p className="mb-4 font-semibold text-white">
                  Objectif :
                </p>
                <p className="text-sm leading-relaxed text-slate-300">
                  Assemblez la stack technique pour valider le projet.
                </p>
              </div>

              {/* Instructions */}
              <div className="space-y-3 border-t border-white/10 pt-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Instructions
                </p>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" />
                    <span>Sélectionnez un module dans la palette</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" />
                    <span>Placez-le dans le slot correspondant</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" />
                    <span>Complétez les 3 slots pour lancer</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ============================================
            COLONNE 2 : LE PLAN DE TRAVAIL (Centre)
        ============================================ */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, ...springTransition }}
          className="flex flex-col"
        >
          <div className="flex h-full flex-col rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-slate-900/90 to-slate-950/90 p-8 backdrop-blur-xl lg:p-12">
            {/* Title */}
            <div className="mb-8">
              <h3 className="font-mono text-lg font-bold text-white">
                PLAN DE TRAVAIL
              </h3>
            </div>

            {/* Slots Container */}
            <div className="flex flex-1 flex-col justify-center gap-6 lg:flex-row lg:items-center lg:gap-8">
              {slots.map((slot, index) => {
                const IconComponent = slot ? slot.icon : null;
                const expectedCategory = slotCategories[index];
                const nextCategory = getNextSlotCategory();
                const isActive = nextCategory === expectedCategory;

                return (
                  <div key={index} className="flex flex-1 flex-col lg:flex-row lg:items-center">
                    {/* Slot */}
                    <motion.div
                      animate={slot ? { scale: 1 } : { scale: 1 }}
                      className={`flex min-h-[160px] flex-1 flex-col items-center justify-center rounded-2xl border-2 transition-all duration-300 ${
                        slot
                          ? 'border-cyan-400 bg-cyan-400/10 shadow-[0_0_40px_rgba(6,182,212,0.3)]'
                          : isActive
                          ? 'border-cyan-400/50 bg-white/5'
                          : 'border-white/10 bg-white/5'
                      }`}
                    >
                      {IconComponent ? (
                        <div className="flex flex-col items-center gap-4">
                          <div className="rounded-full border border-cyan-400/30 bg-cyan-400/10 p-4">
                            <IconComponent size={48} strokeWidth={1.5} className="text-cyan-300" />
                          </div>
                          <p className="font-mono text-sm font-semibold text-cyan-400">
                            {slot.name}
                          </p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-3">
                          <div className="text-4xl text-slate-600">?</div>
                          <p className={`font-mono text-xs font-bold uppercase tracking-wider ${
                            isActive ? 'text-cyan-400' : 'text-slate-600'
                          }`}>
                            {slotLabels[index]}
                          </p>
                        </div>
                      )}
                    </motion.div>

                    {/* Arrow */}
                    {index < slots.length - 1 && (
                      <div className="flex items-center justify-center py-4 lg:py-0">
                        <motion.div
                          animate={{
                            opacity: slots[index] ? 1 : 0.3,
                          }}
                          className="text-cyan-400"
                        >
                          <ArrowRight size={32} strokeWidth={1.5} className="hidden lg:block" />
                          <ArrowRight size={24} strokeWidth={1.5} className="rotate-90 lg:hidden" />
                        </motion.div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Launch Button */}
            <AnimatePresence>
              {showLaunch && (
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  onClick={handleLaunch}
                  className="mt-8 flex w-full items-center justify-center gap-3 rounded-xl border border-cyan-400/50 bg-gradient-to-r from-cyan-500 to-cyan-400 px-8 py-5 font-mono text-lg font-bold text-white shadow-[0_0_40px_rgba(6,182,212,0.4)] transition-all duration-300 hover:shadow-[0_0_60px_rgba(6,182,212,0.6)]"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Rocket size={24} strokeWidth={2} />
                  <span>LANCER LE PROJET</span>
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* ============================================
            COLONNE 3 : LA PALETTE D'OUTILS
        ============================================ */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, ...springTransition }}
          className="flex flex-col"
        >
          <div className="rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-slate-900/90 to-slate-950/90 p-8 backdrop-blur-xl">
            {/* Header */}
            <div className="mb-6">
              <h3 className="font-mono text-lg font-bold text-white">
                MODULES DISPONIBLES
              </h3>
            </div>

            {/* Modules Grid */}
            <div className="grid grid-cols-1 gap-4">
              {modules.map((module) => {
                const IconComponent = module.icon;
                const isUsed = isModuleUsed(module.id);
                const nextCategory = getNextSlotCategory();
                const isAvailable = !isUsed && (nextCategory === null || module.category === nextCategory);

                return (
                  <motion.button
                    key={module.id}
                    onClick={() => handleModuleClick(module)}
                    disabled={!isAvailable}
                    className={`group flex items-center gap-4 whitespace-normal break-words rounded-xl border p-4 text-left transition-all duration-300 ${
                      isUsed
                        ? 'border-slate-700 bg-slate-800/30 opacity-50 cursor-not-allowed'
                        : isAvailable
                        ? 'border-white/10 bg-white/5 backdrop-blur-xl hover:border-cyan-400/50 hover:bg-cyan-400/10 hover:shadow-[0_0_20px_rgba(6,182,212,0.2)]'
                        : 'border-slate-700/50 bg-slate-800/30 opacity-40 cursor-not-allowed'
                    }`}
                    whileHover={isAvailable ? { scale: 1.02, x: 4 } : {}}
                    whileTap={isAvailable ? { scale: 0.98 } : {}}
                  >
                    <div className={`shrink-0 rounded-lg border p-3 transition-colors ${
                      isUsed
                        ? 'border-slate-700 bg-slate-800/50'
                        : isAvailable
                        ? 'border-cyan-400/30 bg-cyan-400/10 group-hover:border-cyan-400/50'
                        : 'border-slate-700 bg-slate-800/50'
                    }`}>
                      <IconComponent 
                        size={24} 
                        strokeWidth={1.5}
                        className={
                          isUsed 
                            ? 'text-slate-600' 
                            : isAvailable
                            ? 'text-cyan-400'
                            : 'text-slate-600'
                        }
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-semibold ${
                        isUsed 
                          ? 'text-slate-600' 
                          : isAvailable
                          ? 'text-white'
                          : 'text-slate-600'
                      }`}>
                        {module.name}
                      </p>
                      <p className={`mt-1 text-xs ${
                        isUsed || !isAvailable
                          ? 'text-slate-700'
                          : 'text-slate-400'
                      }`}>
                        {module.category === 'frontend' && 'Interface'}
                        {module.category === 'backend' && 'Données'}
                        {module.category === 'payment' && 'Paiement'}
                      </p>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Helper Text */}
            {nextCategory && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-6 rounded-lg border border-cyan-400/20 bg-cyan-400/5 p-4"
              >
                <p className="font-mono text-xs font-semibold text-cyan-400">
                  {nextCategory === 'frontend' && '→ Sélectionnez un module FRONTEND'}
                  {nextCategory === 'backend' && '→ Sélectionnez un module BACKEND'}
                  {nextCategory === 'payment' && '→ Sélectionnez un module PAIEMENT'}
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
