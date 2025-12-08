import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, DollarSign, Search } from 'lucide-react';

// Données de démonstration pour le dashboard
const DASHBOARD_DATA = {
  revenue: {
    value: '€2.4M',
    change: '+12.5%',
    trend: 'up'
  },
  users: {
    value: '18.2K',
    change: '+8.3%',
    trend: 'up'
  },
  conversion: {
    value: '3.2%',
    change: '-0.5%',
    trend: 'down'
  }
};

export default function PhaseData({ onPhaseComplete }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hoveredCard, setHoveredCard] = useState(null);
  const [insights, setInsights] = useState({});
  const containerRef = useRef(null);

  // Suivre la position de la souris
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      return () => container.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  // Générer des insights au survol
  const handleCardHover = (cardId, data) => {
    setHoveredCard(cardId);
    setInsights({
      [cardId]: {
        title: data.title,
        insight: data.insight,
        recommendation: data.recommendation
      }
    });
  };

  const handleCardLeave = () => {
    setHoveredCard(null);
    setTimeout(() => setInsights({}), 200);
  };

  const cards = [
    {
      id: 'revenue',
      title: 'Revenus',
      icon: DollarSign,
      data: DASHBOARD_DATA.revenue,
      insight: 'La croissance est principalement due à l\'augmentation des abonnements premium.',
      recommendation: 'Envisagez une campagne ciblée pour convertir les utilisateurs gratuits.'
    },
    {
      id: 'users',
      title: 'Utilisateurs',
      icon: Users,
      data: DASHBOARD_DATA.users,
      insight: 'L\'acquisition organique représente 65% de la croissance.',
      recommendation: 'Doublez les efforts sur le marketing de contenu.'
    },
    {
      id: 'conversion',
      title: 'Taux de Conversion',
      icon: TrendingUp,
      data: DASHBOARD_DATA.conversion,
      insight: 'La baisse est temporaire, liée à un test A/B en cours.',
      recommendation: 'Attendre la fin du test avant d\'ajuster la stratégie.'
    }
  ];

  return (
    <div className="fixed inset-0 w-screen h-screen bg-slate-950 overflow-hidden flex flex-col font-sans">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 h-20 flex items-center justify-between px-8 z-10">
        <div>
          <h1 className="text-2xl font-light text-white mb-1">THE INSIGHT LENS</h1>
          <p className="text-sm text-slate-400">Analysez les données avec précision</p>
        </div>
      </div>

      {/* Main Content */}
      <div
        ref={containerRef}
        className="flex-1 pt-20 p-8 overflow-hidden relative"
      >
        {/* Loupe qui suit la souris */}
        {hoveredCard && (
        <motion.div
            className="absolute pointer-events-none z-50"
            style={{
              left: mousePos.x - 150,
              top: mousePos.y - 150,
              width: 300,
              height: 300
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <div className="bg-white/10 backdrop-blur-2xl border-2 border-amber-200/50 rounded-full w-full h-full flex items-center justify-center shadow-2xl">
              <div className="text-center p-6">
                {insights[hoveredCard] && (
                  <>
                    <h3 className="text-amber-200 font-light text-lg mb-2">
                      {insights[hoveredCard].title}
                    </h3>
                    <p className="text-white text-sm mb-3">
                      {insights[hoveredCard].insight}
                    </p>
                    <p className="text-violet-200 text-xs italic">
                      💡 {insights[hoveredCard].recommendation}
                    </p>
                  </>
                )}
              </div>
      </div>
          </motion.div>
        )}

        {/* Dashboard Cards */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card, index) => {
            const Icon = card.icon;
            const isHovered = hoveredCard === card.id;
            const trendColor = card.data.trend === 'up' ? 'text-green-400' : 'text-red-400';

  return (
      <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onMouseEnter={() => handleCardHover(card.id, card)}
                onMouseLeave={handleCardLeave}
                className={`bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl p-6 cursor-pointer transition-all ${
                  isHovered ? 'border-amber-200/50 bg-white/10' : 'hover:border-white/20'
                }`}
                whileHover={{ scale: 1.02, y: -4 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/5 rounded-xl">
                    <Icon className="h-6 w-6 text-amber-200" />
                  </div>
                  <div className={`text-sm font-medium ${trendColor}`}>
                    {card.data.change}
          </div>
        </div>

                <h3 className="text-slate-400 text-sm font-light mb-2">{card.title}</h3>
                <p className="text-3xl font-light text-white mb-4">{card.data.value}</p>
                
                {/* Mini graphique visuel */}
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
      <motion.div
                    className={`h-full rounded-full ${
                      card.data.trend === 'up'
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                        : 'bg-gradient-to-r from-red-500 to-orange-500'
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: card.data.trend === 'up' ? '75%' : '45%' }}
                    transition={{ delay: index * 0.2 + 0.5, duration: 1 }}
            />
          </div>
              </motion.div>
            );
          })}
        </div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 text-center"
        >
          <p className="text-slate-400 text-sm flex items-center justify-center gap-2">
            <Search className="h-4 w-4" />
            Survolez les cartes pour révéler des insights détaillés
          </p>
      </motion.div>
    </div>
    </div>
  );
}
