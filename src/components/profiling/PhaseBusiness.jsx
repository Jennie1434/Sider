import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp,
  Target,
  Search,
  Video,
  DollarSign,
  Users,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

export default function PhaseBusiness({ productIdentity, onComplete }) {
  const [priceChoice, setPriceChoice] = useState(null);
  const [adChoice, setAdChoice] = useState(null);
  const [showValidation, setShowValidation] = useState(false);

  // Valeurs par défaut si productIdentity n'est pas fourni
  const productName = productIdentity?.name || 'Votre Produit';
  const productSlogan = productIdentity?.slogan || 'L\'essence dans l\'absence.';
  const visualStyle = productIdentity?.visualStyle || 'gradient';

  const handlePriceSelect = (choice) => {
    setPriceChoice(choice);
  };

  const handleAdSelect = (choice) => {
    setAdChoice(choice);
    
    // Si les deux choix sont faits, afficher la validation
    if (priceChoice) {
      setTimeout(() => {
        setShowValidation(true);
      }, 300);
    }
  };

  const handleContinue = () => {
    if (onComplete) {
      onComplete({
        price: priceChoice,
        advertising: adChoice
      });
    }
  };

  // Options pour le prix
  const priceOptions = [
    {
      id: 'marge',
      label: 'MARGE ÉLEVÉE',
      description: 'Prix fort, rentabilité immédiate',
      icon: DollarSign,
      type: 'albert',
      color: 'from-blue-600/20 to-cyan-500/20',
      borderColor: 'border-blue-500/50',
      textColor: 'text-blue-300',
      iconColor: 'text-blue-400'
    },
    {
      id: 'penetration',
      label: 'PÉNÉTRATION',
      description: 'Prix bas, gros volume, pari sur l\'avenir',
      icon: TrendingUp,
      type: 'eugenia',
      color: 'from-[#E33054]/20 to-[#671324]/20',
      borderColor: 'border-[#E33054]/50',
      textColor: 'text-[#E33054]',
      iconColor: 'text-[#E33054]'
    }
  ];

  // Options pour la publicité
  const adOptions = [
    {
      id: 'google',
      label: 'GOOGLE ADS / SEO',
      description: 'Ciblage précis',
      icon: Search,
      type: 'albert',
      color: 'from-blue-600/20 to-cyan-500/20',
      borderColor: 'border-blue-500/50',
      textColor: 'text-blue-300',
      iconColor: 'text-blue-400'
    },
    {
      id: 'tiktok',
      label: 'TIKTOK / INFLUENCE',
      description: 'Visibilité massive',
      icon: Video,
      type: 'eugenia',
      color: 'from-[#E33054]/20 to-[#671324]/20',
      borderColor: 'border-[#E33054]/50',
      textColor: 'text-[#E33054]',
      iconColor: 'text-[#E33054]'
    }
  ];

  return (
    <div className="fixed inset-0 w-screen h-screen bg-[#0B0C15] flex flex-row overflow-hidden">
      {/* Fond avec lumières */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[#0B0C15]" />
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 800px 600px at top left, rgba(99, 102, 241, 0.15) 0%, transparent 60%)'
          }}
        />
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 800px 600px at bottom right, rgba(139, 92, 246, 0.1) 0%, transparent 60%)'
          }}
        />
      </div>

      {/* COLONNE GAUCHE - LE PRODUIT */}
      <div className="relative z-10 w-1/2 h-full flex flex-col items-center justify-center p-12 border-r border-white/10">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-2xl"
        >
          {/* Visuel du produit */}
          <div className="mb-12">
            <div 
              className="w-full h-64 rounded-2xl mb-8 overflow-hidden relative"
              style={{
                background: visualStyle === 'gradient'
                  ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.3) 0%, rgba(99, 102, 241, 0.3) 50%, rgba(236, 72, 153, 0.3) 100%)'
                  : 'linear-gradient(135deg, rgba(59, 130, 246, 0.3) 0%, rgba(16, 185, 129, 0.3) 100%)'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <h2 className="text-4xl font-bold text-white mb-4 tracking-tight">
                    {productName}
                  </h2>
                </div>
              </div>
            </div>
          </div>

          {/* Slogan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-center"
          >
            <p className="text-2xl font-medium text-slate-300 leading-relaxed italic">
              "{productSlogan}"
            </p>
            <p className="text-sm text-slate-500 mt-6">
              Voici le produit que vous avez créé.
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* COLONNE DROITE - LES DÉCISIONS BUSINESS */}
      <div className="relative z-10 w-1/2 h-full flex flex-col p-12 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-2xl mx-auto"
        >
          {/* En-tête */}
          <div className="mb-12">
            <h1 className="text-3xl font-semibold text-white mb-4 tracking-tight">
              STRATÉGIE DE LANCEMENT
            </h1>
            <p className="text-slate-400 text-lg">
              L'identité de <span className="text-white font-medium">{productName}</span> est validée. Il faut maintenant définir comment on le vend.
            </p>
          </div>

          {/* CHOIX 1 : LE PRIX */}
          <div className="mb-10">
            <h2 className="text-xl font-semibold text-white mb-6">
              Quel modèle de revenus ?
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {priceOptions.map((option, index) => {
                const Icon = option.icon;
                const isSelected = priceChoice === option.id;
                return (
                  <motion.button
                    key={option.id}
                    onClick={() => handlePriceSelect(option.id)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className={`
                      relative p-6 rounded-xl border-2 transition-all duration-300 text-left
                      backdrop-blur-xl
                      ${isSelected
                        ? `bg-gradient-to-br ${option.color} ${option.borderColor} ring-2 ring-offset-2 ring-offset-[#0B0C15] ${option.borderColor.replace('border-', 'ring-')} shadow-lg`
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                      }
                    `}
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`
                        p-3 rounded-lg flex-shrink-0
                        ${isSelected 
                          ? `bg-gradient-to-br ${option.color}` 
                          : 'bg-white/5'
                        }
                      `}>
                        <Icon className={`w-6 h-6 ${isSelected ? option.iconColor : 'text-slate-400'}`} strokeWidth={1.5} />
                      </div>
                      <div className="flex-1">
                        <h3 className={`text-lg font-semibold mb-2 ${isSelected ? option.textColor : 'text-white'}`}>
                          {option.label}
                        </h3>
                        <p className={`text-sm ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                          {option.description}
                        </p>
                      </div>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="flex-shrink-0"
                        >
                          <CheckCircle className={`w-6 h-6 ${option.iconColor}`} strokeWidth={2} />
                        </motion.div>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* CHOIX 2 : LA PUBLICITÉ */}
          <div className="mb-10">
            <h2 className="text-xl font-semibold text-white mb-6">
              Où aller chercher les clients ?
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {adOptions.map((option, index) => {
                const Icon = option.icon;
                const isSelected = adChoice === option.id;
                const isDisabled = !priceChoice;
                return (
                  <motion.button
                    key={option.id}
                    onClick={() => !isDisabled && handleAdSelect(option.id)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: (index + 2) * 0.1, duration: 0.4 }}
                    whileHover={!isDisabled ? { scale: 1.02, y: -2 } : {}}
                    whileTap={!isDisabled ? { scale: 0.98 } : {}}
                    disabled={isDisabled}
                    className={`
                      relative p-6 rounded-xl border-2 transition-all duration-300 text-left
                      backdrop-blur-xl
                      ${isDisabled 
                        ? 'bg-white/5 border-white/5 opacity-50 cursor-not-allowed'
                        : isSelected
                        ? `bg-gradient-to-br ${option.color} ${option.borderColor} ring-2 ring-offset-2 ring-offset-[#0B0C15] ${option.borderColor.replace('border-', 'ring-')} shadow-lg`
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                      }
                    `}
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`
                        p-3 rounded-lg flex-shrink-0
                        ${isSelected 
                          ? `bg-gradient-to-br ${option.color}` 
                          : 'bg-white/5'
                        }
                      `}>
                        <Icon className={`w-6 h-6 ${isSelected ? option.iconColor : 'text-slate-400'}`} strokeWidth={1.5} />
                      </div>
                      <div className="flex-1">
                        <h3 className={`text-lg font-semibold mb-2 ${isSelected ? option.textColor : 'text-white'}`}>
                          {option.label}
                        </h3>
                        <p className={`text-sm ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                          {option.description}
                        </p>
                      </div>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="flex-shrink-0"
                        >
                          <CheckCircle className={`w-6 h-6 ${option.iconColor}`} strokeWidth={2} />
                        </motion.div>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>
            {!priceChoice && (
              <p className="mt-4 text-xs text-slate-500 text-center">
                Sélectionnez d'abord un modèle de revenus
              </p>
            )}
          </div>

          {/* VALIDATION - PLAN BUSINESS */}
          <AnimatePresence>
            {showValidation && priceChoice && adChoice && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.4 }}
                className="mt-12 p-8 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-violet-500/10 border-2 border-indigo-500/30 backdrop-blur-xl"
              >
                <div className="flex items-center space-x-3 mb-6">
                  <CheckCircle className="w-8 h-8 text-indigo-400" strokeWidth={2} />
                  <h3 className="text-2xl font-semibold text-white">
                    PLAN BUSINESS VALIDÉ
                  </h3>
                </div>
                <div className="space-y-3 mb-8">
                  <div className="flex items-center space-x-2 text-slate-300">
                    <div className="w-2 h-2 rounded-full bg-indigo-400" />
                    <span>
                      Modèle de revenus : <span className="text-white font-medium">
                        {priceOptions.find(o => o.id === priceChoice)?.label}
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-300">
                    <div className="w-2 h-2 rounded-full bg-indigo-400" />
                    <span>
                      Stratégie marketing : <span className="text-white font-medium">
                        {adOptions.find(o => o.id === adChoice)?.label}
                      </span>
                    </span>
                  </div>
                </div>
                <motion.button
                  onClick={handleContinue}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold text-sm hover:from-indigo-500 hover:to-violet-500 transition-all duration-200 shadow-lg shadow-indigo-500/20 flex items-center justify-center space-x-2"
                >
                  <span>PASSER À L'ANALYSE DATA</span>
                  <ArrowRight className="w-5 h-5" strokeWidth={2} />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}

