import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  GitBranch, 
  Rocket, 
  Target, 
  TrendingUp, 
  BarChart3, 
  Star,
  Workflow
} from 'lucide-react';
import ResultCard from '../ResultCard';

const QUESTIONS = [
  {
    id: 1,
    scenario: 'OBJECTIF PROFESSIONNEL',
    question: 'Quel est ton objectif professionnel ?',
    choices: [
      {
        id: 'eugenia-entreprise',
        text: 'Créer une entreprise',
        icon: Rocket,
        score: { albert: 0, eugenia: 3 }
      },
      {
        id: 'albert-tech',
        text: 'Travailler dans la tech/data',
        icon: BarChart3,
        score: { albert: 3, eugenia: 0 }
      },
      {
        id: 'eugenia-voie',
        text: 'Trouver ma voie',
        icon: Star,
        score: { albert: 0, eugenia: 1 }
      },
      {
        id: 'autre',
        text: 'Autre',
        icon: Target,
        score: { albert: 0, eugenia: 0 }
      }
    ]
  },
  {
    id: 2,
    scenario: 'SCÉNARIO CRASH',
    question: 'Un bug critique survient 1h avant le lancement.',
    choices: [
      {
        id: 'eugenia',
        text: 'J\'improvise une solution créative pour sauver la démo.',
        icon: Sparkles,
        score: { albert: 0, eugenia: 2 }
      },
      {
        id: 'albert',
        text: 'J\'analyse les logs pour trouver la racine du problème.',
        icon: GitBranch,
        score: { albert: 2, eugenia: 0 }
      }
    ]
  },
  {
    id: 3,
    scenario: 'VISUEL (INTERFACE)',
    question: 'Ton écran préféré ?',
    choices: [
      {
        id: 'eugenia',
        text: 'Générateur d\'Art IA',
        icon: Sparkles,
        visual: 'gradient',
        score: { albert: 0, eugenia: 2 }
      },
      {
        id: 'albert',
        text: 'Dashboard Analytics',
        icon: Workflow,
        visual: 'chart',
        score: { albert: 2, eugenia: 0 }
      }
    ]
  },
  {
    id: 4,
    scenario: 'DÉMARRAGE PROJET',
    question: 'Nouveau projet. Tu commences par...',
    choices: [
      {
        id: 'eugenia',
        text: 'Un prototype rapide (MVP) pour tester.',
        icon: Rocket,
        score: { albert: 0, eugenia: 2 }
      },
      {
        id: 'albert',
        text: 'Un plan structuré et des KPIs.',
        icon: Target,
        score: { albert: 2, eugenia: 0 }
      }
    ]
  },
  {
    id: 5,
    scenario: 'GROWTH STRATEGY',
    question: 'Faire grandir l\'app.',
    choices: [
      {
        id: 'eugenia',
        text: 'Faire exploser la viralité',
        icon: TrendingUp,
        score: { albert: 0, eugenia: 2 }
      },
      {
        id: 'albert',
        text: 'Optimiser la rétention',
        icon: BarChart3,
        score: { albert: 2, eugenia: 0 }
      }
    ]
  },
  {
    id: 6,
    scenario: 'MOTIVATION',
    question: 'Ce qui te fait lever le matin...',
    choices: [
      {
        id: 'eugenia',
        text: 'Imaginer / créer / innover',
        icon: Star,
        score: { albert: 0, eugenia: 2 }
      },
      {
        id: 'albert',
        text: 'Résoudre des problèmes complexes',
        icon: Workflow,
        score: { albert: 2, eugenia: 0 }
      }
    ]
  }
];

// Fonction de calcul du badge final basée UNIQUEMENT sur les pourcentages du quiz
const calculateFinalBadge = (gameScore, userProfile) => {
  const { albert: scoreAlbert, eugenia: scoreEugenia } = gameScore;
  
  // Calcul des pourcentages EXACTS selon les spécifications
  const total = scoreAlbert + scoreEugenia;
  const percentAlbert = total > 0 ? Math.round((scoreAlbert / total) * 100) : 50;
  const percentEugenia = total > 0 ? Math.round((scoreEugenia / total) * 100) : 50;
  
  // Détermination du badge UNIQUEMENT basée sur les pourcentages
  const isGameAlbert = percentAlbert > percentEugenia;
  const isGameEugenia = percentEugenia > percentAlbert;
  const isNeutral = percentAlbert === percentEugenia;
  
  // Conversion moyenne en nombre
  const getMoyenneValue = (moyenne) => {
    if (moyenne === '16+') return 16;
    if (moyenne === '14-15') return 14.5;
    if (moyenne === '11-13') return 12;
    if (moyenne === '<11') return 10;
    return 0;
  };

  const moyenneValue = userProfile?.moyenne ? getMoyenneValue(userProfile.moyenne) : 0;
  // Utiliser spes (de Onboarding) ou specialites (fallback)
  const specialites = userProfile?.spes || userProfile?.specialites || [];
  const filiere = userProfile?.filiere || '';
  
  // ============================================
  // CAS SPÉCIAL : BAC PRO / AUTRE (OUTSIDER)
  // ============================================
  // Vérifier EN PREMIER si la filière est "Pro / Autre"
  // Dans ce cas, on ne applique PAS les règles standards
  if (filiere === 'Pro / Autre') {
    // CAS A : Il a joué comme Eugenia (Majorité A)
    if (isGameEugenia) {
      return {
        badge: 'MAKER SPIRIT',
        subtitle: 'Parcours Atypique',
        message: 'Tu as la créativité et l\'audace d\'un profil Eugenia. Ton parcours scolaire est différent des standards d\'admission : viens nous présenter ton projet personnel au stand.',
        matchPercentage: 75, // Match élevé car mindset détecté, mais parcours atypique
        color: 'from-[#E33054] to-[#671324]',
        bgColor: 'bg-[#E33054]/10',
        borderColor: 'border-[#E33054]/30',
        textColor: 'text-[#E33054]',
        advice: 'Votre profil créatif correspond à Eugenia. Votre parcours atypique est un atout : venez nous présenter votre projet personnel et vos réalisations au stand pour discuter des opportunités d\'admission.',
      };
    }
    
    // CAS B : Il a joué comme Albert (Majorité B)
    if (isGameAlbert) {
      return {
        badge: 'SELF-MADE ANALYST',
        subtitle: 'Parcours Atypique',
        message: 'Tu possèdes une logique implacable. L\'école Albert demande un bagage théorique mathématique fort : viens discuter avec nous pour voir si des passerelles existent.',
        matchPercentage: 70, // Match moyen car mindset détecté, mais prérequis théoriques à vérifier
        color: 'from-blue-600 to-cyan-400',
        bgColor: 'bg-blue-600/10',
        borderColor: 'border-blue-600/30',
        textColor: 'text-blue-400',
        advice: 'Votre mindset analytique correspond à Albert. L\'école Albert nécessite un bagage théorique mathématique solide : venez discuter avec nous au stand pour explorer les passerelles possibles et les options d\'admission adaptées à votre parcours.',
      };
    }
    
    // CAS C : Égalité dans le jeu (Neutre)
    return {
      badge: 'EXPLORER',
      subtitle: 'Parcours Atypique',
      message: 'Tu touches à tout. Prends le temps de découvrir nos deux campus et viens nous rencontrer au stand pour discuter de ton projet.',
      matchPercentage: 50,
      color: 'from-slate-400 to-gray-600',
      bgColor: 'bg-slate-500/10',
      borderColor: 'border-slate-500/30',
      textColor: 'text-slate-300',
      advice: 'Votre profil est encore en construction. Votre parcours atypique est une force : venez nous rencontrer au stand pour explorer les opportunités dans les deux campus (Albert et Eugenia) et discuter de votre projet professionnel.',
    };
  }
  
  // ============================================
  // LOGIQUE STANDARD (Générale / Technologique)
  // ============================================
  // Vérifications pour Albert
  // Spécialités OBLIGATOIRES (au moins 1 parmi) : Maths, Maths Expertes, NSI, Physique
  // Normaliser les noms de spécialités (peuvent être en majuscules ou avec variations)
  const normalizedSpecs = specialites.map(s => s?.toLowerCase() || '');
  const hasMaths = normalizedSpecs.some(s => 
    s === 'maths' || 
    s === 'mathématiques' || 
    s === 'math' ||
    s.includes('maths') ||
    s.includes('mathématiques') ||
    s === 'maths complémentaire' ||
    s === 'maths expertes'
  );
  const hasNSI = normalizedSpecs.some(s => 
    s === 'nsi' || 
    s === 'numérique et sciences informatiques' ||
    s.includes('nsi')
  );
  const hasPhysique = normalizedSpecs.some(s => 
    s === 'physique' || 
    s === 'physique-chimie' ||
    s.includes('physique')
  );
  const hasScientificSpe = hasMaths || hasNSI || hasPhysique; // Au moins 1 spécialité scientifique requise
  
  // Anglais : BONUS uniquement (pas obligatoire)
  const hasEnglishBonus = specialites.includes('anglais');
  
  const hasMoyenneAlbert = moyenneValue >= 14;
  
  // Vérifications pour Eugenia
  const hasMoyenneEugenia = moyenneValue >= 11;
  const hasFiliereOK = filiere === 'Générale' || filiere === 'Technologique';

  // Calcul du pourcentage de match
  const calculateMatchPercentage = (badgeType) => {
    let score = 0;
    let maxScore = 0;
    
    if (badgeType === 'albert') {
      maxScore = 3; // Jeu + Moyenne + Spé scientifique (obligatoire)
      if (isGameAlbert) score += 1;
      if (hasMoyenneAlbert) score += 1;
      if (hasScientificSpe) score += 1;
      
      // Bonus anglais : +5% si présent (mais pas requis)
      const basePercentage = Math.round((score / maxScore) * 100);
      return hasEnglishBonus ? Math.min(100, basePercentage + 5) : basePercentage;
    } else if (badgeType === 'eugenia') {
      maxScore = 3; // Jeu + Moyenne + Filière
      if (isGameEugenia) score += 1;
      if (hasMoyenneEugenia) score += 1;
      if (hasFiliereOK) score += 1;
    }
    
    return Math.round((score / maxScore) * 100);
  };

  // 1. PROFIL "ELITE ANALYST" (Cible Albert)
  // Critères : Jeu Albert + Moyenne >= 14 + Spécialité scientifique (Maths/Maths Expertes/NSI/Physique)
  // Note : L'anglais est un bonus mais n'est PAS obligatoire
  if (isGameAlbert && hasMoyenneAlbert && hasScientificSpe) {
    const adviceText = hasEnglishBonus
      ? 'Votre profil correspond parfaitement aux critères d\'admission Albert. Votre rigueur analytique, votre niveau académique et votre maîtrise de l\'anglais sont alignés.'
      : 'Votre profil correspond parfaitement aux critères d\'admission Albert. Votre rigueur analytique et votre niveau académique sont alignés.';
    
    return {
      badge: 'ELITE ANALYST',
      subtitle: 'Cible Albert',
      message: 'Tu as la rigueur et le niveau pour l\'excellence Data.',
      matchPercentage: calculateMatchPercentage('albert'),
      color: 'from-blue-600 to-cyan-400',
      bgColor: 'bg-blue-600/10',
      borderColor: 'border-blue-600/30',
      textColor: 'text-blue-400',
      advice: adviceText,
    };
  }

  // 2. PROFIL "FUTURE MAKER" (Cible Eugenia)
  if (isGameEugenia && hasMoyenneEugenia && hasFiliereOK) {
    return {
      badge: 'FUTURE MAKER',
      subtitle: 'Cible Eugenia',
      message: 'Tu as la vision et la créativité pour entreprendre.',
      matchPercentage: calculateMatchPercentage('eugenia'),
      color: 'from-[#E33054] to-[#671324]',
      bgColor: 'bg-[#E33054]/10',
      borderColor: 'border-[#E33054]/30',
      textColor: 'text-[#E33054]',
      advice: 'Votre créativité et votre profil académique sont alignés avec les valeurs d\'Eugenia.',
    };
  }

  // 3. PROFIL "LOGICAL MIND" (Potentiel Albert - Mindset OK mais Dossier Juste)
  // Mindset Albert détecté mais prérequis académiques insuffisants
  if (isGameAlbert && (!hasMoyenneAlbert || !hasScientificSpe)) {
    const missing = [];
    if (!hasMoyenneAlbert) missing.push('Moyenne >= 14');
    if (!hasScientificSpe) missing.push('Maths/Maths Expertes/NSI/Physique');
    
    return {
      badge: 'LOGICAL MIND',
      subtitle: 'Potentiel Albert',
      message: `Tu as l'esprit analytique parfait pour Albert, mais tes prérequis académiques (${missing.join(' ou ')}) sont à renforcer pour l'admission.`,
      matchPercentage: calculateMatchPercentage('albert'),
      color: 'from-blue-400 to-slate-500',
      bgColor: 'bg-blue-500/5',
      borderColor: 'border-blue-500/20',
      textColor: 'text-blue-200',
      advice: 'Votre mindset analytique correspond à Albert. Concentrez-vous sur le renforcement de vos prérequis académiques (moyenne >= 14 et spécialité scientifique) pour maximiser vos chances d\'admission.',
    };
  }

  // 4. PROFIL "CREATIVE SPIRIT" (Potentiel Eugenia - Mindset OK mais Dossier Juste)
  if (isGameEugenia && (!hasMoyenneEugenia || !hasFiliereOK)) {
    return {
      badge: 'CREATIVE SPIRIT',
      subtitle: 'Potentiel Eugenia',
      message: 'Ton énergie créative est top pour Eugenia. Attention à maintenir un dossier scolaire solide pour intégrer l\'école.',
      matchPercentage: calculateMatchPercentage('eugenia'),
      color: 'from-[#E33054] to-[#671324]',
      bgColor: 'bg-[#E33054]/5',
      borderColor: 'border-[#E33054]/20',
      textColor: 'text-[#E33054]',
      advice: !hasMoyenneEugenia 
        ? 'Votre créativité correspond à Eugenia. Travaillez à maintenir une moyenne >= 11 pour renforcer votre candidature.'
        : 'Votre créativité correspond à Eugenia. Assurez-vous d\'être en filière Générale ou Technologique.',
    };
  }

  // 5. PROFIL "EXPLORER" (Neutre / Indécis)
  if (isNeutral || moyenneValue < 10) {
    return {
      badge: 'EXPLORER',
      subtitle: 'Profil en découverte',
      message: 'Tu touches à tout. Prends le temps de découvrir nos deux campus.',
      matchPercentage: 50,
      color: 'from-slate-400 to-gray-600',
      bgColor: 'bg-slate-500/10',
      borderColor: 'border-slate-500/30',
      textColor: 'text-slate-300',
      advice: 'Votre profil est encore en construction. Explorez les deux voies (Albert et Eugenia) pour déterminer celle qui vous correspond le mieux. Renforcez votre dossier académique pour maximiser vos options.',
    };
  }

  // Cas par défaut (ne devrait pas arriver)
  return {
    badge: 'PROFIL ÉQUILIBRÉ',
    subtitle: 'Profil mixte',
    message: 'Tu touches à tout. Prends le temps de découvrir nos deux campus.',
    matchPercentage: 50,
    color: 'from-indigo-500 to-purple-500',
    bgColor: 'bg-indigo-500/10',
    borderColor: 'border-indigo-500/30',
    textColor: 'text-indigo-300',
    advice: 'Vous avez un profil équilibré. Explorez les deux voies pour déterminer celle qui vous correspond le mieux.',
  };
};

// Fonction pour mélanger aléatoirement un tableau (Fisher-Yates)
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Mélanger les choix de chaque question SAUF la question 1 (objectif professionnel) qui doit rester dans l'ordre
const QUESTIONS_SHUFFLED = QUESTIONS.map(q => ({
  ...q,
  choices: q.id === 1 ? q.choices : shuffleArray(q.choices) // Garder l'ordre pour la question 1
}));

export default function PhaseIA({ onComplete, userProfile }) {
  console.log('🎮 PhaseIA rendu - onComplete disponible?', typeof onComplete === 'function');
  console.log('🎮 PhaseIA - userProfile:', userProfile);
  
  // Variables globales pour le scoring du quiz uniquement
  // Ne pas utiliser le context qui contient les scores de l'onboarding
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [gameScoreAlbert, setGameScoreAlbert] = useState(0);
  const [gameScoreEugenia, setGameScoreEugenia] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const handleChoice = (choice) => {
    // Points EXACTS selon les spécifications
    const pointsAlbert = choice.score.albert;
    const pointsEugenia = choice.score.eugenia;
    
    // Mise à jour des variables globales du quiz uniquement
    setGameScoreAlbert(prev => {
      const newScore = prev + pointsAlbert;
      console.log(`📊 Score Albert: ${prev} + ${pointsAlbert} = ${newScore} (Question ${currentQ.id}: ${choice.text})`);
      return newScore;
    });
    setGameScoreEugenia(prev => {
      const newScore = prev + pointsEugenia;
      console.log(`📊 Score Eugenia: ${prev} + ${pointsEugenia} = ${newScore} (Question ${currentQ.id}: ${choice.text})`);
      return newScore;
    });

    // Passage immédiat à la question suivante ou résultat
    if (currentQuestion < QUESTIONS_SHUFFLED.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(prev => prev + 1);
      }, 100);
    } else {
      setTimeout(() => {
        setShowResult(true);
      }, 100);
    }
  };

  const progress = ((currentQuestion + 1) / QUESTIONS_SHUFFLED.length) * 100;
  const currentQ = QUESTIONS_SHUFFLED[currentQuestion];

  if (showResult) {
    // Calcul des scores FINAUX selon les spécifications
    // Utiliser UNIQUEMENT les scores du quiz PhaseIA (pas l'onboarding)
    const totalScoreAlbert = gameScoreAlbert;
    const totalScoreEugenia = gameScoreEugenia;
    
    // Calcul des pourcentages EXACTS selon les spécifications
    const total = totalScoreAlbert + totalScoreEugenia;
    const percentAlbert = total > 0 ? Math.round((totalScoreAlbert / total) * 100) : 50;
    const percentEugenia = total > 0 ? Math.round((totalScoreEugenia / total) * 100) : 50;
    
    // Détermination du badge UNIQUEMENT basée sur les pourcentages
    const gameScore = { albert: totalScoreAlbert, eugenia: totalScoreEugenia };
    const profile = calculateFinalBadge(gameScore, userProfile);
    
    // Forcer le badge selon les pourcentages
    if (percentAlbert > percentEugenia) {
      // Badge ALBERT
      profile.badge = profile.badge.includes('ALBERT') || profile.badge.includes('ANALYST') ? profile.badge : 'ELITE ANALYST';
    } else if (percentEugenia > percentAlbert) {
      // Badge EUGENIA
      profile.badge = profile.badge.includes('EUGENIA') || profile.badge.includes('MAKER') ? profile.badge : 'FUTURE MAKER';
    } else {
      // Égalité
      profile.badge = 'EXPLORER';
    }
    
    // Ajouter les pourcentages au profile pour l'affichage
    profile.percentAlbert = percentAlbert;
    profile.percentEugenia = percentEugenia;
    
    console.log('🎮 PhaseIA - Affichage ResultCard');
    console.log('🎮 PhaseIA - Scores du quiz (locaux):', { albert: gameScoreAlbert, eugenia: gameScoreEugenia });
    console.log('🎮 PhaseIA - Pourcentages calculés:', { albert: percentAlbert, eugenia: percentEugenia });
    console.log('🎮 PhaseIA - Total:', total);
    console.log('🎮 PhaseIA - Profile calculé:', profile);
    console.log('🎮 PhaseIA - onComplete passé à ResultCard?', typeof onComplete === 'function');

    return (
      <ResultCard
        profile={profile}
        scoreAlbert={totalScoreAlbert}
        scoreEugenia={totalScoreEugenia}
        percentAlbert={percentAlbert}
        percentEugenia={percentEugenia}
        userProfile={userProfile}
        onComplete={onComplete}
      />
    );
  }

  const isQuestion2 = currentQ.id === 3; // Question 3 est la question visuelle
  const isQuestion1 = currentQ.id === 1; // Question 1 a 4 choix

  return (
    <div className="w-full h-full flex flex-col bg-transparent">
      {/* Barre de progression - Simple et sobre */}
      <div className="w-full h-[1px] bg-white/10">
          <motion.div
          className="h-full bg-white"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          />
      </div>

      {/* Contenu principal */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full max-w-4xl mx-auto flex flex-col items-center"
          >
            {/* Titre de la question - Style suisse */}
            <h2 className="text-xl sm:text-2xl font-medium text-white mb-8 sm:mb-12 md:mb-16 text-center tracking-tight px-4">
                {currentQ.question}
              </h2>

            {/* Grille des choix - Design premium moderne */}
            <div className={`grid ${isQuestion1 ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-4' : 'grid-cols-1 md:grid-cols-2'} gap-4 sm:gap-6 w-full max-w-4xl mx-auto`}>
              {currentQ.choices.map((choice, index) => {
                const Icon = choice.icon;
                // Couleurs basées sur l'index (pas sur le type de choix) pour éviter l'identification
                // Index 0 : Violet/Indigo
                // Index 1 : Émeraude/Teal
                const colorSchemes = [
                  {
                    gradient: 'from-violet-500/20 via-indigo-500/20 to-purple-500/20',
                    border: 'border-violet-500/40',
                    glow: 'group-hover:shadow-[0_0_20px_rgba(139,92,246,0.2)]',
                    iconBg: 'bg-gradient-to-br from-violet-500/20 to-indigo-500/20',
                    iconText: 'text-violet-300',
                    textColor: 'text-violet-100'
                  },
                  {
                    gradient: 'from-emerald-500/20 via-teal-500/20 to-cyan-500/20',
                    border: 'border-emerald-500/40',
                    glow: 'group-hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]',
                    iconBg: 'bg-gradient-to-br from-emerald-500/20 to-teal-500/20',
                    iconText: 'text-emerald-300',
                    textColor: 'text-emerald-100'
                  }
                ];
                const colors = colorSchemes[index % 2];
                
                return (
                  <motion.button
                    key={choice.id}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: index * 0.1, duration: 0.4, ease: "easeOut" }}
                    whileHover={{ scale: 1.02, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleChoice(choice)}
                    className={`
                      relative overflow-hidden
                      ${isQuestion1 ? 'h-[180px] sm:h-[200px]' : 'h-[280px] sm:h-[320px] md:h-[340px]'}
                      flex flex-col items-center justify-center text-center
                      ${isQuestion1 ? 'p-4 sm:p-5' : 'p-6 sm:p-8 md:p-10'}
                      rounded-xl sm:rounded-2xl
                      transition-all duration-500 ease-out
                      group cursor-pointer
                      backdrop-blur-xl
                      ${isQuestion2 ? '' : `
                        bg-gradient-to-br ${colors.gradient}
                        border-2 ${colors.border}
                        ${colors.glow}
                      `}
                    `}
                  >
                    {/* CARTE avec image de fond - Question 3 (visuelle) avec design premium */}
                    {isQuestion2 && choice.visual && (
                      <>
                        {/* Image de fond */}
                        <div 
                          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                          style={{
                            backgroundImage: choice.visual === 'gradient' 
                              // Générateur d'Art IA - Art numérique créatif avec couleurs vibrantes et abstraites
                              ? `url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=90&w=2000&auto=format&fit=crop&ixlib=rb-4.0.3')`
                              // Dashboard Analytics - Interface moderne professionnelle avec graphiques et données
                              : `url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=90&w=2000&auto=format&fit=crop&ixlib=rb-4.0.3')`
                          }}
                        />
                        
                        {/* Overlay avec gradient coloré basé sur l'index - Opacité réduite pour mieux voir les images */}
                        <div className={`absolute inset-0 transition-all duration-500 ${
                          index === 0 
                            ? 'bg-gradient-to-br from-violet-900/60 via-indigo-900/60 to-purple-900/60'
                            : 'bg-gradient-to-br from-emerald-900/60 via-teal-900/60 to-cyan-900/60'
                        }`} />
                        
                        {/* Grille technique animée (pour les cartes avec chart) */}
                        {choice.visual === 'chart' && (
                          <div 
                            className="absolute inset-0 opacity-30 transition-opacity duration-500"
                          style={{
                              backgroundImage: `
                                linear-gradient(to right, ${index === 0 ? 'rgba(139, 92, 246, 0.3)' : 'rgba(16, 185, 129, 0.3)'} 1px, transparent 1px),
                                linear-gradient(to bottom, ${index === 0 ? 'rgba(139, 92, 246, 0.3)' : 'rgba(16, 185, 129, 0.3)'} 1px, transparent 1px)
                              `,
                              backgroundSize: '40px 40px'
                            }}
                          />
                        )}
                        
                        {/* Contenu texte - Centré avec style premium */}
                        <div className="relative z-10 flex flex-col items-center justify-center text-center">
                          <motion.div 
                            className={`w-16 h-16 sm:w-20 sm:h-20 ${colors.iconBg} backdrop-blur-xl rounded-xl sm:rounded-2xl flex items-center justify-center mb-6 sm:mb-8 md:mb-10 transition-all duration-500 ${
                              index === 0 
                                ? 'shadow-[0_0_30px_rgba(139,92,246,0.4)]'
                                : 'shadow-[0_0_30px_rgba(16,185,129,0.4)]'
                            }`}
                            whileHover={{ scale: 1.1, rotate: [0, index === 0 ? -5 : 5, index === 0 ? 5 : -5, 0] }}
                            transition={{ duration: 0.5 }}
                          >
                            <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" strokeWidth={2} />
                          </motion.div>
                          <h3 className="text-base sm:text-lg md:text-xl font-semibold text-white tracking-tight leading-relaxed px-2 sm:px-4">
                            {choice.text}
                          </h3>
                      </div>
                      </>
                    )}

                    {/* Layout pour la question 1 (4 choix) - Design premium */}
                    {isQuestion1 && (
                      <>
                        {/* Icône avec effet glow premium */}
                        <motion.div 
                          className={`
                            relative w-12 h-12 sm:w-14 sm:h-14 ${colors.iconBg} 
                            rounded-xl flex items-center justify-center mb-3 sm:mb-4
                            transition-all duration-500
                            group-hover:scale-110
                            ${index % 2 === 0 
                              ? 'shadow-[0_0_20px_rgba(139,92,246,0.3)]' 
                              : 'shadow-[0_0_20px_rgba(16,185,129,0.3)]'}
                          `}
                          whileHover={{ rotate: [0, -5, 5, -5, 0] }}
                          transition={{ duration: 0.5 }}
                        >
                          <Icon 
                            className={`
                              relative z-10 w-5 h-5 sm:w-6 sm:h-6 ${colors.iconText}
                            `} 
                            strokeWidth={2} 
                          />
                        </motion.div>
                        
                        {/* Texte avec effet premium */}
                        <motion.h3 
                          className={`
                            text-sm sm:text-base font-semibold tracking-tight leading-relaxed px-2
                            ${colors.textColor}
                            relative
                          `}
                        >
                          {choice.text}
                          {/* Soulignement animé au hover */}
                          <span className={`
                            absolute bottom-0 left-0 right-0 h-0.5 
                            ${index % 2 === 0 
                              ? 'bg-gradient-to-r from-violet-400 to-indigo-400' 
                              : 'bg-gradient-to-r from-emerald-400 to-teal-400'}
                            transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center
                          `} />
                        </motion.h3>
                      </>
                    )}

                    {/* Layout standard pour les autres questions - Design premium */}
                    {!isQuestion2 && !isQuestion1 && (
                      <>
                        {/* Icône avec effet glow premium */}
                        <motion.div 
                          className={`
                            relative w-16 h-16 sm:w-20 sm:h-20 ${colors.iconBg} 
                            rounded-xl sm:rounded-2xl flex items-center justify-center mb-6 sm:mb-8 md:mb-10
                            transition-all duration-500
                            group-hover:scale-110
                            ${index === 0 
                              ? 'shadow-[0_0_20px_rgba(139,92,246,0.3)]' 
                              : 'shadow-[0_0_20px_rgba(16,185,129,0.3)]'}
                          `}
                          whileHover={{ rotate: [0, -5, 5, -5, 0] }}
                          transition={{ duration: 0.5 }}
                        >
                          <Icon 
                            className={`
                              relative z-10 w-6 h-6 sm:w-8 sm:h-8 ${colors.iconText}
                            `} 
                            strokeWidth={2} 
                          />
                        </motion.div>
                        
                        {/* Texte avec effet premium */}
                        <motion.h3 
                          className={`
                            text-base sm:text-lg md:text-xl font-semibold tracking-tight leading-relaxed px-2 sm:px-4
                            ${colors.textColor}
                            relative
                          `}
                        >
                          {choice.text}
                          {/* Soulignement animé au hover */}
                          <span className={`
                            absolute bottom-0 left-0 right-0 h-0.5 
                            ${index === 0 
                              ? 'bg-gradient-to-r from-violet-400 to-indigo-400' 
                              : 'bg-gradient-to-r from-emerald-400 to-teal-400'}
                            transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center
                          `} />
                        </motion.h3>
                      </>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
