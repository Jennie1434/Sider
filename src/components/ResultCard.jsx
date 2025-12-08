import React, { useEffect, useRef } from 'react';

const ResultCard = ({ profile, scoreAlbert, scoreEugenia, userProfile, onComplete }) => {
  console.log('🎴 ResultCard rendu');
  console.log('🎴 ResultCard - onComplete disponible?', typeof onComplete === 'function');
  console.log('🎴 ResultCard - Scores:', { albert: scoreAlbert, eugenia: scoreEugenia });
  
  // Protection contre les sauvegardes multiples
  const hasSavedRef = useRef(false);
  
  // Logique de score
  const isEugenia = scoreEugenia > scoreAlbert;
  const isNeutral = scoreEugenia === scoreAlbert;

  // Utiliser le matchPercentage du profile si disponible, sinon calculer
  const matchPercent = profile?.matchPercentage || (isNeutral ? 50 : (isEugenia ? Math.round((scoreEugenia / (scoreAlbert + scoreEugenia)) * 100) : Math.round((scoreAlbert / (scoreAlbert + scoreEugenia)) * 100)));

  // Fonction pour déterminer le CTA selon la classe
  const getCallToAction = () => {
    const classe = userProfile?.classe || '';
    const filiere = userProfile?.filiere || '';
    
    // Cas TERMINALE / ETUDIANT (Bac+)
    if (classe === 'Terminale' || classe === 'Étudiant (Bac+)' || classe === 'En réorientation') {
      return {
        message: 'Les admissions sont ouvertes. Ton profil matche.',
        button: 'PRENDRE RDV / CANDIDATER'
      };
    }
    
    // Cas SECONDE / PREMIERE
    if (classe === 'Seconde' || classe === 'Première') {
      return {
        message: 'Il est tôt, mais tu as le bon profil. Viens voir le campus.',
        button: 'VOIR LES PROCHAINES JPO'
      };
    }
    
    // Cas AUTRE / BAC PRO
    if (filiere === 'Professionnelle' || filiere === 'Technologique (STI2D, STMG...)') {
      return {
        message: 'Ton parcours est singulier. Discutons de tes options.',
        button: 'PARLER À UN CONSEILLER'
      };
    }
    
    // Par défaut
    return {
      message: 'Ton profil est prometteur. Discutons de ton avenir.',
      button: 'CONTINUER'
    };
  };

  // Fonction pour obtenir le conseil anglais
  const getEnglishAdvice = () => {
    const englishLevel = userProfile?.englishLevel || '';
    
    if (englishLevel === 'A1-A2' || englishLevel === 'B1') {
      return {
        type: 'conseil',
        text: '💡 Conseil : Un renforcement en anglais sera clé pour ton succès.'
      };
    }
    
    if (englishLevel === 'B2' || englishLevel === 'C1-C2') {
      return {
        type: 'atout',
        text: '✨ Atout : Ton niveau d\'anglais est un accélérateur.'
      };
    }
    
    return null;
  };

  // Fonction pour personnaliser le sous-titre selon l'objectif
  const getPersonalizedSubtitle = (baseSubtitle) => {
    const objectif = userProfile?.objectif || '';
    
    if (objectif === 'entreprise') {
      return `${baseSubtitle} - Profil Entrepreneur`;
    }
    
    if (objectif === 'expert') {
      return `${baseSubtitle} - Profil Tech`;
    }
    
    return baseSubtitle;
  };

  const cta = getCallToAction();
  const englishAdvice = getEnglishAdvice();
  
  console.log('🎴 ResultCard - CTA button text:', cta.button);
  console.log('🎴 ResultCard - Bouton sera rendu avec le texte:', cta.button || 'CONTINUER');

  // Sauvegarde automatique dès l'affichage du résultat (une seule fois)
  useEffect(() => {
    // Protection : ne sauvegarder qu'une seule fois
    if (hasSavedRef.current) {
      console.log('⏭️ Sauvegarde déjà effectuée, on skip');
      return;
    }

    if (onComplete && typeof onComplete === 'function') {
      hasSavedRef.current = true; // Marquer comme sauvegardé AVANT l'appel
      console.log('💾 Sauvegarde automatique déclenchée (une seule fois)...');
      (async () => {
        try {
          console.log('💾 Appel automatique de onComplete...');
          const result = await onComplete({ 
            albert: scoreAlbert, 
            eugenia: scoreEugenia, 
            profile 
          });
          console.log('✅ Sauvegarde automatique réussie');
          console.log('✅ Résultat:', result);
        } catch (error) {
          console.error('❌ Erreur lors de la sauvegarde automatique:', error);
          // En cas d'erreur, on peut réinitialiser pour permettre une nouvelle tentative
          // hasSavedRef.current = false;
        }
      })();
    } else {
      console.warn('⚠️ onComplete non disponible pour la sauvegarde automatique');
    }
  }, []); // Exécuter une seule fois au montage du composant

  // Configuration Thème
  const theme = {
    albert: {
      // Dégradé Bleu Roi
      bgGradient: "from-blue-600 to-blue-800",
      accentColor: "#60A5FA", // Bleu clair pour les détails
      title: profile?.badge || "ELITE ANALYST",
      sub: getPersonalizedSubtitle(profile?.subtitle || "CIBLE ALBERT SCHOOL"),
      // Logo Albert Placeholder (Style filaire technique)
      logoSvg: (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-lg">
           <circle cx="50" cy="50" r="45" stroke="white" strokeWidth="2" strokeDasharray="4 4"/>
           <path d="M50 25V75M25 50H75" stroke="white" strokeWidth="2" strokeLinecap="round"/>
           <circle cx="50" cy="50" r="10" fill="white"/>
           <text x="50" y="95" textAnchor="middle" fill="white" fontSize="12" letterSpacing="0.1em" fontWeight="bold">ALBERT SCHOOL</text>
        </svg>
      )
    },
    eugenia: {
      // Dégradé Rose/Bordeaux fourni
      bgGradient: "from-[#E33054] to-[#671324]",
      accentColor: "#D4AF37", // Or/Jaune du logo
      title: profile?.badge || "FUTURE MAKER",
      sub: getPersonalizedSubtitle(profile?.subtitle || "CIBLE EUGENIA SCHOOL"),
      // VRAI LOGO EUGENIA RECRÉÉ (Cercle Or + Point Blanc + Texte)
      logoSvg: (
        <svg viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-xl">
            {/* Grand Cercle Doré */}
            <circle cx="100" cy="70" r="50" fill="#D4AF37" />
            {/* Petit Point Blanc */}
            <circle cx="75" cy="50" r="12" fill="white" />
            {/* Texte Eugenia School */}
            <text x="100" y="145" textAnchor="middle" fill="white" fontFamily="sans-serif" fontWeight="bold" fontSize="20" letterSpacing="0.1em">EUGENIA</text>
            <text x="100" y="168" textAnchor="middle" fill="white" fontFamily="sans-serif" fontWeight="bold" fontSize="20" letterSpacing="0.1em">SCHOOL</text>
        </svg>
      )
    },
    neutral: {
      bgGradient: "from-gray-600 to-gray-800",
      accentColor: "#9CA3AF",
      title: profile?.badge || "THE EXPLORER",
      sub: profile?.subtitle || "PROFIL HYBRIDE",
      logoSvg: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-lg">
          <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2"/>
          <path d="M12 6V12L16 14" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    }
  };

  const currentProfile = isNeutral ? theme.neutral : (isEugenia ? theme.eugenia : theme.albert);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0B0C15] p-4 sm:p-6 overflow-hidden" style={{ pointerEvents: 'auto' }}>
      
      {/* LA CARTE (Container Flex Horizontal) */}
      <div 
        className={`
          relative w-full max-w-[480px] 
          bg-gradient-to-br ${currentProfile.bgGradient} 
          rounded-2xl sm:rounded-[2rem] p-4 sm:p-6 
          text-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] 
          flex flex-col sm:flex-row items-center justify-between
          min-h-[200px] sm:h-[240px]
          border border-white/10
        `}
      >
        
        {/* GAUCHE : Header et Titres */}
        <div className="flex-1 space-y-1 sm:space-y-1.5 text-left z-10 w-full sm:w-auto mb-4 sm:mb-0">
          <p className="text-[8px] sm:text-[9px] tracking-[0.25em] uppercase opacity-70">Certification Officielle</p>
          <h1 className="text-xl sm:text-2xl font-black uppercase leading-none tracking-tight drop-shadow-sm">
            {currentProfile.title}
          </h1>
          <div className="h-0.5 w-8 sm:w-10 bg-white/30 rounded-full my-1 sm:my-1.5"></div>
          <p className="text-[9px] sm:text-[10px] tracking-[0.12em] font-bold opacity-90 uppercase">
            {currentProfile.sub}
          </p>
        </div>

        {/* CENTRE : LOGO (Parfaitement cadré) */}
        <div className="mx-0 sm:mx-4 transform transition-transform hover:scale-105 duration-500 z-10 mb-4 sm:mb-0">
           <div className="w-20 h-20 sm:w-24 sm:h-24">
             {currentProfile.logoSvg}
           </div>
        </div>

        {/* DROITE : SCORE */}
        <div className="flex-1 text-right sm:text-right z-10 w-full sm:w-auto text-center sm:text-right">
          <span className="text-4xl sm:text-5xl font-black block leading-none drop-shadow-md">
            {matchPercent}%
          </span>
          <span className="text-[8px] sm:text-[9px] tracking-[0.3em] uppercase opacity-70">Compatibilité</span>
        </div>

        {/* Bruit de texture subtil */}
        <div className="absolute inset-0 bg-white opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] pointer-events-none rounded-[2rem]"></div>

      </div>

      {/* Message et conseil (optionnel) */}
      {profile?.message && (
        <div className="mt-6 sm:mt-8 max-w-md text-center px-4">
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4">
            {profile.message}
          </p>
          {profile?.advice && (
            <div className="mb-4 sm:mb-6 bg-white/5 border border-white/10 rounded-xl p-3 sm:p-4">
              <p className="text-slate-400 text-xs leading-relaxed">
                {profile.advice}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Conseil Anglais */}
      {englishAdvice && (
        <div className={`mt-4 sm:mt-6 max-w-md text-center px-4 ${
          englishAdvice.type === 'atout' 
            ? 'bg-emerald-500/10 border border-emerald-500/30' 
            : 'bg-amber-500/10 border border-amber-500/30'
        } rounded-xl p-3 sm:p-4`}>
          <p className={`text-xs sm:text-sm leading-relaxed ${
            englishAdvice.type === 'atout' 
              ? 'text-emerald-300' 
              : 'text-amber-300'
          }`}>
            {englishAdvice.text}
          </p>
        </div>
      )}

      {/* Message CTA personnalisé */}
      <div className="mt-6 sm:mt-8 max-w-md text-center px-4">
        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6">
          {cta.message}
        </p>
      </div>

      {/* BOUTON CTA personnalisé */}
      <button 
        onClick={async () => {
          // Protection : éviter la double sauvegarde
          if (hasSavedRef.current) {
            console.log('⏭️ Bouton cliqué mais sauvegarde déjà effectuée automatiquement');
            return;
          }

          console.log('🎯 ============================================');
          console.log('🎯 ResultCard: Bouton cliqué!');
          console.log('🎯 ============================================');
          console.log('📊 Scores Albert:', scoreAlbert);
          console.log('📊 Scores Eugenia:', scoreEugenia);
          console.log('📊 Profile:', profile);
          console.log('📊 onComplete disponible?', typeof onComplete === 'function');
          
          if (!onComplete) {
            console.error('❌ ERREUR: onComplete n\'est pas défini!');
            alert('❌ Erreur: La fonction de sauvegarde n\'est pas disponible.\n\nVérifiez la console pour plus de détails.');
            return;
          }
          
          hasSavedRef.current = true; // Marquer comme sauvegardé
          
          try {
            console.log('🎯 Appel de onComplete depuis le bouton...');
            const result = await onComplete({ 
              albert: scoreAlbert, 
              eugenia: scoreEugenia, 
              profile 
            });
            console.log('✅ onComplete appelé avec succès');
            console.log('✅ Résultat:', result);
          } catch (error) {
            console.error('❌ ============================================');
            console.error('❌ ERREUR lors de l\'appel onComplete!');
            console.error('❌ Erreur:', error);
            console.error('❌ Message:', error.message);
            console.error('❌ Stack:', error.stack);
            console.error('❌ ============================================');
            alert(`❌ Erreur lors de la sauvegarde:\n\n${error.message}\n\nVérifiez la console pour plus de détails.`);
          }
        }} 
        className="mt-4 w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-xs sm:text-sm rounded-full uppercase tracking-[0.1em] transition-all hover:scale-105 shadow-lg shadow-indigo-500/20 relative z-50 cursor-pointer max-w-md mx-4 sm:mx-0"
        style={{ zIndex: 9999 }}
      >
        {cta.button || 'CONTINUER'}
      </button>

    </div>
  );
};

export default ResultCard;
