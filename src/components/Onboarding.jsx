import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Rocket,
  Briefcase,
  BarChart3,
  Navigation,
  Cpu,
  Target,
  Languages
} from 'lucide-react';
import { useScoring } from '../context/ScoringContext';
import { SCORING_RULES, getSpecialiteScore } from '../utils/scoringRules';

const CLASSES = [
  'Seconde',
  'Première',
  'Terminale',
  'Étudiant (Bac+)',
  'En réorientation'
];

const FILIERES = [
  'Générale',
  'Technologique (STI2D, STMG...)',
  'Professionnelle'
];

const MOYENNES = [
  { id: '<11', label: '< 11', description: 'Fragile' },
  { id: '11-13', label: '11 - 13', description: 'Cible Eugenia' },
  { id: '14-15', label: '14 - 15', description: 'Cible Albert' },
  { id: '16+', label: '16+', description: 'Excellent' }
];

const SPECIALITES_GENERALES = [
  'Maths',
  'Physique-Chimie',
  'SVT',
  'NSI',
  'SI',
  'SES',
  'HGGSP',
  'HLP',
  'LLCER',
  'Arts'
];

const SERIES_TECHNO_PRO = [
  'STI2D',
  'STMG',
  'STD2A',
  'ST2S',
  'Bac Pro SN',
  'Autre'
];

const OPTIONS = [
  'Maths Expertes',
  'Maths Complémentaire',
  'Droit/DGEMC',
  'Aucune'
];

const ENGLISH_LEVELS = [
  { id: 'A1-A2', label: 'A1/A2', subtitle: 'Débutant', description: 'Bases scolaires fragiles' },
  { id: 'B1', label: 'B1', subtitle: 'Intermédiaire', description: 'Compréhension globale, scolaire standard' },
  { id: 'B2', label: 'B2', subtitle: 'Avancé', description: 'À l\'aise à l\'oral, regarde des séries en VO' },
  { id: 'C1-C2', label: 'C1/C2', subtitle: 'Bilingue', description: 'Fluent / Natif' }
];

const OBJECTIFS = [
  { id: 'entreprise', label: 'Créer une boite', icon: Rocket },
  { id: 'expert', label: 'Expert Tech/Data', icon: BarChart3 },
  { id: 'voie', label: 'Trouver ma voie', icon: Navigation },
  { id: 'autre', label: 'Autre', icon: Target }
];

export default function Onboarding({ onComplete }) {
  const { addScore } = useScoring();
  const [step, setStep] = useState(1);
  const [step2SubQuestion, setStep2SubQuestion] = useState(0); // 0 = classe, 1 = filière, 2 = moyenne
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
    classe: '',
    filiere: '',
    moyenne: '',
    spes: [],
    options: '',
    englishLevel: '',
    objectif: ''
  });
  
  const [showAlert, setShowAlert] = useState(false);
  const [showSecondeMessage, setShowSecondeMessage] = useState(false);

  // Validation d'email
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Fonction pour déterminer le nombre de spécialités requis selon la classe
  const getRequiredSpecsCount = () => {
    if (formData.classe === 'Seconde') return 0; // Skip
    // Si filière techno/pro, 1 série requise
    if (isTechnoPro()) return 1;
    if (formData.classe === 'Première') return 3;
    if (formData.classe === 'Terminale' || formData.classe === 'Étudiant (Bac+)' || formData.classe === 'En réorientation') return 2;
    return 2; // Par défaut
  };

  // Fonction pour déterminer si on doit afficher les séries techno/pro
  const isTechnoPro = () => {
    return formData.filiere === 'Technologique (STI2D, STMG...)' || formData.filiere === 'Professionnelle';
  };

  // Validation des étapes
  // Vérifier si la sous-question actuelle de l'étape 2 est valide
  const isStep2SubQuestionValid = () => {
    switch (step2SubQuestion) {
      case 0: // Classe
        return !!formData.classe;
      case 1: // Filière
        return !!formData.filiere;
      case 2: // Moyenne
        return !!formData.moyenne;
      default:
        return false;
    }
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.prenom.trim() && formData.nom.trim() && formData.email.trim() && isValidEmail(formData.email);
      case 2:
        // Pour l'étape 2, vérifier si toutes les sous-questions sont complétées
        return formData.classe && formData.filiere && formData.moyenne;
      case 3:
        // Si Seconde, skip automatique (toujours valide)
        if (formData.classe === 'Seconde') return true;
        // Si filière techno/pro, au moins 1 série requise
        if (isTechnoPro()) {
          return formData.spes.length >= 1;
        }
        // Sinon, valider selon le nombre requis
        const requiredCount = getRequiredSpecsCount();
        return formData.spes.length === requiredCount;
      case 4:
        return formData.englishLevel;
      case 5:
        return formData.objectif;
      default:
        return false;
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSelect = (field, value) => {
    const prevValue = formData[field];
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Ajouter des points selon les règles de scoring
    if (field === 'classe' && SCORING_RULES.classe[value]) {
      const score = SCORING_RULES.classe[value];
      // Retirer les points de l'ancienne valeur si elle existait
      if (prevValue && SCORING_RULES.classe[prevValue]) {
        const prevScore = SCORING_RULES.classe[prevValue];
        addScore(-prevScore.albert, -prevScore.eugenia, `Classe: ${prevValue} (retiré)`);
      }
      addScore(score.albert, score.eugenia, `Classe: ${value}`);
      // Passer automatiquement à la question suivante (filière)
      setTimeout(() => setStep2SubQuestion(1), 300);
    } else if (field === 'filiere' && SCORING_RULES.filiere[value]) {
      const score = SCORING_RULES.filiere[value];
      if (prevValue && SCORING_RULES.filiere[prevValue]) {
        const prevScore = SCORING_RULES.filiere[prevValue];
        addScore(-prevScore.albert, -prevScore.eugenia, `Filière: ${prevValue} (retiré)`);
      }
      addScore(score.albert, score.eugenia, `Filière: ${value}`);
      // Passer automatiquement à la question suivante (moyenne)
      setTimeout(() => setStep2SubQuestion(2), 300);
    } else if (field === 'moyenne' && SCORING_RULES.moyenne[value]) {
      const score = SCORING_RULES.moyenne[value];
      if (prevValue && SCORING_RULES.moyenne[prevValue]) {
        const prevScore = SCORING_RULES.moyenne[prevValue];
        addScore(-prevScore.albert, -prevScore.eugenia, `Moyenne: ${prevValue} (retiré)`);
      }
      addScore(score.albert, score.eugenia, `Moyenne: ${value}`);
      // Toutes les questions de l'étape 2 sont complétées, on peut passer à l'étape suivante
      // Le bouton "Continuer" apparaîtra automatiquement
    } else if (field === 'options' && SCORING_RULES.options[value]) {
      const score = SCORING_RULES.options[value];
      if (prevValue && SCORING_RULES.options[prevValue]) {
        const prevScore = SCORING_RULES.options[prevValue];
        addScore(-prevScore.albert, -prevScore.eugenia, `Option: ${prevValue} (retiré)`);
      }
      addScore(score.albert, score.eugenia, `Option: ${value}`);
    } else if (field === 'englishLevel' && SCORING_RULES.anglais[value]) {
      const score = SCORING_RULES.anglais[value];
      if (prevValue && SCORING_RULES.anglais[prevValue]) {
        const prevScore = SCORING_RULES.anglais[prevValue];
        addScore(-prevScore.albert, -prevScore.eugenia, `Anglais: ${prevValue} (retiré)`);
      }
      addScore(score.albert, score.eugenia, `Anglais: ${value}`);
    } else if (field === 'objectif' && SCORING_RULES.objectif[value]) {
      const score = SCORING_RULES.objectif[value];
      if (prevValue && SCORING_RULES.objectif[prevValue]) {
        const prevScore = SCORING_RULES.objectif[prevValue];
        addScore(-prevScore.albert, -prevScore.eugenia, `Objectif: ${prevValue} (retiré)`);
      }
      addScore(score.albert, score.eugenia, `Objectif: ${value}`);
    }
  };

  const handleSpecialiteToggle = (spec) => {
    setFormData(prev => {
      const current = prev.spes;
      const requiredCount = getRequiredSpecsCount();
      
      // Pour techno/pro, sélection unique (remplacer la sélection précédente)
      if (isTechnoPro()) {
        if (current.includes(spec)) {
          // Désélectionner si déjà sélectionné
          const score = getSpecialiteScore(spec);
          addScore(-score.albert, -score.eugenia, `Spécialité: ${spec} (retiré)`);
          return { ...prev, spes: [] };
        } else {
          // Retirer les points de l'ancienne spécialité si elle existait
          if (current.length > 0) {
            const prevSpec = current[0];
            const prevScore = getSpecialiteScore(prevSpec);
            addScore(-prevScore.albert, -prevScore.eugenia, `Spécialité: ${prevSpec} (retiré)`);
          }
          // Sélectionner (remplacer toute sélection précédente)
          const score = getSpecialiteScore(spec);
          addScore(score.albert, score.eugenia, `Spécialité: ${spec}`);
          return { ...prev, spes: [spec] };
        }
      }
      
      // Pour les autres cas (Générale)
      if (current.includes(spec)) {
        // Désélectionner
        const score = getSpecialiteScore(spec);
        addScore(-score.albert, -score.eugenia, `Spécialité: ${spec} (retiré)`);
        return { ...prev, spes: current.filter(s => s !== spec) };
      } else if (current.length < requiredCount) {
        // Sélectionner si on n'a pas atteint le max
        const score = getSpecialiteScore(spec);
        addScore(score.albert, score.eugenia, `Spécialité: ${spec}`);
        return { ...prev, spes: [...current, spec] };
      } else {
        // Afficher l'alerte si on essaie de dépasser le max (Terminale)
        if (formData.classe === 'Terminale' || formData.classe === 'Étudiant (Bac+)' || formData.classe === 'En réorientation') {
          setShowAlert(true);
          setTimeout(() => setShowAlert(false), 3000);
        }
        return prev;
      }
    });
  };

  const handleOptionSelect = (option) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options === option ? '' : option
    }));
  };

  const handleNext = () => {
    if (step === 2) {
      // Si on est à l'étape 2, gérer les sous-questions
      if (step2SubQuestion < 2) {
        // Passer à la sous-question suivante
        setStep2SubQuestion(prev => prev + 1);
      } else {
        // Toutes les sous-questions sont complétées, passer à l'étape suivante
        if (formData.classe === 'Seconde') {
          setShowSecondeMessage(true);
          setTimeout(() => {
            setShowSecondeMessage(false);
            setStep(4); // Passer directement à l'étape 4 (Anglais)
            setStep2SubQuestion(0); // Réinitialiser pour la prochaine fois
          }, 1500);
        } else {
          setStep(3);
          setStep2SubQuestion(0); // Réinitialiser pour la prochaine fois
        }
      }
    } else if (isStepValid() && step < 5) {
      setStep(prev => prev + 1);
      // Réinitialiser step2SubQuestion si on quitte l'étape 2
      if (step === 2) {
        setStep2SubQuestion(0);
      }
    }
  };
  
  // Réinitialiser step2SubQuestion quand on entre dans l'étape 2
  useEffect(() => {
    if (step === 2) {
      // Si on a déjà répondu à toutes les questions, on reste sur la dernière
      if (formData.classe && formData.filiere && formData.moyenne) {
        setStep2SubQuestion(2);
      } else if (formData.classe && formData.filiere) {
        setStep2SubQuestion(2);
      } else if (formData.classe) {
        setStep2SubQuestion(1);
      } else {
        setStep2SubQuestion(0);
      }
    }
  }, [step]);

  const handleSubmit = () => {
    if (isStepValid()) {
      onComplete(formData);
    }
  };

  // Animation variants pour les transitions
  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0
    })
  };

  return (
    <div className="w-full h-full flex flex-col font-sans">
      {/* Barre de progression */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-slate-500 uppercase tracking-wider font-medium">
            Étape {step}/5
          </span>
          <span className="text-xs text-slate-500 font-medium">
            {Math.round((step / 5) * 100)}%
          </span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-1 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-indigo-500 to-violet-500"
            initial={{ width: 0 }}
            animate={{ width: `${(step / 5) * 100}%` }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Contenu des étapes */}
      <div className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait" custom={step}>
          {/* ÉTAPE 1 : IDENTITÉ */}
          {step === 1 && (
            <motion.div
              key="step1"
              custom={1}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="w-full h-full flex flex-col"
            >
              <div className="flex-1 flex flex-col justify-center">
                {/* Animation "Salut [Prénom]" */}
                <AnimatePresence>
                  {formData.prenom.trim() && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="mb-8 text-center"
                    >
                      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Salut {formData.prenom} 👋
                      </h2>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Champs de formulaire */}
                <div className="space-y-4 sm:space-y-6 max-w-md mx-auto w-full px-4 sm:px-0">
                  <div>
                    <label className="block text-xs sm:text-sm text-slate-400 mb-2 font-medium">
                      Prénom *
                    </label>
                    <input
                      type="text"
                      value={formData.prenom}
                      onChange={(e) => handleInputChange('prenom', e.target.value)}
                      className="w-full bg-[#1A1D26] border border-white/10 rounded-xl p-3 sm:p-4 text-white text-base sm:text-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all outline-none"
                      placeholder="Ton prénom"
                      autoFocus
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm text-slate-400 mb-2 font-medium">
                      Nom *
                    </label>
                    <input
                      type="text"
                      value={formData.nom}
                      onChange={(e) => handleInputChange('nom', e.target.value)}
                      className="w-full bg-[#1A1D26] border border-white/10 rounded-xl p-3 sm:p-4 text-white text-base sm:text-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all outline-none"
                      placeholder="Ton nom"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm text-slate-400 mb-2 font-medium">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full bg-[#1A1D26] border border-white/10 rounded-xl p-3 sm:p-4 text-white text-base sm:text-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all outline-none"
                      placeholder="ton.email@exemple.com"
                    />
                    {formData.email && !isValidEmail(formData.email) && (
                      <p className="mt-2 text-xs text-red-400">Email invalide</p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ÉTAPE 2 : LE PROFIL SCOLAIRE - Une question à la fois */}
          {step === 2 && (
            <motion.div
              key={`step2-${step2SubQuestion}`}
              custom={2}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="w-full h-full flex flex-col"
            >
              <div className="flex-1 flex flex-col justify-center overflow-y-auto px-4 sm:px-0">
                <div className="max-w-2xl mx-auto w-full">
                  
                  {/* Indicateur de progression pour l'étape 2 */}
                  <div className="mb-6 sm:mb-8 text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      {[0, 1, 2].map((index) => (
                        <div
                          key={index}
                          className={`h-2 rounded-full transition-all duration-300 ${
                            index <= step2SubQuestion
                              ? 'bg-indigo-500 w-8'
                              : 'bg-white/10 w-2'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-slate-500">
                      Question {step2SubQuestion + 1} sur 3
                    </p>
                  </div>

                  {/* 1. Ta Classe Actuelle */}
                  {step2SubQuestion === 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h3 className="block text-lg sm:text-xl md:text-2xl text-white mb-6 sm:mb-8 font-semibold text-center">
                        Ta Classe Actuelle ?
                      </h3>
                      <div className="flex flex-wrap gap-3 sm:gap-4 justify-center">
                        {CLASSES.map((classe) => (
                          <motion.button
                            key={classe}
                            onClick={() => handleSelect('classe', classe)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`px-6 sm:px-8 py-3 sm:py-4 rounded-full text-sm sm:text-base font-medium transition-all duration-300 touch-manipulation ${
                              formData.classe === classe
                                ? 'bg-indigo-600 border-2 border-indigo-500 text-white shadow-[0_0_20px_rgba(79,70,229,0.5)]'
                                : 'bg-white/5 border-2 border-white/10 text-slate-400 hover:bg-white/10 hover:border-white/20'
                            }`}
                          >
                            {classe}
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* 2. Ta Filière / Type de Bac */}
                  {step2SubQuestion === 1 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h3 className="block text-lg sm:text-xl md:text-2xl text-white mb-6 sm:mb-8 font-semibold text-center">
                        Ta Filière / Type de Bac ?
                      </h3>
                      <div className="flex flex-wrap gap-3 sm:gap-4 justify-center">
                        {FILIERES.map((filiere) => (
                          <motion.button
                            key={filiere}
                            onClick={() => handleSelect('filiere', filiere)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`px-6 sm:px-8 py-3 sm:py-4 rounded-full text-sm sm:text-base font-medium transition-all duration-300 touch-manipulation ${
                              formData.filiere === filiere
                                ? 'bg-indigo-600 border-2 border-indigo-500 text-white shadow-[0_0_20px_rgba(79,70,229,0.5)]'
                                : 'bg-white/5 border-2 border-white/10 text-slate-400 hover:bg-white/10 hover:border-white/20'
                            }`}
                          >
                            {filiere}
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* 3. Ta Moyenne Générale estimée */}
                  {step2SubQuestion === 2 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h3 className="block text-lg sm:text-xl md:text-2xl text-white mb-6 sm:mb-8 font-semibold text-center">
                        Ta Moyenne Générale estimée ?
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                        {MOYENNES.map((moyenne) => (
                          <motion.button
                            key={moyenne.id}
                            onClick={() => handleSelect('moyenne', moyenne.id)}
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            className={`relative px-4 sm:px-6 py-4 sm:py-5 rounded-xl border-2 transition-all duration-300 text-center touch-manipulation ${
                              formData.moyenne === moyenne.id
                                ? 'border-indigo-400/70 bg-indigo-600/20 text-white shadow-[0_0_20px_rgba(79,70,229,0.3)]'
                                : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/20 hover:bg-white/10'
                            }`}
                          >
                            <div className="text-xl sm:text-2xl font-bold mb-1">
                              {moyenne.label}
                            </div>
                            <div className="text-xs sm:text-sm text-slate-500">
                              {moyenne.description}
                            </div>
                            {formData.moyenne === moyenne.id && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute top-2 right-2 w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center"
                              >
                                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              </motion.div>
                            )}
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* ÉTAPE 3 : LES SPÉCIALITÉS */}
          {step === 3 && formData.classe !== 'Seconde' && (
            <motion.div
              key="step3"
              custom={3}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="w-full h-full flex flex-col"
            >
              <div className="flex-1 flex flex-col justify-center overflow-y-auto px-4 sm:px-0">
                <div className="space-y-6 sm:space-y-8 max-w-2xl mx-auto w-full">
                  
                  {/* Alerte pour Terminale */}
                  <AnimatePresence>
                    {showAlert && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-amber-500/20 border border-amber-500/50 rounded-xl p-3 sm:p-4 text-center"
                      >
                        <p className="text-xs sm:text-sm text-amber-300">
                          En Terminale, on ne garde que 2 spés !
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Spécialités principales ou Séries Techno/Pro */}
                  <div>
                    <label className="block text-base sm:text-lg text-white mb-4 sm:mb-6 font-semibold">
                      {isTechnoPro() 
                        ? 'Quelle est ta série ?'
                        : `Quelles sont tes spécialités ? (${getRequiredSpecsCount()} requises)`
                      }
                    </label>
                    <div className="flex flex-wrap gap-2 sm:gap-3">
                      {(isTechnoPro() ? SERIES_TECHNO_PRO : SPECIALITES_GENERALES).map((spec) => {
                        const isSelected = formData.spes.includes(spec);
                        const requiredCount = getRequiredSpecsCount();
                        const isMaxReached = formData.spes.length >= requiredCount && !isSelected;
                        return (
                          <motion.button
                            key={spec}
                            onClick={() => handleSpecialiteToggle(spec)}
                            whileHover={{ scale: isMaxReached ? 1 : 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            disabled={isMaxReached && !isTechnoPro()}
                            className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                              isSelected
                                ? 'bg-indigo-600 border border-indigo-500 text-white shadow-[0_0_15px_rgba(79,70,229,0.4)]'
                                : isMaxReached && !isTechnoPro()
                                ? 'bg-white/5 border border-white/5 text-slate-500 cursor-not-allowed opacity-50'
                                : 'bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10'
                            }`}
                          >
                            {spec}
                          </motion.button>
                        );
                      })}
                    </div>
                    {formData.spes.length > 0 && (
                      <p className="mt-4 text-xs text-slate-500">
                        Choix : {formData.spes.length} / {getRequiredSpecsCount()}
                      </p>
                    )}
                  </div>

                  {/* Options (Uniquement pour Terminale, Bac+ ou Réorientation) */}
                  {(formData.classe === 'Terminale' || formData.classe === 'Étudiant (Bac+)' || formData.classe === 'En réorientation') && !isTechnoPro() && (
                    <div className="pt-6 border-t border-white/10">
                      <label className="block text-sm text-slate-400 mb-4 font-medium">
                        As-tu une Option ?
                      </label>
                      <div className="flex flex-wrap gap-3">
                        {OPTIONS.map((option) => {
                          const isSelected = formData.options === option;
                          const isMathOption = option === 'Maths Expertes' || option === 'Maths Complémentaire';
                          return (
                            <motion.button
                              key={option}
                              onClick={() => handleOptionSelect(option)}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                                isSelected
                                  ? isMathOption
                                    ? 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border-2 border-amber-500/70 text-white shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                                    : 'bg-violet-600 border border-violet-500 text-white shadow-[0_0_15px_rgba(139,92,246,0.4)]'
                                  : 'bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10'
                              }`}
                            >
                              {option}
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* ÉTAPE 4 : NIVEAU D'ANGLAIS */}
          {step === 4 && (
            <motion.div
              key="step4"
              custom={4}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="w-full h-full flex flex-col"
            >
              <div className="flex-1 flex flex-col justify-center overflow-y-auto px-4 sm:px-0">
                <div className="max-w-3xl mx-auto w-full">
                  <div className="text-center mb-6 sm:mb-8">
                    <h2 className="text-xl sm:text-2xl text-white mb-2 font-semibold">
                      TON NIVEAU D'ANGLAIS ?
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-400">
                      Critère important pour l'admission.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {ENGLISH_LEVELS.map((level, index) => {
                      const isSelected = formData.englishLevel === level.id;
                      return (
                        <motion.button
                          key={level.id}
                          onClick={() => handleSelect('englishLevel', level.id)}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.02, y: -4 }}
                          whileTap={{ scale: 0.98 }}
                          className={`relative p-6 rounded-xl border-2 transition-all duration-300 text-left ${
                            isSelected
                              ? 'bg-indigo-600/20 border-indigo-500 ring-1 ring-indigo-500 shadow-[0_0_20px_rgba(79,70,229,0.3)]'
                              : 'bg-white/5 border-white/10 hover:bg-white/10'
                          }`}
                        >
                          <div className="flex items-start space-x-4">
                            <div className={`p-3 rounded-lg flex-shrink-0 ${
                              isSelected 
                                ? 'bg-indigo-500/20' 
                                : 'bg-white/5'
                            }`}>
                              <Languages className={`w-6 h-6 ${
                                isSelected ? 'text-indigo-400' : 'text-slate-400'
                              }`} strokeWidth={1.5} />
                            </div>
                            <div className="flex-1">
                              <div className={`text-lg font-bold mb-1 ${
                                isSelected ? 'text-white' : 'text-slate-200'
                              }`}>
                                {level.label}
                              </div>
                              <div className={`text-sm font-semibold mb-2 ${
                                isSelected ? 'text-indigo-300' : 'text-slate-400'
                              }`}>
                                {level.subtitle}
                              </div>
                              <div className={`text-xs ${
                                isSelected ? 'text-slate-300' : 'text-slate-500'
                              }`}>
                                {level.description}
                              </div>
                            </div>
                          </div>
                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute top-3 right-3 w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center"
                            >
                              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            </motion.div>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ÉTAPE 5 : L'OBJECTIF */}
          {step === 5 && (
            <motion.div
              key="step5"
              custom={5}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="w-full h-full flex flex-col"
            >
              <div className="flex-1 flex flex-col justify-center px-4 sm:px-0">
                <div className="max-w-2xl mx-auto w-full">
                  <label className="block text-base sm:text-lg text-white mb-6 sm:mb-8 font-semibold text-center">
                    Ton but ultime ?
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    {OBJECTIFS.map((obj, index) => {
                      const Icon = obj.icon;
                      const isSelected = formData.objectif === obj.id;
                      return (
                        <motion.button
                          key={obj.id}
                          onClick={() => handleSelect('objectif', obj.id)}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.02, y: -4 }}
                          whileTap={{ scale: 0.98 }}
                          className={`relative p-8 rounded-2xl border-2 transition-all duration-300 ${
                            isSelected
                              ? 'border-indigo-500 bg-indigo-500/10 shadow-[0_0_20px_rgba(79,70,229,0.3)]'
                              : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                          }`}
                        >
                          <div className="flex flex-col items-center text-center space-y-4">
                            <div className={`p-4 rounded-xl ${
                              isSelected 
                                ? 'bg-indigo-500/20' 
                                : 'bg-white/5'
                            }`}>
                              <Icon className={`w-8 h-8 ${
                                isSelected ? 'text-indigo-400' : 'text-slate-400'
                              }`} strokeWidth={1.5} />
                            </div>
                            <span className={`text-sm font-semibold ${
                              isSelected ? 'text-white' : 'text-slate-300'
                            }`}>
                              {obj.label}
                            </span>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Message de transition pour Seconde */}
      <AnimatePresence>
        {showSecondeMessage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#1A1D26] border border-white/20 rounded-2xl p-8 text-center max-w-md mx-4"
            >
              <p className="text-white text-lg font-medium">
                Profil Seconde détecté. Passage au niveau d'anglais.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bouton de navigation */}
      <div className="mt-6 sm:mt-8 flex justify-center px-4">
        <AnimatePresence>
          {(step === 2 ? isStep2SubQuestionValid() : isStepValid()) && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              onClick={step === 5 ? handleSubmit : handleNext}
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold text-xs sm:text-sm hover:from-indigo-500 hover:to-violet-500 active:from-indigo-700 active:to-violet-700 transition-all duration-200 shadow-lg shadow-indigo-500/20 touch-manipulation"
            >
              {step === 5 
                ? 'LANCER LA MISSION 🚀' 
                : step === 2 && step2SubQuestion < 2
                ? 'SUIVANT →'
                : 'CONTINUER →'
              }
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
