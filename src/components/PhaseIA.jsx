import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Settings, 
  Camera, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Download,
  Code,
  Zap,
  Image as ImageIcon,
  AlertCircle,
  Wand2
} from 'lucide-react';

// Phases du workflow
const PHASES = {
  BRIEF: 'BRIEF',
  SYSTEM_TUNING: 'SYSTEM_TUNING',
  STUDIO_SETUP: 'STUDIO_SETUP',
  QUALITY_CONTROL: 'QUALITY_CONTROL',
  FINAL_REVEAL: 'FINAL_REVEAL'
};

// Options pour SYSTEM_TUNING
const ARCHETYPES = ['Poète Maudit', 'Scientifique', 'Philosophe'];
const CONTRAINTES = ['Pas de Verbes', 'Métaphores Spatiales', 'Langage Binaire'];
const FORMATS = ['1 Ligne', 'Paragraphe', 'Manifeste'];

// Génération de slogans basés sur les paramètres
const generateSlogan = (archetype, contrainte, format) => {
  const slogans = {
    'Poète Maudit-Pas de Verbes-1 Ligne': 'L\'absence dans la présence, le silence dans le souffle.',
    'Poète Maudit-Métaphores Spatiales-1 Ligne': 'Entre le vide et l\'infini, une note suspendue.',
    'Poète Maudit-Langage Binaire-1 Ligne': '0/1. Présence/Absence. ETHER.',
    'Scientifique-Pas de Verbes-1 Ligne': 'Molécules suspendues, équation parfaite.',
    'Scientifique-Métaphores Spatiales-1 Ligne': 'Dans l\'espace entre les atomes, la fragrance.',
    'Scientifique-Langage Binaire-1 Ligne': 'Data/Parfum. Algorithme/Émotion.',
    'Philosophe-Pas de Verbes-1 Ligne': 'L\'être dans le néant, l\'essence dans l\'absence.',
    'Philosophe-Métaphores Spatiales-1 Ligne': 'L\'infini dans le fini, l\'éther dans le vide.',
    'Philosophe-Langage Binaire-1 Ligne': 'Être/Néant. Présence/Absence. ETHER.',
    'Poète Maudit-Pas de Verbes-Paragraphe': 'L\'absence dans la présence, le silence dans le souffle. Une note suspendue entre deux mondes, où le vide devient substance et le néant prend forme.',
    'Poète Maudit-Métaphores Spatiales-Paragraphe': 'Entre le vide et l\'infini, une note suspendue. Dans l\'espace qui sépare l\'être du néant, ETHER naît. Un parfum qui transcende les dimensions, où chaque souffle est un voyage vers l\'inconnu.',
    'Scientifique-Métaphores Spatiales-Paragraphe': 'Dans l\'espace entre les atomes, la fragrance prend vie. ETHER, une composition moléculaire où chaque particule occupe sa place dans l\'équation parfaite de l\'olfaction.',
    'Philosophe-Métaphores Spatiales-1 Ligne': 'L\'infini dans le fini, l\'éther dans le vide.',
    'Philosophe-Métaphores Spatiales-Paragraphe': 'L\'infini dans le fini, l\'éther dans le vide. ETHER transcende la dualité être/néant, créant une fragrance qui questionne l\'essence même de l\'existence.',
  };

  const key = `${archetype}-${contrainte}-${format}`;
  return slogans[key] || 'Une fragrance qui transcende les limites du connu.';
};

// Calcul du score de résonance
const calculateResonance = (archetype, contrainte, format) => {
  // La combinaison gagnante : Philosophe + Métaphores Spatiales + 1 Ligne
  if (archetype === 'Philosophe' && contrainte === 'Métaphores Spatiales' && format === '1 Ligne') {
    return 94;
  }
  
  // Autres bonnes combinaisons
  if (archetype === 'Philosophe' && contrainte === 'Métaphores Spatiales') {
    return 78;
  }
  if (archetype === 'Philosophe' && format === '1 Ligne') {
    return 72;
  }
  if (contrainte === 'Métaphores Spatiales' && format === '1 Ligne') {
    return 68;
  }
  
  // Combinaisons moyennes
  if (archetype === 'Philosophe') {
    return 65;
  }
  if (contrainte === 'Métaphores Spatiales') {
    return 58;
  }
  if (format === '1 Ligne') {
    return 55;
  }
  
  // Première génération toujours moyenne
  return 64;
};

// Zones d'erreur pour QUALITY_CONTROL (positions simulées)
const ERROR_ZONES = [
  { id: 1, x: 35, y: 45, width: 15, height: 8, found: false, description: 'Texte illisible sur le flacon' },
  { id: 2, x: 60, y: 70, width: 8, height: 12, found: false, description: 'Doigt en trop sur la main' },
  { id: 3, x: 25, y: 30, width: 10, height: 10, found: false, description: 'Reflet impossible' }
];

export default function PhaseIA({ onPhaseComplete }) {
  const [phase, setPhase] = useState(PHASES.BRIEF);
  const [systemTuning, setSystemTuning] = useState({
    archetype: ARCHETYPES[0],
    contrainte: CONTRAINTES[0],
    format: FORMATS[0]
  });
  const [currentSlogan, setCurrentSlogan] = useState('');
  const [resonanceScore, setResonanceScore] = useState(null);
  const [testCount, setTestCount] = useState(0);
  const [studioParams, setStudioParams] = useState({
    scale: 50,
    light: 50,
    texture: 50,
    chaos: 50
  });
  const [clientFeedback, setClientFeedback] = useState(null);
  const [studioImage, setStudioImage] = useState(null);
  const [errorZones, setErrorZones] = useState(ERROR_ZONES);
  const [foundErrors, setFoundErrors] = useState(0);
  const [finalSlogan, setFinalSlogan] = useState('');
  const [finalImage, setFinalImage] = useState(null);

  // Phase 1: BRIEF - Auto-avance après 4 secondes
  useEffect(() => {
    if (phase === PHASES.BRIEF) {
      const timer = setTimeout(() => {
        setPhase(PHASES.SYSTEM_TUNING);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  // Phase 2: Générer le premier slogan au chargement
  useEffect(() => {
    if (phase === PHASES.SYSTEM_TUNING && testCount === 0) {
      handleGenerateTest();
    }
  }, [phase]);

  // Phase 3: Générer l'image après le premier ajustement
  useEffect(() => {
    if (phase === PHASES.STUDIO_SETUP && !studioImage) {
      generateStudioImage();
    }
  }, [phase, studioParams]);

  // Générer un test de slogan
  const handleGenerateTest = () => {
    const slogan = generateSlogan(
      systemTuning.archetype,
      systemTuning.contrainte,
      systemTuning.format
    );
    const score = calculateResonance(
      systemTuning.archetype,
      systemTuning.contrainte,
      systemTuning.format
    );
    
    setCurrentSlogan(slogan);
    setResonanceScore(score);
    setTestCount(prev => prev + 1);
  };

  // Passer à la phase suivante
  const handleNextPhase = () => {
    if (phase === PHASES.SYSTEM_TUNING) {
      if (resonanceScore && resonanceScore >= 90) {
        setFinalSlogan(currentSlogan);
        setPhase(PHASES.STUDIO_SETUP);
      }
    } else if (phase === PHASES.STUDIO_SETUP) {
      if (clientFeedback === null || studioParams.light > 60) {
        setPhase(PHASES.QUALITY_CONTROL);
      }
    } else if (phase === PHASES.QUALITY_CONTROL) {
      if (foundErrors === 3) {
        setPhase(PHASES.FINAL_REVEAL);
      }
    }
  };

  // Générer l'image du studio (simulé)
  const generateStudioImage = () => {
    // Simuler une image générée
    setStudioImage('generated');
    
    // Après le premier réglage, afficher le feedback client
    if (testCount > 0 && !clientFeedback) {
      setTimeout(() => {
        setClientFeedback({
          message: "C'est trop sombre ! On ne voit pas le flacon. Éclaircissez sans perdre le mystère.",
          type: 'warning'
        });
      }, 2000);
    }
  };

  // Gérer les changements de paramètres studio
  const handleStudioParamChange = (param, value) => {
    setStudioParams(prev => ({ ...prev, [param]: value }));
    
    // Générer une nouvelle image après ajustement
    if (studioImage) {
      setTimeout(() => {
        generateStudioImage();
      }, 500);
    }
    
    // Vérifier si le feedback est résolu
    if (clientFeedback && param === 'light' && value > 60) {
      setTimeout(() => {
        setClientFeedback({
          message: "Parfait ! Le flacon est maintenant visible tout en gardant l'atmosphère mystérieuse.",
          type: 'success'
        });
      }, 1000);
    }
  };

  // Cliquer sur une zone d'erreur
  const handleErrorZoneClick = (zoneId) => {
    setErrorZones(prev => 
      prev.map(zone => 
        zone.id === zoneId ? { ...zone, found: true } : zone
      )
    );
    setFoundErrors(prev => prev + 1);
  };

  // Vérifier si un clic est dans une zone d'erreur
  const handleImageClick = (e) => {
    if (phase !== PHASES.QUALITY_CONTROL || foundErrors === 3) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    errorZones.forEach(zone => {
      if (!zone.found) {
        const inZone = 
          x >= zone.x && 
          x <= zone.x + zone.width &&
          y >= zone.y && 
          y <= zone.y + zone.height;
        
        if (inZone) {
          handleErrorZoneClick(zone.id);
        }
      }
    });
  };

  // Terminer le jeu
  const handleComplete = () => {
    if (onPhaseComplete) {
      onPhaseComplete({
        albert: 0,
        eugenia: 1,
        clueWon: true
      });
    }
  };

  return (
    <div className="fixed inset-0 w-screen h-screen bg-[#050505] text-[#E0E0E0] z-[9999] font-sans flex flex-col overflow-hidden">
      <AnimatePresence mode="wait">
        {/* PHASE 1 : BRIEF */}
        {phase === PHASES.BRIEF && (
          <motion.div
            key="brief"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-12"
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="max-w-4xl w-full space-y-6 sm:space-y-8 px-4"
            >
              <div className="text-center mb-8 sm:mb-12">
                <motion.h1
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-tight mb-4"
                  style={{ color: '#E0E0E0', letterSpacing: '-0.02em' }}
                >
                  MAISON ETHER
                </motion.h1>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '120px' }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                  className="h-px bg-[#D4AF37] mx-auto"
                />
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="space-y-4 sm:space-y-6 text-center"
              >
                <div>
                  <h2 className="text-xs sm:text-sm font-medium text-[#888] mb-2 sm:mb-3 uppercase tracking-widest">PRODUIT</h2>
                  <p className="text-xl sm:text-2xl text-[#E0E0E0] font-light">"VOID"</p>
                  <p className="text-xs sm:text-sm text-[#888] mt-2 italic">Le premier parfum généré par algorithme</p>
                </div>

                <div className="pt-6 sm:pt-8">
                  <h2 className="text-xs sm:text-sm font-medium text-[#888] mb-3 sm:mb-4 uppercase tracking-widest">BRIEF</h2>
                  <p className="text-base sm:text-lg text-[#E0E0E0] leading-relaxed max-w-2xl mx-auto font-light px-4">
                    "Nous voulons une campagne qui ne ressemble à rien de connu.<br />
                    Ni humain, ni robotique.<br />
                    <span className="text-[#D4AF37]">Transcendant.</span>"
                  </p>
                </div>

                <div className="pt-6 sm:pt-8">
                  <h2 className="text-xs sm:text-sm font-medium text-[#888] mb-3 sm:mb-4 uppercase tracking-widest">VOTRE RÔLE</h2>
                  <p className="text-sm sm:text-base text-[#E0E0E0] font-light px-4">
                    Configurer le modèle de langage et le modèle visuel.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                className="flex justify-center pt-12"
              >
                <motion.div
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-[#D4AF37] text-sm tracking-widest uppercase"
                >
                  ENTRER DANS LE SYSTÈME
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}

        {/* PHASE 2 : SYSTEM TUNING */}
        {phase === PHASES.SYSTEM_TUNING && (
          <motion.div
            key="system-tuning"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-1 flex flex-col md:flex-row h-full"
          >
            {/* GAUCHE : Code Editor */}
            <div className="w-full md:w-1/2 border-b md:border-b-0 md:border-r border-[0.5px] border-[#333] p-4 sm:p-6 md:p-8 overflow-y-auto">
              <div className="mb-6">
                <h2 className="text-xl font-light text-[#E0E0E0] mb-1 flex items-center gap-2">
                  <Code className="h-5 w-5 text-[#D4AF37]" />
                  CONFIGURATION SYSTÈME
                </h2>
                <p className="text-xs text-[#888] mt-1">Programmer l'ADN de l'IA</p>
              </div>

              <div className="space-y-6">
                {/* ARCHÉTYPE */}
                <div>
                  <label className="block text-xs font-medium text-[#888] mb-3 uppercase tracking-wider">
                    ARCHÉTYPE
                  </label>
                  <div className="space-y-2">
                    {ARCHETYPES.map((arch) => (
                      <motion.button
                        key={arch}
                        onClick={() => setSystemTuning(prev => ({ ...prev, archetype: arch }))}
                        className={`w-full px-4 py-3 text-left border border-[0.5px] rounded transition-all ${
                          systemTuning.archetype === arch
                            ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-[#E0E0E0]'
                            : 'border-[#333] text-[#888] hover:border-[#555]'
                        }`}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <span className="text-sm">[{arch}]</span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* CONTRAINTE */}
                <div>
                  <label className="block text-xs font-medium text-[#888] mb-3 uppercase tracking-wider">
                    CONTRAINTE
                  </label>
                  <div className="space-y-2">
                    {CONTRAINTES.map((cont) => (
                      <motion.button
                        key={cont}
                        onClick={() => setSystemTuning(prev => ({ ...prev, contrainte: cont }))}
                        className={`w-full px-4 py-3 text-left border border-[0.5px] rounded transition-all ${
                          systemTuning.contrainte === cont
                            ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-[#E0E0E0]'
                            : 'border-[#333] text-[#888] hover:border-[#555]'
                        }`}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <span className="text-sm">[{cont}]</span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* FORMAT */}
                <div>
                  <label className="block text-xs font-medium text-[#888] mb-3 uppercase tracking-wider">
                    FORMAT
                  </label>
                  <div className="space-y-2">
                    {FORMATS.map((fmt) => (
                      <motion.button
                        key={fmt}
                        onClick={() => setSystemTuning(prev => ({ ...prev, format: fmt }))}
                        className={`w-full px-4 py-3 text-left border border-[0.5px] rounded transition-all ${
                          systemTuning.format === fmt
                            ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-[#E0E0E0]'
                            : 'border-[#333] text-[#888] hover:border-[#555]'
                        }`}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <span className="text-sm">[{fmt}]</span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* DROITE : Chatbot Test */}
            <div className="w-full md:w-1/2 p-4 sm:p-6 md:p-8 overflow-y-auto bg-[#0a0a0a]">
              <div className="mb-6">
                <h2 className="text-xl font-light text-[#E0E0E0] mb-1 flex items-center gap-2">
                  <Zap className="h-5 w-5 text-[#D4AF37]" />
                  TEST DE GÉNÉRATION
                </h2>
                <p className="text-xs text-[#888] mt-1">Vérifier la résonance</p>
              </div>

              <div className="space-y-6">
                <motion.button
                  onClick={handleGenerateTest}
                  className="w-full py-4 px-6 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded text-[#D4AF37] font-medium hover:bg-[#D4AF37]/15 transition-all flex items-center justify-center gap-2 tracking-wider uppercase text-xs"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Wand2 className="h-4 w-4" />
                  GÉNÉRER UN TEST
                </motion.button>

                {currentSlogan && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    className="p-6 bg-[#111] border border-[#333] rounded"
                  >
                    <p className="text-[#E0E0E0] leading-relaxed font-light text-sm">
                      {currentSlogan}
                    </p>
                  </motion.div>
                )}

                {resonanceScore !== null && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#888] uppercase tracking-wider">Résonance</span>
                      <span className={`text-2xl font-mono ${
                        resonanceScore >= 90 ? 'text-[#D4AF37]' : 
                        resonanceScore >= 70 ? 'text-[#E0E0E0]' : 
                        'text-[#888]'
                      }`}>
                        {resonanceScore}%
                      </span>
                    </div>
                    <div className="h-2 bg-[#111] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${resonanceScore}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className={`h-full ${
                          resonanceScore >= 90 ? 'bg-[#D4AF37]' : 
                          resonanceScore >= 70 ? 'bg-[#E0E0E0]' : 
                          'bg-[#666]'
                    }`}
                  />
                    </div>
                    {resonanceScore < 90 && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-xs text-[#888] italic"
                      >
                        {resonanceScore < 70 ? 'Trop froid...' : 'Trop verbeux...'}
                    </motion.p>
                  )}
                  </motion.div>
                )}

                {resonanceScore !== null && resonanceScore >= 90 && (
              <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                onClick={handleNextPhase}
                    className="w-full py-4 px-6 bg-[#D4AF37]/20 border border-[#D4AF37] rounded text-[#D4AF37] font-medium hover:bg-[#D4AF37]/30 transition-all flex items-center justify-center gap-2 tracking-wider uppercase text-xs"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <CheckCircle className="h-4 w-4" />
                    VALIDER LA CONFIGURATION
              </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* PHASE 3 : STUDIO SETUP */}
        {phase === PHASES.STUDIO_SETUP && (
          <motion.div
            key="studio-setup"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-1 flex flex-col h-full"
          >
            {/* Header */}
            <div className="p-4 sm:p-6 border-b border-[#333]">
              <h2 className="text-lg sm:text-xl font-light text-[#E0E0E0] flex items-center gap-2">
                <Camera className="h-4 w-4 sm:h-5 sm:w-5 text-[#D4AF37]" />
                STUDIO PHOTO
                </h2>
              <p className="text-xs text-[#888] mt-1">Créer le visuel Hero</p>
              </div>

            {/* Viewport Centre */}
            <div className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-[#0a0a0a]">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-2xl h-full max-h-[400px] sm:max-h-[500px] md:max-h-[600px] bg-[#111] border border-[#333] rounded-lg flex items-center justify-center relative overflow-hidden"
              >
                {studioImage ? (
                  <div className="w-full h-full bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <ImageIcon className="h-16 w-16 text-[#333] mx-auto" />
                      <p className="text-sm text-[#666]">Visuel généré</p>
                      <p className="text-xs text-[#444]">Flacon ETHER - VOID</p>
            </div>
                  </div>
                ) : (
                  <div className="text-center space-y-4">
                    <ImageIcon className="h-16 w-16 text-[#333] mx-auto" />
                    <p className="text-sm text-[#666]">Ajustez les paramètres pour générer</p>
                  </div>
                )}
              </motion.div>
              </div>

            {/* Feedback Client */}
              <AnimatePresence>
              {clientFeedback && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                  className={`mx-8 mb-4 p-4 rounded border ${
                    clientFeedback.type === 'success' 
                      ? 'bg-[#1a2e1a] border-[#4a7c4a] text-[#8fcc8f]'
                      : 'bg-[#2e1a1a] border-[#7c4a4a] text-[#cc8f8f]'
                  }`}
                >
                  <div className="flex items-start gap-3">
                      <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <p className="text-sm">{clientFeedback.message}</p>
                  </div>
                  </motion.div>
                )}
              </AnimatePresence>

            {/* Table de Mixage - Sliders */}
            <div className="p-4 sm:p-6 md:p-8 border-t border-[#333] bg-[#0a0a0a]">
              <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {/* SCALE */}
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-xs text-[#888] uppercase tracking-wider">SCALE</label>
                    <span className="text-xs text-[#E0E0E0] font-mono">{studioParams.scale}%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-[#666] w-20">Macro</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={studioParams.scale}
                      onChange={(e) => handleStudioParamChange('scale', parseInt(e.target.value))}
                      className="flex-1 h-1 bg-[#111] rounded-lg appearance-none cursor-pointer accent-[#D4AF37]"
                    />
                    <span className="text-xs text-[#666] w-20 text-right">Grand Angle</span>
                  </div>
                </div>

                {/* LIGHT */}
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-xs text-[#888] uppercase tracking-wider">LIGHT</label>
                    <span className="text-xs text-[#E0E0E0] font-mono">{studioParams.light}%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-[#666] w-20">Sombre</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={studioParams.light}
                      onChange={(e) => handleStudioParamChange('light', parseInt(e.target.value))}
                      className="flex-1 h-1 bg-[#111] rounded-lg appearance-none cursor-pointer accent-[#D4AF37]"
                    />
                    <span className="text-xs text-[#666] w-20 text-right">Éblouissant</span>
                  </div>
                </div>

                {/* TEXTURE */}
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-xs text-[#888] uppercase tracking-wider">TEXTURE</label>
                    <span className="text-xs text-[#E0E0E0] font-mono">{studioParams.texture}%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-[#666] w-20">Liquide</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={studioParams.texture}
                      onChange={(e) => handleStudioParamChange('texture', parseInt(e.target.value))}
                      className="flex-1 h-1 bg-[#111] rounded-lg appearance-none cursor-pointer accent-[#D4AF37]"
                    />
                    <span className="text-xs text-[#666] w-20 text-right">Métal</span>
                  </div>
                </div>

                {/* CHAOS */}
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-xs text-[#888] uppercase tracking-wider">CHAOS</label>
                    <span className="text-xs text-[#E0E0E0] font-mono">{studioParams.chaos}%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-[#666] w-20">Stable</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={studioParams.chaos}
                      onChange={(e) => handleStudioParamChange('chaos', parseInt(e.target.value))}
                      className="flex-1 h-1 bg-[#111] rounded-lg appearance-none cursor-pointer accent-[#D4AF37]"
                    />
                    <span className="text-xs text-[#666] w-20 text-right">Expérimental</span>
                  </div>
                </div>
              </div>

              {clientFeedback?.type === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-center mt-6"
                >
                      <motion.button
                      onClick={handleNextPhase}
                    className="px-8 py-3 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded text-[#D4AF37] font-medium hover:bg-[#D4AF37]/15 transition-all flex items-center justify-center gap-2 tracking-wider uppercase text-xs"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <CheckCircle className="h-4 w-4" />
                    ENVOYER AU LABO DE RETOUCHE
                    </motion.button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {/* PHASE 4 : QUALITY CONTROL */}
        {phase === PHASES.QUALITY_CONTROL && (
          <motion.div
            key="quality-control"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-1 flex flex-col h-full"
          >
            {/* Header */}
            <div className="p-4 sm:p-6 border-b border-[#333]">
              <h2 className="text-lg sm:text-xl font-light text-[#E0E0E0] flex items-center gap-2">
                <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-[#D4AF37]" />
                QUALITY CONTROL
              </h2>
              <p className="text-xs text-[#888] mt-1">Nettoyer les erreurs de l'IA</p>
            </div>

            {/* Instructions */}
            <div className="p-4 sm:p-6 bg-[#0a0a0a] border-b border-[#333]">
              <p className="text-xs sm:text-sm text-[#E0E0E0]">
                L'IA a généré <span className="text-[#D4AF37]">3 anomalies</span>. Trouvez-les et corrigez-les.
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-3 sm:gap-4">
                <span className="text-xs text-[#888]">Erreurs trouvées :</span>
                <div className="flex gap-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                        i <= foundErrors
                          ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#D4AF37]'
                          : 'bg-[#111] border-[#333] text-[#666]'
                      }`}
                    >
                      {i <= foundErrors ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Image avec zones cliquables */}
            <div className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-[#0a0a0a] overflow-hidden">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={handleImageClick}
                className="relative w-full max-w-4xl h-full max-h-[50vh] sm:max-h-[60vh] md:max-h-[70vh] bg-[#111] border border-[#333] rounded-lg overflow-hidden cursor-crosshair"
              >
                {/* Image placeholder */}
                <div className="w-full h-full bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <ImageIcon className="h-20 w-20 text-[#333] mx-auto" />
                    <p className="text-sm text-[#666]">Visuel généré - Cliquez sur les erreurs</p>
                  </div>
              </div>

                {/* Zones d'erreur (invisibles mais cliquables) */}
                {errorZones.map((zone) => (
                  <motion.div
                    key={zone.id}
                    className={`absolute border-2 rounded ${
                      zone.found 
                        ? 'border-[#4a7c4a] bg-[#4a7c4a]/20' 
                        : 'border-transparent hover:border-[#D4AF37]/30'
                    }`}
                    style={{
                      left: `${zone.x}%`,
                      top: `${zone.y}%`,
                      width: `${zone.width}%`,
                      height: `${zone.height}%`,
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ 
                      opacity: zone.found ? 1 : 0,
                      scale: zone.found ? [1, 1.1, 1] : 1
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {zone.found && (
                      <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                        className="absolute inset-0 flex items-center justify-center"
                >
                        <div className="bg-[#4a7c4a] text-[#8fcc8f] px-3 py-1 rounded text-xs">
                          INPAINTING...
              </div>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </motion.div>
              </div>

            {/* Status */}
            {foundErrors === 3 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 sm:p-6 bg-[#1a2e1a] border-t border-[#4a7c4a]"
              >
                <div className="flex flex-col sm:flex-row items-center justify-between max-w-4xl mx-auto gap-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-6 w-6 text-[#8fcc8f]" />
                    <p className="text-[#8fcc8f] font-medium">VISUEL APPROUVÉ</p>
                  </div>
              <motion.button
                onClick={handleNextPhase}
                    className="px-6 py-2 bg-[#4a7c4a] border border-[#8fcc8f]/30 rounded text-[#8fcc8f] font-medium hover:bg-[#5a8c5a] transition-all flex items-center justify-center gap-2 tracking-wider uppercase text-xs"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    CONTINUER
              </motion.button>
                </div>
            </motion.div>
            )}
          </motion.div>
        )}

        {/* PHASE 5 : FINAL REVEAL */}
        {phase === PHASES.FINAL_REVEAL && (
          <motion.div
            key="final-reveal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 md:p-12"
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="max-w-5xl w-full space-y-6 sm:space-y-8 md:space-y-12 px-4"
            >
              {/* Titre */}
              <div className="text-center">
                <motion.h1
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight mb-4 text-[#E0E0E0]"
                >
                  CAMPAGNE ETHER
                </motion.h1>
                    <motion.div
                      initial={{ width: 0 }}
                  animate={{ width: '200px' }}
                  transition={{ duration: 0.8, delay: 0.7 }}
                  className="h-px bg-[#D4AF37] mx-auto"
                />
                </div>

              {/* Slogan Final */}
                    <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.9 }}
                className="p-4 sm:p-6 md:p-8 bg-[#111] border border-[#333] rounded-lg"
              >
                <h3 className="text-xs text-[#888] mb-3 sm:mb-4 uppercase tracking-wider">SLOGAN</h3>
                <p className="text-lg sm:text-xl md:text-2xl text-[#E0E0E0] font-light leading-relaxed">
                  {finalSlogan || currentSlogan}
                </p>
              </motion.div>

              {/* Visuel Final */}
                    <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.1 }}
                className="p-4 sm:p-6 md:p-8 bg-[#111] border border-[#333] rounded-lg"
              >
                <h3 className="text-xs text-[#888] mb-3 sm:mb-4 uppercase tracking-wider">VISUEL</h3>
                <div className="w-full h-48 sm:h-56 md:h-64 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] rounded flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <ImageIcon className="h-12 w-12 text-[#333] mx-auto" />
                    <p className="text-sm text-[#666]">Visuel final approuvé</p>
                  </div>
                </div>
              </motion.div>

              {/* Analyse Compétence */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.3 }}
                className="p-4 sm:p-6 md:p-8 bg-[#111] border border-[#333] rounded-lg"
              >
                <h3 className="text-xs text-[#888] mb-4 sm:mb-6 uppercase tracking-wider">ANALYSE COMPÉTENCE</h3>
                <div className="space-y-3 sm:space-y-4">
                  <p className="text-base sm:text-lg text-[#E0E0E0] font-light mb-3 sm:mb-4">
                    Vous êtes un <span className="text-[#D4AF37]">DIRECTEUR ARTISTIQUE IA</span>.
                  </p>
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-[#D4AF37] mt-0.5 flex-shrink-0" />
                  <div>
                        <p className="text-sm font-medium text-[#E0E0E0] mb-1">Patience (Itération)</p>
                        <p className="text-xs text-[#888]">Vous avez testé {testCount} configurations avant de trouver la résonance parfaite.</p>
                    </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-[#D4AF37] mt-0.5 flex-shrink-0" />
                  <div>
                        <p className="text-sm font-medium text-[#E0E0E0] mb-1">Précision (Paramétrie)</p>
                        <p className="text-xs text-[#888]">Vous avez ajusté les paramètres visuels jusqu'à satisfaire le client.</p>
                    </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-[#D4AF37] mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-[#E0E0E0] mb-1">Rigueur (QA)</p>
                        <p className="text-xs text-[#888]">Vous avez identifié et corrigé toutes les anomalies générées par l'IA.</p>
                  </div>
                </div>
                  </div>
                  </div>
              </motion.div>

              {/* Bouton Export */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.5 }}
                className="flex justify-center"
              >
              <motion.button
                onClick={handleComplete}
                  className="w-full sm:w-auto px-8 sm:px-12 py-3 sm:py-4 bg-[#D4AF37]/10 border border-[#D4AF37] rounded text-[#D4AF37] font-medium hover:bg-[#D4AF37]/20 transition-all flex items-center justify-center gap-2 sm:gap-3 tracking-wider uppercase text-xs sm:text-sm"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Download className="h-4 w-4 sm:h-5 sm:w-5" />
                  EXPORTER LA CAMPAGNE
              </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
