import { useState, useEffect, useCallback } from 'react';
import PhaseIA from './components/profiling/PhaseIA';
import Onboarding from './components/Onboarding';
import AdminDashboard from './components/AdminDashboard';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase/config';
import { ScoringProvider, useScoring } from './context/ScoringContext';
import { calculateScoresFromUserData } from './utils/scoringRules';
import { isAdminAuthenticated, authenticateAdmin } from './config/adminConfig';

function AppContent() {
  const { scoreAlbert, scoreEugenia, resetScores, getFinalProfile, addScore } = useScoring();
  const [step, setStep] = useState('welcome'); // 'welcome', 'onboarding', 'phaseIA', ou 'admin'
  const [userData, setUserData] = useState(null);

  // Fonction pour gérer l'accès admin avec authentification
  const handleAdminAccess = useCallback(() => {
    // Demander le code secret
    const code = prompt('🔐 Accès réservé aux directeurs d\'école\n\nVeuillez entrer le code d\'accès:');
    
    if (!code) {
      return; // L'utilisateur a annulé
    }
    
    // Vérifier le code
    if (authenticateAdmin(code.trim())) {
      setStep('admin');
    } else {
      alert('❌ Code d\'accès incorrect. Accès refusé.');
    }
  }, [setStep]);

  // Test de connexion Firebase au démarrage
  useEffect(() => {
    console.log('🔍 Test de connexion Firebase au démarrage...');
    console.log('🔍 db disponible?', !!db);
    console.log('🔍 db type:', typeof db);
    
    if (db) {
      console.log('✅ Firebase db est initialisé');
    } else {
      console.error('❌ Firebase db n\'est PAS initialisé!');
    }
  }, []);

  // Vérifier si on accède au dashboard via l'URL avec authentification
  useEffect(() => {
    // Vérifier l'authentification via URL (code secret)
    if (isAdminAuthenticated()) {
      setStep('admin');
    }

    // Raccourci clavier pour accéder à l'admin (Ctrl+Shift+A)
    const handleKeyPress = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        handleAdminAccess();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleAdminAccess]);
  
  const handleStart = () => {
    resetScores(); // Réinitialiser les scores au démarrage
    setStep('onboarding');
  };

  const handleOnboardingComplete = (data) => {
    console.log('📝 Onboarding complet, données reçues:', data);
    setUserData(data);
    
    // Les scores sont déjà ajoutés au context dans Onboarding via handleSelect
    // On calcule juste pour vérification
    const { albert, eugenia, reasons } = calculateScoresFromUserData(data);
    console.log('📊 Scores calculés depuis onboarding (vérification):', { albert, eugenia, reasons });
    console.log('📊 Scores actuels du context:', { scoreAlbert, scoreEugenia });
    
    // Sauvegarder aussi dans localStorage comme backup
    try {
      localStorage.setItem('sider_userData', JSON.stringify(data));
      console.log('✅ Données sauvegardées dans localStorage');
    } catch (e) {
      console.warn('⚠️ Impossible de sauvegarder dans localStorage:', e);
    }
    setStep('phaseIA');
  };

  const handlePhaseIAComplete = async (gameScores) => {
    console.log('🎮 ============================================');
    console.log('🎮 Phase IA Complete! Fonction appelée!');
    console.log('🎮 Scores du jeu reçus:', gameScores);
    console.log('🎮 Scores globaux (Context - inclut onboarding + jeu):', { scoreAlbert, scoreEugenia });
    
    // Les scores du context incluent déjà tous les scores (onboarding + jeu)
    // car PhaseIA ajoute les points au context via addScore
    // On utilise donc directement les scores du context
    const totalScoreAlbert = scoreAlbert;
    const totalScoreEugenia = scoreEugenia;
    
    console.log('🎮 Scores totaux finaux:', { 
      albert: totalScoreAlbert, 
      eugenia: totalScoreEugenia 
    });
    
    // Utiliser userData du state, mais aussi vérifier si on peut le récupérer autrement
    const currentUserData = userData;
    console.log('👤 User Data du state disponible?', !!currentUserData);
    console.log('👤 User Data:', currentUserData);
    console.log('🎮 ============================================');
    
    // Vérifier que userData existe
    if (!currentUserData) {
      console.error('❌ ERREUR: userData est null ou undefined!');
      console.error('❌ Cela peut arriver si le state React n\'a pas encore été mis à jour.');
      console.error('❌ Essayons de récupérer userData depuis le localStorage ou autre...');
      
      // Essayer de récupérer depuis le localStorage si disponible
      try {
        const savedData = localStorage.getItem('sider_userData');
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          console.log('✅ Données récupérées depuis localStorage:', parsedData);
          // Utiliser ces données
          return await saveToFirebase(parsedData, { albert: totalScoreAlbert, eugenia: totalScoreEugenia, profile: gameScores.profile });
        }
      } catch (e) {
        console.error('❌ Erreur lors de la récupération depuis localStorage:', e);
      }
      
      alert('❌ Erreur: Les données utilisateur ne sont pas disponibles.\n\nVeuillez recommencer depuis le début.');
      return;
    }
    
    // Sauvegarder dans Firebase avec les données disponibles et scores combinés
    return await saveToFirebase(currentUserData, { 
      albert: totalScoreAlbert, 
      eugenia: totalScoreEugenia, 
      profile: gameScores.profile 
    });
  };

  // Fonction séparée pour la sauvegarde Firebase
  const saveToFirebase = async (userDataToSave, scores) => {
    
    try {
      console.log('💾 ============================================');
      console.log('💾 Tentative de sauvegarde dans Firebase...');
      console.log('💾 UserData à sauvegarder:', userDataToSave);
      console.log('💾 ============================================');
      
      // Déterminer le profil final à partir des scores
      let profil = 'Neutre';
      if (scores.albert > scores.eugenia) {
        profil = 'Albert';
      } else if (scores.eugenia > scores.albert) {
        profil = 'Eugenia';
      }
      
      console.log('🎯 Profil final déterminé:', profil);
      console.log('🎯 Scores finaux:', { albert: scores.albert, eugenia: scores.eugenia });

      // Préparer les données complètes
      const candidateData = {
        // Données onboarding
        prenom: userDataToSave?.prenom || '',
        nom: userDataToSave?.nom || '',
        email: userDataToSave?.email || '',
        classe: userDataToSave?.classe || '',
        filiere: userDataToSave?.filiere || '',
        moyenne: userDataToSave?.moyenne || '',
        spes: userDataToSave?.spes || [], // Spécialités depuis Onboarding
        options: userDataToSave?.options || '',
        englishLevel: userDataToSave?.englishLevel || '',
        objectif: userDataToSave?.objectif || '',
        
        // Scores du jeu
        scoreAlbert: scores.albert || 0,
        scoreEugenia: scores.eugenia || 0,
        
        // Badge et résultats calculés
        badge: scores.profile?.badge || '',
        subtitle: scores.profile?.subtitle || '',
        message: scores.profile?.message || '',
        matchPercentage: scores.profile?.matchPercentage || 0,
        advice: scores.profile?.advice || '',
        profil: profil,
        
        // Métadonnées
        source: 'Site Web', // Vous pouvez modifier selon votre source
        dateInscription: serverTimestamp(),
        tempsJeu: 0, // À calculer si vous trackez le temps
        
        // CRM
        statut: 'Nouveau'
      };

      console.log('📦 Données complètes à sauvegarder:', JSON.stringify(candidateData, null, 2));
      console.log('🔍 Vérification des données:', {
        hasPrenom: !!candidateData.prenom,
        hasNom: !!candidateData.nom,
        hasEmail: !!candidateData.email,
        hasScores: candidateData.scoreAlbert > 0 || candidateData.scoreEugenia > 0,
        spesCount: candidateData.spes?.length || 0,
        profil: candidateData.profil
      });

      // Vérifier que db est bien initialisé
      console.log('🔍 Vérification de db avant sauvegarde...');
      console.log('🔍 db:', db);
      console.log('🔍 db disponible?', !!db);
      
      if (!db) {
        console.error('❌ db est null ou undefined!');
        throw new Error('Firebase db n\'est pas initialisé. Vérifiez firebase/config.js');
      }

      // Ajouter le document dans Firestore
      console.log('💾 Tentative d\'écriture dans Firestore collection "candidates"...');
      
      // Test de connexion avant l'écriture
      try {
        const testCollection = collection(db, 'candidates');
        console.log('✅ Collection "candidates" accessible:', testCollection);
      } catch (testError) {
        console.error('❌ Erreur d\'accès à la collection:', testError);
        throw testError;
      }
      
      console.log('💾 AVANT addDoc - Collection et données prêtes');
      console.log('💾 Données à sauvegarder (simplifié):', {
        prenom: candidateData.prenom,
        email: candidateData.email,
        scoreAlbert: candidateData.scoreAlbert,
        scoreEugenia: candidateData.scoreEugenia,
        profil: candidateData.profil
      });
      
      const docRef = await addDoc(collection(db, 'candidates'), candidateData);
      console.log('✅ ============================================');
      console.log('✅ Candidat sauvegardé avec succès!');
      console.log('✅ ID:', docRef.id);
      console.log('✅ Chemin Firestore: candidates/' + docRef.id);
      console.log('✅ ============================================');
      
      // Sauvegarde silencieuse - pas d'alerte
    } catch (error) {
      console.error('❌ ============================================');
      console.error('❌ ERREUR lors de la sauvegarde Firebase!');
      console.error('❌ ============================================');
      console.error('❌ Message:', error.message);
      console.error('❌ Code:', error.code);
      console.error('❌ Name:', error.name);
      console.error('❌ Stack:', error.stack);
      console.error('❌ Erreur complète:', error);
      console.error('❌ ============================================');
      
      // Message d'erreur détaillé
      let errorMessage = `❌ ERREUR de sauvegarde Firebase:\n\n${error.message}`;
      if (error.code === 'permission-denied') {
        errorMessage += '\n\n⚠️ Problème de permissions Firestore.\nVérifiez les règles de sécurité dans Firebase Console.';
      } else if (error.code === 'unavailable') {
        errorMessage += '\n\n⚠️ Firebase est indisponible.\nVérifiez votre connexion internet.';
      } else if (error.message?.includes('db')) {
        errorMessage += '\n\n⚠️ Problème d\'initialisation Firebase.';
      }
      errorMessage += '\n\nVérifiez la console pour plus de détails.';
      
      alert(errorMessage);
      throw error; // Re-lancer l'erreur pour que handlePhaseIAComplete puisse la gérer
    }
  };

  // Si on est sur le dashboard admin, vérifier l'authentification
  if (step === 'admin') {
    // Vérifier l'authentification avant d'afficher le dashboard
    if (!isAdminAuthenticated()) {
      // Rediriger vers la page d'accueil si non authentifié
      setStep('welcome');
      alert('❌ Accès non autorisé. Authentification requise.');
      return null;
    }
    return <AdminDashboard onBack={() => setStep('welcome')} />;
  }

  return (
    <div className="h-screen flex items-center justify-center p-0 sm:p-2 md:p-4 lg:p-8 font-sans text-slate-300 relative overflow-hidden">
      {/* Fond d'écran avec profondeur et lumière */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Fond de base */}
        <div className="absolute inset-0 bg-[#0B0C15]" />
        {/* Lumière Indigo en haut à gauche */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 800px 600px at top left, rgba(99, 102, 241, 0.2) 0%, transparent 60%)'
          }}
        />
        {/* Lumière Violette en bas à droite */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 800px 600px at bottom right, rgba(139, 92, 246, 0.15) 0%, transparent 60%)'
          }}
        />
      </div>
      
      {/* Conteneur Central - La Carte Luxueuse */}
      <div className="relative z-10 w-full h-full sm:h-auto sm:max-h-[95vh] max-w-4xl bg-white/[0.02] backdrop-blur-2xl border-0 sm:border border-white/[0.08] ring-0 sm:ring-1 ring-inset ring-white/[0.05] rounded-none sm:rounded-xl md:rounded-2xl lg:rounded-[32px] shadow-2xl shadow-black/80 p-3 sm:p-4 md:p-6 lg:p-12 xl:p-16 flex flex-col overflow-hidden transition-all duration-500">
        {/* Header - Compact sur mobile */}
        <header className="flex flex-row items-center justify-between pb-2 sm:pb-3 md:pb-4 lg:pb-6 border-b border-white/[0.08] flex-shrink-0">
          <div className="text-white font-bold tracking-[0.2em] text-[10px] sm:text-xs md:text-sm uppercase">
            SIDER
          </div>
          <div className="text-[10px] sm:text-xs bg-white/5 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-slate-500">
            BETA
          </div>
        </header>

        {/* Contenu Principal - Pas de scroll sur mobile */}
        <main className="flex-1 flex items-center justify-center overflow-hidden pt-2 sm:pt-3 md:pt-4 lg:pt-6">
          {step === 'welcome' && (
            <div className="flex-1 flex items-center justify-center w-full h-full py-2 sm:py-4">
              <div className="text-center max-w-md mx-auto px-3 sm:px-4 w-full">
                <h1 className="text-white font-medium text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-2 sm:mb-3 md:mb-4 tracking-tight leading-tight">
                  SIDER
                </h1>
                <p className="text-slate-400 font-medium text-sm sm:text-base md:text-lg leading-relaxed mb-3 sm:mb-4 md:mb-6 px-1">
                  Analyse de profil technique et créative. 4 modules pour définir votre identité professionnelle.
                </p>
                <div className="flex flex-col gap-2 sm:gap-3 w-full">
                  <button 
                    onClick={handleStart}
                    className="bg-white text-black hover:bg-slate-200 active:bg-slate-300 transition-colors px-4 sm:px-6 md:px-8 py-3 sm:py-3.5 md:py-4 rounded-lg font-medium text-sm sm:text-base w-full touch-manipulation shadow-lg"
                  >
                    INITIALISER LE SYSTÈME
                  </button>
                  {/* Bouton admin caché - accessible uniquement via code secret ou URL avec code */}
                  {/* Pour accéder : utiliser l'URL avec ?admin_code=CODE_SECRET ou appuyer sur Ctrl+Shift+A */}
                  {isAdminAuthenticated() && (
                    <button 
                      onClick={() => setStep('admin')}
                      className="bg-white/5 text-white hover:bg-white/10 active:bg-white/15 border border-white/20 transition-colors px-4 sm:px-6 md:px-8 py-3 sm:py-3.5 md:py-4 rounded-lg font-medium text-sm sm:text-base w-full touch-manipulation"
                    >
                      📊 ACCÈS ADMIN
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {step === 'onboarding' && (
            <Onboarding onComplete={handleOnboardingComplete} />
          )}

          {step === 'phaseIA' && (
            <PhaseIA onComplete={handlePhaseIAComplete} userProfile={userData} />
          )}
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <ScoringProvider>
      <AppContent />
    </ScoringProvider>
  );
}

export default App;
