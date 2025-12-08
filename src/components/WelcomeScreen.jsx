import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const springTransition = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
};

export default function WelcomeScreen({ onStart }) {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <motion.div
        className="w-full max-w-4xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="space-y-12 text-center">
          {/* Titre Principal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springTransition, delay: 0.3 }}
            className="space-y-4"
          >
            <h1 className="text-5xl md:text-6xl font-medium tracking-tight text-white leading-tight">
              PROJECT PHOENIX
            </h1>
            <p className="text-lg text-[#94A3B8] font-light">
              Plateforme d'évaluation des compétences IA & Business
            </p>
          </motion.div>

          {/* Carte Centrale */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springTransition, delay: 0.4 }}
            className="w-full"
          >
            <div className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-12 space-y-6">
              <div className="space-y-6 text-left">
                <div>
                  <h2 className="text-xl font-medium text-white mb-3">
                    Vous êtes le nouveau Head of Product
                  </h2>
                  <p className="text-[#94A3B8] leading-relaxed">
                    Vous avez <span className="text-white font-medium">4 modules</span> pour sauver la startup ECHO. 
                    Chaque décision que vous prendrez impactera la stratégie Business et déterminera le succès du lancement.
                  </p>
                </div>
                
                <div className="h-px bg-white/[0.06]" />
                
                <div>
                  <h3 className="text-sm font-medium text-[#94A3B8] uppercase tracking-wider mb-4">
                    Modules à compléter
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <div className="h-1.5 w-1.5 rounded-full bg-[#6366f1] mt-2 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-white mb-1">Identité Produit</p>
                        <p className="text-xs text-[#94A3B8]">Définir l'ADN du produit</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="h-1.5 w-1.5 rounded-full bg-[#6366f1] mt-2 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-white mb-1">Stratégie Business</p>
                        <p className="text-xs text-[#94A3B8]">Définir le modèle de vente</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="h-1.5 w-1.5 rounded-full bg-[#6366f1] mt-2 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-white mb-1">Analyse Data</p>
                        <p className="text-xs text-[#94A3B8]">Identifier les problèmes</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="h-1.5 w-1.5 rounded-full bg-[#6366f1] mt-2 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-white mb-1">Automatisation</p>
                        <p className="text-xs text-[#94A3B8]">Créer la solution No-Code</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Bouton Principal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springTransition, delay: 0.5 }}
          >
            <motion.button
              onClick={onStart}
              className="px-8 py-4 bg-[#6366f1] hover:bg-[#4f46e5] border border-[#6366f1]/20 rounded-xl text-white font-medium text-sm transition-all duration-200 flex items-center gap-2 mx-auto shadow-lg shadow-[#6366f1]/10"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              INITIALISER L'ESPACE DE TRAVAIL
              <ArrowRight className="h-4 w-4" />
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
