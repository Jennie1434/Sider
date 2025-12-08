import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/config';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  Download,
  Search,
  Filter,
  User,
  TrendingUp,
  Clock,
  MapPin,
  ArrowLeft,
  AlertTriangle,
  CheckCircle,
  Target,
  Award,
  Users,
  BarChart3,
  Lightbulb,
  Bell,
  School,
  Star,
  Zap,
  Eye
} from 'lucide-react';

// Mock Data - 50 candidats fictifs (SANS NEUTRE)
const MOCK_USERS = Array.from({ length: 50 }, (_, i) => {
  const firstNames = ['Lucas', 'Emma', 'Hugo', 'Léa', 'Nathan', 'Chloé', 'Louis', 'Manon', 'Thomas', 'Camille', 'Alexandre', 'Sarah', 'Maxime', 'Julie', 'Antoine', 'Marie', 'Pierre', 'Sophie', 'Paul', 'Laura', 'Julien', 'Clara', 'Matthieu', 'Élise', 'Romain', 'Anaïs', 'Baptiste', 'Léonie', 'Clément', 'Inès'];
  const lastNames = ['Martin', 'Bernard', 'Dubois', 'Thomas', 'Robert', 'Richard', 'Petit', 'Durand', 'Leroy', 'Moreau', 'Simon', 'Laurent', 'Lefebvre', 'Michel', 'Garcia', 'David', 'Bertrand', 'Roux', 'Vincent', 'Fournier', 'Morel', 'Girard', 'André', 'Lefevre', 'Mercier', 'Dupont', 'Lambert', 'Bonnet', 'François', 'Martinez'];
  
  const profiles = ['Albert', 'Eugenia']; // SUPPRIMÉ NEUTRE
  const bacs = ['Terminale', 'Bac+2', 'Pro'];
  const spes = ['Maths', 'NSI', 'SES', 'Aucune'];
  const objectifs = ['Startup', 'Data', 'Créatif'];
  const sources = ['Salon Paris', 'QR Vitrine', 'Instagram', 'LinkedIn', 'Site Web'];
  const statuts = ['Nouveau', 'À contacter', 'Inscrit', 'Rejeté'];
  
  const firstName = firstNames[i % firstNames.length];
  const lastName = lastNames[Math.floor(i / firstNames.length) % lastNames.length];
  const profile = profiles[Math.floor(Math.random() * profiles.length)];
  const bac = bacs[Math.floor(Math.random() * bacs.length)];
  const spec1 = spes[Math.floor(Math.random() * spes.length)];
  const spec2 = spec1 !== 'Aucune' && Math.random() > 0.5 ? spes[Math.floor(Math.random() * spes.length)] : null;
  const objectif = objectifs[Math.floor(Math.random() * objectifs.length)];
  const source = sources[Math.floor(Math.random() * sources.length)];
  const statut = statuts[Math.floor(Math.random() * statuts.length)];
  const score = Math.floor(Math.random() * 40) + 60; // Score entre 60 et 100
  const tempsJeu = Math.floor(Math.random() * 120) + 180; // Temps entre 3 et 5 minutes
  
  return {
    id: i + 1,
    nom: `${firstName} ${lastName}`,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
    profil: profile,
    bac: bac,
    spes: spec2 ? [spec1, spec2] : [spec1],
    objectif: objectif,
    source: source,
    statut: statut,
    score: score,
    tempsJeu: tempsJeu,
    dateInscription: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toLocaleDateString('fr-FR')
  };
});

// COULEURS HARMONISÉES avec le jeu
const COLORS = {
  albert: '#4285F4', // Bleu Google
  eugenia: '#671324' // Magenta/Pink
};

// CRITÈRES D'ADMISSION OFFICIELS
const ADMISSION_CRITERIA = {
  albert: {
    requiredSpecs: ['Maths', 'Maths Complémentaire', 'Maths Expertes'],
    recommendedSpecs: ['NSI', 'SI', 'Physique-Chimie'],
    requiredBac: ['Générale', 'Technologique (STI2D, STMG...)'],
    minGrade: 14,
    requiredTraits: ['logical', 'structured', 'data-oriented']
  },
  eugenia: {
    acceptedBac: ['Générale', 'Technologique (STI2D, STMG...)'],
    recommendedSpecs: ['Maths', 'NSI', 'SES', 'SI', 'HGGSP', 'HLP'],
    minGrade: 11,
    requiredTraits: ['entrepreneurial', 'creative', 'business-oriented']
  }
};

// Fonction de calcul de compatibilité Albert
const calculateAlbertCompatibility = (candidate) => {
  let score = 0;
  const reasons = [];
  const missingCriteria = [];

  // Vérifier les spécialités requises
  const spes = Array.isArray(candidate.spes) ? candidate.spes : (candidate.spes ? [candidate.spes] : []);
  const hasMaths = spes.some(spec => 
    spec === 'Maths' || 
    spec === 'Maths Complémentaire' || 
    spec === 'Maths Expertes' ||
    spec?.includes('Maths')
  );
  
  if (hasMaths) {
    score += 40;
    reasons.push('Spé Maths détectée');
  } else {
    missingCriteria.push('Spé Maths requise');
  }

  // Vérifier les spécialités recommandées
  const hasRecommendedSpec = spes.some(spec => 
    ADMISSION_CRITERIA.albert.recommendedSpecs.some(rec => spec?.includes(rec))
  );
  if (hasRecommendedSpec) {
    score += 20;
    reasons.push('Spé recommandée présente');
  }

  // Vérifier le bac
  const filiere = candidate.filiere || candidate.classe || '';
  const hasValidBac = ADMISSION_CRITERIA.albert.requiredBac.some(bac => filiere?.includes(bac));
  if (!hasValidBac && filiere) {
    missingCriteria.push('Bac Général ou Techno requis');
  } else if (hasValidBac) {
    score += 10;
    reasons.push('Bac valide');
  }

  // Vérifier la moyenne
  const moyenne = candidate.moyenne || '';
  const getMoyenneValue = (moy) => {
    if (moy === '16+') return 16;
    if (moy === '14-15') return 14.5;
    if (moy === '11-13') return 12;
    if (moy === '<11') return 10;
    return 0;
  };
  const moyenneValue = getMoyenneValue(moyenne);
  
  if (moyenneValue >= 14) {
    score += 20;
    reasons.push('Moyenne ≥ 14');
  } else if (moyenneValue > 0) {
    missingCriteria.push(`Moyenne < 14 (${moyenne})`);
  }

  // Vérifier le score logique (scoreAlbert)
  const scoreAlbert = candidate.scoreAlbert || 0;
  if (scoreAlbert > 50) {
    score += 30;
    reasons.push('Score logique élevé');
  }

  // Vérifier les choix structurés dans le jeu
  const profil = candidate.profil || '';
  if (profil === 'Albert') {
    score += 10;
    reasons.push('Profil Albert détecté');
  }

  const isCompatible = score >= 50 && hasMaths && moyenneValue >= 14;

  return {
    compatible: isCompatible,
    score: Math.min(100, score),
    reasons,
    missingCriteria
  };
};

// Fonction de calcul de compatibilité Eugénia
const calculateEugeniaCompatibility = (candidate) => {
  let score = 0;
  const reasons = [];
  const missingCriteria = [];

  // Vérifier le bac
  const filiere = candidate.filiere || candidate.classe || '';
  const hasValidBac = ADMISSION_CRITERIA.eugenia.acceptedBac.some(bac => filiere?.includes(bac));
  if (hasValidBac || !filiere) {
    score += 15;
    reasons.push('Bac accepté');
  }

  // Vérifier les spécialités recommandées
  const spes = Array.isArray(candidate.spes) ? candidate.spes : (candidate.spes ? [candidate.spes] : []);
  const hasRecommendedSpec = spes.some(spec => 
    ADMISSION_CRITERIA.eugenia.recommendedSpecs.some(rec => spec?.includes(rec))
  );
  if (hasRecommendedSpec) {
    score += 40;
    reasons.push('Spé recommandée présente');
  }

  // Spécialité SES = bonus important
  if (spes.some(spec => spec === 'SES' || spec?.includes('SES'))) {
    score += 30;
    reasons.push('Spé SES (forte corrélation)');
  }

  // Vérifier la moyenne
  const moyenne = candidate.moyenne || '';
  const getMoyenneValue = (moy) => {
    if (moy === '16+') return 16;
    if (moy === '14-15') return 14.5;
    if (moy === '11-13') return 12;
    if (moy === '<11') return 10;
    return 0;
  };
  const moyenneValue = getMoyenneValue(moyenne);
  
  if (moyenneValue >= 11) {
    score += 15;
    reasons.push('Moyenne ≥ 11');
  } else if (moyenneValue > 0) {
    missingCriteria.push(`Moyenne < 11 (${moyenne})`);
  }

  // Vérifier le score créativité/IA business (scoreEugenia)
  const scoreEugenia = candidate.scoreEugenia || 0;
  if (scoreEugenia > 50) {
    score += 30;
    reasons.push('Score créativité/IA élevé');
  }

  // Vérifier l'orientation entrepreneuriale
  const objectif = candidate.objectif || '';
  if (objectif === 'entreprise' || objectif === 'Créer une boite') {
    score += 20;
    reasons.push('Orientation entrepreneuriale');
  }

  // Vérifier le profil
  const profil = candidate.profil || '';
  if (profil === 'Eugenia') {
    score += 10;
    reasons.push('Profil Eugénia détecté');
  }

  const isCompatible = score >= 50 && moyenneValue >= 11;

  return {
    compatible: isCompatible,
    score: Math.min(100, score),
    reasons,
    missingCriteria
  };
};

export default function AdminDashboard({ onBack }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterObjectif, setFilterObjectif] = useState('Tous');
  const [filterStatut, setFilterStatut] = useState('Tous');
  const [filterProfil, setFilterProfil] = useState('Tous');
  const [filterBac, setFilterBac] = useState('Tous');
  const [filterSource, setFilterSource] = useState('Tous');
  const [filterSpec, setFilterSpec] = useState('Tous');
  const [filterScoreMin, setFilterScoreMin] = useState(0);
  const [quickFilter, setQuickFilter] = useState(null); // 'prioritaires', 'albert', 'eugenia'

  // Charger les données depuis Firestore
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setError(null);
        setLoading(true);
        console.log('🔄 Connexion à Firebase...');
        
        let querySnapshot;
        let collectionName = 'candidates';
        
        try {
          querySnapshot = await getDocs(collection(db, 'candidates'));
          console.log('✅ Collection "candidates" trouvée');
        } catch (e) {
          console.log('⚠️ Collection "candidates" non trouvée, essai avec "candidats"...');
          try {
          querySnapshot = await getDocs(collection(db, 'candidats'));
            collectionName = 'candidats';
            console.log('✅ Collection "candidats" trouvée');
          } catch (e2) {
            throw new Error('Aucune collection Firebase trouvée (ni "candidates" ni "candidats")');
          }
        }
        
        console.log(`📊 Nombre de documents trouvés: ${querySnapshot.docs.length}`);
        
        if (querySnapshot.docs.length === 0) {
          console.log('⚠️ Aucun candidat dans Firebase. Le jeu sauvegarde-t-il correctement ?');
        }
        
        const usersData = querySnapshot.docs.map((docSnapshot) => {
          const data = docSnapshot.data();
          // Calculer le profil (SUPPRIMER NEUTRE - toujours Albert ou Eugenia)
          let profil = data.profil;
          if (!profil || profil === 'Neutre') {
            // Si pas de profil ou neutre, déterminer selon les scores
            if (data.scoreAlbert > data.scoreEugenia) {
              profil = 'Albert';
            } else if (data.scoreEugenia > data.scoreAlbert) {
              profil = 'Eugenia';
            } else {
              // En cas d'égalité, attribuer selon la spécialité ou aléatoirement
              profil = Math.random() > 0.5 ? 'Albert' : 'Eugenia';
            }
          }
          
          return {
            id: docSnapshot.id,
            ...data,
            profil: profil, // Forcer Albert ou Eugenia uniquement
            spes: Array.isArray(data.spes) ? data.spes : (data.spes ? [data.spes] : []),
            dateInscription: data.dateInscription?.toDate ? data.dateInscription.toDate().toLocaleDateString('fr-FR') : (data.dateInscription || ''),
            score: data.matchPercentage || data.score || 0
          };
        });
        
        console.log(`✅ ${usersData.length} candidat(s) chargé(s) depuis Firebase`);
        console.log('📋 Données:', usersData);
        
        setUsers(usersData);
        setLoading(false);
      } catch (error) {
        console.error('❌ Erreur lors du chargement des données Firebase:', error);
        setError(`Erreur Firebase: ${error.message}. Vérifiez la configuration Firebase et les règles de sécurité Firestore.`);
        setLoading(false);
        // Ne pas utiliser les données mockées automatiquement - laisser l'utilisateur voir l'erreur
        setUsers([]);
      }
    };

    fetchUsers();
  }, []);

  // Filtrer les utilisateurs (SUPPRIMER NEUTRE)
  const validUsers = useMemo(() => {
    return users.filter(u => u.profil === 'Albert' || u.profil === 'Eugenia');
  }, [users]);

  // Calcul du Résumé Exécutif
  const executiveSummary = useMemo(() => {
    const total = validUsers.length;
    if (total === 0) {
      return {
        total: 0,
        profilDominant: 'N/A',
        specialiteFrequente: 'N/A',
        canalPerformant: 'N/A',
        scoreMoyen: 0,
        tempsMoyen: 0,
        interpretation: []
      };
    }

    // Profil dominant
    const albertCount = validUsers.filter(u => u.profil === 'Albert').length;
    const eugeniaCount = validUsers.filter(u => u.profil === 'Eugenia').length;
    const profilDominant = albertCount > eugeniaCount ? 'Albert' : 'Eugenia';
    const pourcentageDominant = Math.round((Math.max(albertCount, eugeniaCount) / total) * 100);

    // Spécialité la plus fréquente
    const specCounts = {};
    validUsers.forEach(u => {
      if (u.spes && Array.isArray(u.spes)) {
        u.spes.forEach(spec => {
          if (spec && spec !== 'Aucune') {
            specCounts[spec] = (specCounts[spec] || 0) + 1;
          }
        });
      }
    });
    const specialiteFrequente = Object.keys(specCounts).length > 0
      ? Object.keys(specCounts).reduce((a, b) => specCounts[a] > specCounts[b] ? a : b)
      : 'Aucune';

    // Canal de provenance le plus performant
    const sourceCounts = validUsers.reduce((acc, u) => {
      const source = u.source || 'Non spécifié';
      acc[source] = (acc[source] || 0) + 1;
      return acc;
    }, {});
    const canalPerformant = Object.keys(sourceCounts).length > 0
      ? Object.keys(sourceCounts).reduce((a, b) => sourceCounts[a] > sourceCounts[b] ? a : b)
      : 'N/A';

    // Score moyen
    const scores = validUsers.map(u => u.matchPercentage || u.score || 0).filter(s => s > 0);
    const scoreMoyen = scores.length > 0
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : 0;

    // Temps moyen
    const temps = validUsers.map(u => u.tempsJeu || 0).filter(t => t > 0);
    const tempsMoyen = temps.length > 0
      ? Math.round(temps.reduce((a, b) => a + b, 0) / temps.length)
      : 0;

    // Générer interprétations
    const interpretation = [];
    if (pourcentageDominant > 50) {
      interpretation.push(`Les profils ${profilDominant} sont majoritaires (${pourcentageDominant}% des candidats).`);
    }
    
    // Insight spécialités
    const specAlbertCounts = {};
    const specEugeniaCounts = {};
    validUsers.forEach(u => {
      if (u.spes && Array.isArray(u.spes)) {
        u.spes.forEach(spec => {
          if (spec && spec !== 'Aucune') {
            if (u.profil === 'Albert') {
              specAlbertCounts[spec] = (specAlbertCounts[spec] || 0) + 1;
            } else {
              specEugeniaCounts[spec] = (specEugeniaCounts[spec] || 0) + 1;
            }
          }
        });
      }
    });
    
    const specAlbertDominante = Object.keys(specAlbertCounts).length > 0
      ? Object.keys(specAlbertCounts).reduce((a, b) => specAlbertCounts[a] > specAlbertCounts[b] ? a : b)
      : null;
    if (specAlbertDominante) {
      interpretation.push(`Les candidats spé ${specAlbertDominante} développent surtout un profil Albert.`);
    }

    if (canalPerformant !== 'N/A') {
      interpretation.push(`Le canal le plus efficace est actuellement : ${canalPerformant}.`);
    }
    
    return {
      total,
      profilDominant,
      pourcentageDominant,
      specialiteFrequente,
      canalPerformant,
      scoreMoyen,
      tempsMoyen,
      interpretation
    };
  }, [validUsers]);

  // Insight Albert
  const insightAlbert = useMemo(() => {
    const albertUsers = validUsers.filter(u => u.profil === 'Albert');
    const total = validUsers.length;
    if (albertUsers.length === 0) {
      return {
        pourcentage: 0,
        specialitesCorrelees: [],
        sourcePerformante: 'N/A',
        scoreMoyen: 0,
        tempsMoyen: 0,
        topCandidats: [],
        interpretation: 'Aucun candidat Albert pour le moment.'
      };
    }

    const pourcentage = Math.round((albertUsers.length / total) * 100);

    // Spécialités corrélées
    const specCounts = {};
    albertUsers.forEach(u => {
      if (u.spes && Array.isArray(u.spes)) {
        u.spes.forEach(spec => {
          if (spec && spec !== 'Aucune') {
            specCounts[spec] = (specCounts[spec] || 0) + 1;
          }
        });
      }
    });
    const specialitesCorrelees = Object.keys(specCounts)
      .map(spec => ({ spec, count: specCounts[spec] }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3)
      .map(s => s.spec);

    // Source performante
    const sourceCounts = albertUsers.reduce((acc, u) => {
      const source = u.source || 'Non spécifié';
      acc[source] = (acc[source] || 0) + 1;
      return acc;
    }, {});
    const sourcePerformante = Object.keys(sourceCounts).length > 0
      ? Object.keys(sourceCounts).reduce((a, b) => sourceCounts[a] > sourceCounts[b] ? a : b)
      : 'N/A';

    // Score moyen
    const scores = albertUsers.map(u => u.matchPercentage || u.score || 0).filter(s => s > 0);
    const scoreMoyen = scores.length > 0
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : 0;

    // Temps moyen
    const temps = albertUsers.map(u => u.tempsJeu || 0).filter(t => t > 0);
    const tempsMoyen = temps.length > 0
      ? Math.round(temps.reduce((a, b) => a + b, 0) / temps.length)
      : 0;

    // Top 3 candidats
    const topCandidats = [...albertUsers]
      .sort((a, b) => (b.matchPercentage || b.score || 0) - (a.matchPercentage || a.score || 0))
      .slice(0, 3)
      .map(u => ({
        nom: u.prenom && u.nom ? `${u.prenom} ${u.nom}` : (u.nom || u.prenom || 'Anonyme'),
        score: u.matchPercentage || u.score || 0,
        spes: u.spes || []
      }));

    // Interprétation
    const specsText = specialitesCorrelees.length > 0 ? specialitesCorrelees.join('/') : 'diverses';
    const interpretation = `Albert attire surtout des candidats analytiques (${specsText}). Les leads de ${sourcePerformante} génèrent la majorité des profils Albert.`;

    return {
      pourcentage,
      specialitesCorrelees,
      sourcePerformante,
      scoreMoyen,
      tempsMoyen,
      topCandidats,
      interpretation
    };
  }, [validUsers]);

  // Insight Eugénia
  const insightEugenia = useMemo(() => {
    const eugeniaUsers = validUsers.filter(u => u.profil === 'Eugenia');
    const total = validUsers.length;
    if (eugeniaUsers.length === 0) {
      return {
        pourcentage: 0,
        specialitesCorrelees: [],
        sourcePerformante: 'N/A',
        scoreMoyen: 0,
        tempsMoyen: 0,
        topCandidats: [],
        interpretation: 'Aucun candidat Eugénia pour le moment.'
      };
    }

    const pourcentage = Math.round((eugeniaUsers.length / total) * 100);

    // Spécialités corrélées
    const specCounts = {};
    eugeniaUsers.forEach(u => {
      if (u.spes && Array.isArray(u.spes)) {
        u.spes.forEach(spec => {
          if (spec && spec !== 'Aucune') {
            specCounts[spec] = (specCounts[spec] || 0) + 1;
          }
        });
      }
    });
    const specialitesCorrelees = Object.keys(specCounts)
      .map(spec => ({ spec, count: specCounts[spec] }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3)
      .map(s => s.spec);

    // Source performante
    const sourceCounts = eugeniaUsers.reduce((acc, u) => {
      const source = u.source || 'Non spécifié';
      acc[source] = (acc[source] || 0) + 1;
      return acc;
    }, {});
    const sourcePerformante = Object.keys(sourceCounts).length > 0
      ? Object.keys(sourceCounts).reduce((a, b) => sourceCounts[a] > sourceCounts[b] ? a : b)
      : 'N/A';

    // Score moyen
    const scores = eugeniaUsers.map(u => u.matchPercentage || u.score || 0).filter(s => s > 0);
    const scoreMoyen = scores.length > 0
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : 0;

    // Temps moyen
    const temps = eugeniaUsers.map(u => u.tempsJeu || 0).filter(t => t > 0);
    const tempsMoyen = temps.length > 0
      ? Math.round(temps.reduce((a, b) => a + b, 0) / temps.length)
      : 0;

    // Top 3 candidats
    const topCandidats = [...eugeniaUsers]
      .sort((a, b) => (b.matchPercentage || b.score || 0) - (a.matchPercentage || a.score || 0))
      .slice(0, 3)
      .map(u => ({
        nom: u.prenom && u.nom ? `${u.prenom} ${u.nom}` : (u.nom || u.prenom || 'Anonyme'),
        score: u.matchPercentage || u.score || 0,
        spes: u.spes || []
      }));

    // Interprétation
    const specsText = specialitesCorrelees.length > 0 ? specialitesCorrelees.join('/') : 'diverses';
    const interpretation = `Eugénia attire surtout des candidats créatifs et entrepreneurs (${specsText}). Les salons physiques génèrent les meilleurs profils.`;

    return {
      pourcentage,
      specialitesCorrelees,
      sourcePerformante,
      scoreMoyen,
      tempsMoyen,
      topCandidats,
      interpretation
    };
  }, [validUsers]);

  // Calcul de compatibilité pour tous les candidats
  const candidatesWithCompatibility = useMemo(() => {
    return validUsers.map(candidate => ({
      ...candidate,
      albertCompatibility: calculateAlbertCompatibility(candidate),
      eugeniaCompatibility: calculateEugeniaCompatibility(candidate)
    }));
  }, [validUsers]);

  // Statistiques de compatibilité
  const compatibilityStats = useMemo(() => {
    const albertCompatible = candidatesWithCompatibility.filter(c => c.albertCompatibility.compatible).length;
    const albertIncompatible = candidatesWithCompatibility.length - albertCompatible;
    const albertAvgScore = candidatesWithCompatibility.length > 0
      ? Math.round(candidatesWithCompatibility.reduce((sum, c) => sum + c.albertCompatibility.score, 0) / candidatesWithCompatibility.length)
      : 0;

    const eugeniaCompatible = candidatesWithCompatibility.filter(c => c.eugeniaCompatibility.compatible).length;
    const eugeniaIncompatible = candidatesWithCompatibility.length - eugeniaCompatible;
    const eugeniaAvgScore = candidatesWithCompatibility.length > 0
      ? Math.round(candidatesWithCompatibility.reduce((sum, c) => sum + c.eugeniaCompatibility.score, 0) / candidatesWithCompatibility.length)
      : 0;

    // Top 3 candidats Albert
    const topAlbertCandidates = [...candidatesWithCompatibility]
      .filter(c => c.albertCompatibility.compatible)
      .sort((a, b) => {
        // Trier par score de compatibilité, puis moyenne, puis score logique
        if (b.albertCompatibility.score !== a.albertCompatibility.score) {
          return b.albertCompatibility.score - a.albertCompatibility.score;
        }
        const getMoyenneValue = (moy) => {
          if (moy === '16+') return 16;
          if (moy === '14-15') return 14.5;
          if (moy === '11-13') return 12;
          if (moy === '<11') return 10;
          return 0;
        };
        const moyA = getMoyenneValue(a.moyenne || '');
        const moyB = getMoyenneValue(b.moyenne || '');
        if (moyB !== moyA) return moyB - moyA;
        return (b.scoreAlbert || 0) - (a.scoreAlbert || 0);
      })
      .slice(0, 3)
      .map(c => ({
        nom: c.prenom && c.nom ? `${c.prenom} ${c.nom}` : (c.nom || c.prenom || 'Anonyme'),
        score: c.albertCompatibility.score,
        moyenne: c.moyenne || 'N/A',
        spes: c.spes || [],
        scoreAlbert: c.scoreAlbert || 0
      }));

    // Top 3 candidats Eugénia
    const topEugeniaCandidates = [...candidatesWithCompatibility]
      .filter(c => c.eugeniaCompatibility.compatible)
      .sort((a, b) => {
        // Trier par score de compatibilité, puis orientation entrepreneuriale, puis score créativité
        if (b.eugeniaCompatibility.score !== a.eugeniaCompatibility.score) {
          return b.eugeniaCompatibility.score - a.eugeniaCompatibility.score;
        }
        const objA = a.objectif === 'entreprise' || a.objectif === 'Créer une boite' ? 1 : 0;
        const objB = b.objectif === 'entreprise' || b.objectif === 'Créer une boite' ? 1 : 0;
        if (objB !== objA) return objB - objA;
        return (b.scoreEugenia || 0) - (a.scoreEugenia || 0);
      })
      .slice(0, 3)
      .map(c => ({
        nom: c.prenom && c.nom ? `${c.prenom} ${c.nom}` : (c.nom || c.prenom || 'Anonyme'),
        score: c.eugeniaCompatibility.score,
        moyenne: c.moyenne || 'N/A',
        spes: c.spes || [],
        scoreEugenia: c.scoreEugenia || 0,
        objectif: c.objectif || 'N/A'
      }));

    return {
      albert: {
        compatible: albertCompatible,
        incompatible: albertIncompatible,
        avgScore: albertAvgScore,
        topCandidates: topAlbertCandidates
      },
      eugenia: {
        compatible: eugeniaCompatible,
        incompatible: eugeniaIncompatible,
        avgScore: eugeniaAvgScore,
        topCandidates: topEugeniaCandidates
      }
    };
  }, [candidatesWithCompatibility]);

  // Critères non satisfaits
  const missingCriteria = useMemo(() => {
    const albertMissing = {};
    const eugeniaMissing = {};

    candidatesWithCompatibility.forEach(c => {
      c.albertCompatibility.missingCriteria.forEach(crit => {
        albertMissing[crit] = (albertMissing[crit] || 0) + 1;
      });
      c.eugeniaCompatibility.missingCriteria.forEach(crit => {
        eugeniaMissing[crit] = (eugeniaMissing[crit] || 0) + 1;
      });
    });

    return {
      albert: Object.entries(albertMissing).map(([crit, count]) => ({ crit, count })),
      eugenia: Object.entries(eugeniaMissing).map(([crit, count]) => ({ crit, count }))
    };
  }, [candidatesWithCompatibility]);

  // Insights Admissions Automatiques
  const automaticInsights = useMemo(() => {
    const insights = [];

    // Insight spécialités Maths → Albert
    const mathsCandidates = candidatesWithCompatibility.filter(c => {
      const spes = Array.isArray(c.spes) ? c.spes : (c.spes ? [c.spes] : []);
      return spes.some(spec => spec === 'Maths' || spec?.includes('Maths'));
    });
    if (mathsCandidates.length > 0) {
      const albertCount = mathsCandidates.filter(c => c.albertCompatibility.compatible).length;
      const pourcentage = Math.round((albertCount / mathsCandidates.length) * 100);
      insights.push(`${pourcentage}% des candidats spé Maths correspondent au profil Albert.`);
    }

    // Insight spécialités SES → Eugénia
    const sesCandidates = candidatesWithCompatibility.filter(c => {
      const spes = Array.isArray(c.spes) ? c.spes : (c.spes ? [c.spes] : []);
      return spes.some(spec => spec === 'SES' || spec?.includes('SES'));
    });
    if (sesCandidates.length > 0) {
      const eugeniaCount = sesCandidates.filter(c => c.eugeniaCompatibility.compatible).length;
      const pourcentage = Math.round((eugeniaCount / sesCandidates.length) * 100);
      insights.push(`Les candidats SES correspondent à ${pourcentage}% au profil Eugénia.`);
    }

    // Insight sources
    const sourceStats = {};
    candidatesWithCompatibility.forEach(c => {
      const source = c.source || 'Non spécifié';
      if (!sourceStats[source]) {
        sourceStats[source] = { total: 0, albert: 0, eugenia: 0 };
      }
      sourceStats[source].total += 1;
      if (c.albertCompatibility.compatible) sourceStats[source].albert += 1;
      if (c.eugeniaCompatibility.compatible) sourceStats[source].eugenia += 1;
    });

    Object.entries(sourceStats).forEach(([source, stats]) => {
      if (stats.total > 0) {
        const albertRatio = stats.albert / stats.total;
        const eugeniaRatio = stats.eugenia / stats.total;
        if (albertRatio > 0.6) {
          insights.push(`Le ${source} génère principalement des profils Albert.`);
        } else if (eugeniaRatio > 0.6) {
          insights.push(`Le ${source} génère principalement des profils Eugénia.`);
        }
      }
    });

    // Insight site Web → Albert
    const siteWebCandidates = candidatesWithCompatibility.filter(c => 
      c.source === 'Site Web' || c.source?.includes('Site Web')
    );
    if (siteWebCandidates.length > 0) {
      const albertCount = siteWebCandidates.filter(c => c.albertCompatibility.compatible).length;
      if (albertCount > siteWebCandidates.length * 0.5) {
        insights.push(`Le site Web attire davantage de profils Albert académiquement solides.`);
      }
    }

    return insights;
  }, [candidatesWithCompatibility]);

  // Recommandations Admissions
  const recommendations = useMemo(() => {
    const recs = [];

    // Recommandation pour Albert
    const mathsCandidates = candidatesWithCompatibility.filter(c => {
      const spes = Array.isArray(c.spes) ? c.spes : (c.spes ? [c.spes] : []);
      return spes.some(spec => spec === 'Maths' || spec?.includes('Maths'));
    });
    if (mathsCandidates.length > 0 && mathsCandidates.length < candidatesWithCompatibility.length * 0.3) {
      recs.push('Renforcer la communication auprès des profils Maths pour Albert.');
    }

    // Recommandation pour Eugénia
    const sesCandidates = candidatesWithCompatibility.filter(c => {
      const spes = Array.isArray(c.spes) ? c.spes : (c.spes ? [c.spes] : []);
      return spes.some(spec => spec === 'SES' || spec?.includes('SES'));
    });
    const salonCandidates = candidatesWithCompatibility.filter(c => 
      c.source === 'Salon Paris' || c.source?.includes('Salon')
    );
    if (sesCandidates.length > 0 && salonCandidates.length > 0) {
      recs.push('Cibler les profils SES lors des salons pour Eugénia.');
    }

    // Recommandation pour recontacter
    const albertCompatible = candidatesWithCompatibility.filter(c => c.albertCompatibility.compatible);
    if (albertCompatible.length > 0) {
      recs.push(`Recontacter en priorité les ${Math.min(3, albertCompatible.length)} profils Albert compatibles.`);
    }

    return recs;
  }, [candidatesWithCompatibility]);

  // Comparatif des Écoles
  const comparatifEcoles = useMemo(() => {
    const albertUsers = validUsers.filter(u => u.profil === 'Albert');
    const eugeniaUsers = validUsers.filter(u => u.profil === 'Eugenia');
    const total = validUsers.length;

    const albertPourcentage = total > 0 ? Math.round((albertUsers.length / total) * 100) : 0;
    const eugeniaPourcentage = total > 0 ? Math.round((eugeniaUsers.length / total) * 100) : 0;

    // Score moyen
    const albertScores = albertUsers.map(u => u.matchPercentage || u.score || 0).filter(s => s > 0);
    const eugeniaScores = eugeniaUsers.map(u => u.matchPercentage || u.score || 0).filter(s => s > 0);
    const albertScoreMoyen = albertScores.length > 0 ? Math.round(albertScores.reduce((a, b) => a + b, 0) / albertScores.length) : 0;
    const eugeniaScoreMoyen = eugeniaScores.length > 0 ? Math.round(eugeniaScores.reduce((a, b) => a + b, 0) / eugeniaScores.length) : 0;

    // Temps moyen
    const albertTemps = albertUsers.map(u => u.tempsJeu || 0).filter(t => t > 0);
    const eugeniaTemps = eugeniaUsers.map(u => u.tempsJeu || 0).filter(t => t > 0);
    const albertTempsMoyen = albertTemps.length > 0 ? Math.round(albertTemps.reduce((a, b) => a + b, 0) / albertTemps.length) : 0;
    const eugeniaTempsMoyen = eugeniaTemps.length > 0 ? Math.round(eugeniaTemps.reduce((a, b) => a + b, 0) / eugeniaTemps.length) : 0;

    // Spécialité dominante
    const getSpecDominante = (usersList) => {
      const specCounts = {};
      usersList.forEach(u => {
        if (u.spes && Array.isArray(u.spes)) {
          u.spes.forEach(spec => {
            if (spec && spec !== 'Aucune') {
              specCounts[spec] = (specCounts[spec] || 0) + 1;
            }
          });
        }
      });
      return Object.keys(specCounts).length > 0
        ? Object.keys(specCounts).reduce((a, b) => specCounts[a] > specCounts[b] ? a : b)
        : 'N/A';
    };
    const albertSpecDominante = getSpecDominante(albertUsers);
    const eugeniaSpecDominante = getSpecDominante(eugeniaUsers);

    // Source dominante
    const getSourceDominante = (usersList) => {
      const sourceCounts = usersList.reduce((acc, u) => {
        const source = u.source || 'Non spécifié';
        acc[source] = (acc[source] || 0) + 1;
        return acc;
      }, {});
      return Object.keys(sourceCounts).length > 0
        ? Object.keys(sourceCounts).reduce((a, b) => sourceCounts[a] > sourceCounts[b] ? a : b)
        : 'N/A';
    };
    const albertSourceDominante = getSourceDominante(albertUsers);
    const eugeniaSourceDominante = getSourceDominante(eugeniaUsers);

    // Conclusion automatique
    let conclusion = '';
    if (albertSpecDominante !== 'N/A' && eugeniaSpecDominante !== 'N/A') {
      if (albertSpecDominante === 'Maths' && eugeniaSpecDominante === 'SES') {
        conclusion = 'Actuellement, Eugénia convertit davantage de profils issus des spés SES, tandis qu\'Albert domine chez les spés Maths.';
      } else {
        conclusion = `Albert domine chez les spés ${albertSpecDominante}, tandis qu'Eugénia convertit davantage de profils issus des spés ${eugeniaSpecDominante}.`;
      }
    }

    return {
      albert: {
        pourcentage: albertPourcentage,
        scoreMoyen: albertScoreMoyen,
        tempsMoyen: albertTempsMoyen,
        specDominante: albertSpecDominante,
        sourceDominante: albertSourceDominante
      },
      eugenia: {
        pourcentage: eugeniaPourcentage,
        scoreMoyen: eugeniaScoreMoyen,
        tempsMoyen: eugeniaTempsMoyen,
        specDominante: eugeniaSpecDominante,
        sourceDominante: eugeniaSourceDominante
      },
      conclusion
    };
  }, [validUsers]);

  // Alertes Admissions
  const alerts = useMemo(() => {
    if (validUsers.length === 0) return [];

    const alertsList = [];
    const total = validUsers.length;
    const albertCount = validUsers.filter(u => u.profil === 'Albert').length;
    const eugeniaCount = validUsers.filter(u => u.profil === 'Eugenia').length;

    // Alerte: Baisse d'un profil (si < 30%)
    const albertPourcentage = (albertCount / total) * 100;
    const eugeniaPourcentage = (eugeniaCount / total) * 100;
    if (albertPourcentage < 30) {
      alertsList.push({
        type: 'warning',
        message: `Baisse du nombre de candidats Albert cette semaine (${Math.round(albertPourcentage)}%).`,
        icon: AlertTriangle
      });
    }
    if (eugeniaPourcentage < 30) {
      alertsList.push({
        type: 'warning',
        message: `Baisse du nombre de candidats Eugénia cette semaine (${Math.round(eugeniaPourcentage)}%).`,
        icon: AlertTriangle
      });
    }

    // Alerte: Nouvelle source performante
    const sourceCounts = validUsers.reduce((acc, u) => {
      const source = u.source || 'Non spécifié';
      acc[source] = (acc[source] || 0) + 1;
      return acc;
    }, {});
    const sourceDominante = Object.keys(sourceCounts).reduce((a, b) => 
      sourceCounts[a] > sourceCounts[b] ? a : b
    );
    const pourcentageSource = (sourceCounts[sourceDominante] / total) * 100;
    if (pourcentageSource > 40) {
      alertsList.push({
        type: 'info',
        message: `Nouvelle source performante : ${sourceDominante} (${Math.round(pourcentageSource)}% des candidats).`,
        icon: TrendingUp
      });
    }

    // Alerte: Proportion de spés SES en hausse
    const sesCount = validUsers.filter(u => u.spes && u.spes.includes('SES')).length;
    const sesPourcentage = (sesCount / total) * 100;
    if (sesPourcentage > 40) {
      alertsList.push({
        type: 'info',
        message: `La proportion de spés SES est en hausse significative (${Math.round(sesPourcentage)}%).`,
        icon: TrendingUp
      });
    }

    return alertsList;
  }, [validUsers]);

  // Données pour graphiques (SUPPRIMER NEUTRE)
  const pieData = useMemo(() => [
    { name: 'Albert', value: validUsers.filter(u => u.profil === 'Albert').length, color: COLORS.albert },
    { name: 'Eugénia', value: validUsers.filter(u => u.profil === 'Eugenia').length, color: COLORS.eugenia }
  ], [validUsers]);

  const barData = useMemo(() => {
    const spes = ['Maths', 'NSI', 'SES'];
    return spes.map(spec => {
      const usersWithSpec = validUsers.filter(u => u.spes && u.spes.includes(spec));
      return {
        specialite: spec,
        Albert: usersWithSpec.filter(u => u.profil === 'Albert').length,
        Eugénia: usersWithSpec.filter(u => u.profil === 'Eugenia').length
      };
    });
  }, [validUsers]);

  const sourceData = useMemo(() => {
    const sourceCounts = validUsers.reduce((acc, u) => {
      const source = u.source || 'Non spécifié';
      if (!acc[source]) {
        acc[source] = { total: 0, albert: 0, eugenia: 0 };
      }
      acc[source].total += 1;
      if (u.profil === 'Albert') acc[source].albert += 1;
      if (u.profil === 'Eugenia') acc[source].eugenia += 1;
      return acc;
    }, {});
    
    return Object.keys(sourceCounts).map(source => ({
      source,
      Albert: sourceCounts[source].albert,
      Eugénia: sourceCounts[source].eugenia
    })).sort((a, b) => (b.Albert + b.Eugénia) - (a.Albert + a.Eugénia));
  }, [validUsers]);

  // Insights pour graphiques
  const graphInsights = useMemo(() => {
    const insights = {};
    
    // Insight spécialités
    const specInsight = barData.find(b => {
      const total = b.Albert + b.Eugénia;
      return total > 0 && (b.Albert / total > 0.7 || b.Eugénia / total > 0.7);
    });
    if (specInsight) {
      const total = specInsight.Albert + specInsight.Eugénia;
      const dominant = specInsight.Albert > specInsight.Eugénia ? 'Albert' : 'Eugénia';
      const pourcentage = Math.round((Math.max(specInsight.Albert, specInsight.Eugénia) / total) * 100);
      insights.specialites = `${pourcentage}% des candidats spé ${specInsight.specialite} → profil ${dominant}.`;
    }

    // Insight sources
    const sourceInsight = sourceData.find(s => {
      const total = s.Albert + s.Eugénia;
      return total > 0 && (s.Albert / total > 0.6 || s.Eugénia / total > 0.6);
    });
    if (sourceInsight) {
      const total = sourceInsight.Albert + sourceInsight.Eugénia;
      const dominant = sourceInsight.Albert > sourceInsight.Eugénia ? 'Albert' : 'Eugénia';
      insights.sources = `Les ${sourceInsight.source} génèrent majoritairement des profils ${dominant}.`;
    }

    return insights;
  }, [barData, sourceData]);

  // Filtrage des utilisateurs
  const filteredUsers = useMemo(() => {
    let filtered = validUsers.filter(user => {
      const nom = (user.nom || '').toLowerCase();
      const email = (user.email || '').toLowerCase();
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = nom.includes(searchLower) || email.includes(searchLower);
      const matchesObjectif = filterObjectif === 'Tous' || (user.objectif || '') === filterObjectif;
      const matchesStatut = filterStatut === 'Tous' || (user.statut || '') === filterStatut;
      const matchesProfil = filterProfil === 'Tous' || (user.profil || '') === filterProfil;
      const matchesBac = filterBac === 'Tous' || (user.bac || user.classe || '') === filterBac;
      const matchesSource = filterSource === 'Tous' || (user.source || '') === filterSource;
      const matchesSpec = filterSpec === 'Tous' || (user.spes && user.spes.includes(filterSpec));
      const score = user.matchPercentage || user.score || 0;
      const matchesScore = score >= filterScoreMin;
      
      return matchesSearch && matchesObjectif && matchesStatut && matchesProfil && matchesBac && matchesSource && matchesSpec && matchesScore;
    });

    // Appliquer les filtres rapides
    if (quickFilter === 'prioritaires') {
      filtered = filtered.filter(u => (u.matchPercentage || u.score || 0) >= 80);
    } else if (quickFilter === 'albert') {
      filtered = filtered.filter(u => u.profil === 'Albert' && (u.matchPercentage || u.score || 0) >= 75);
    } else if (quickFilter === 'eugenia') {
      filtered = filtered.filter(u => u.profil === 'Eugenia' && (u.matchPercentage || u.score || 0) >= 75);
    }

    return filtered;
  }, [validUsers, searchTerm, filterObjectif, filterStatut, filterProfil, filterBac, filterSource, filterSpec, filterScoreMin, quickFilter]);

  // Fonction export CSV
  const handleExport = () => {
    const headers = ['Prénom', 'Nom', 'Email', 'Profil', 'Classe', 'Filière', 'Moyenne', 'Spécialités', 'Options', 'Niveau Anglais', 'Objectif', 'Score Albert', 'Score Eugenia', 'Badge', 'Match %', 'Source', 'Statut', 'Temps Jeu (s)', 'Date'];
    const csvContent = [
      headers.join(','),
      ...filteredUsers.map(user => [
        user.prenom || '',
        user.nom || '',
        user.email || '',
        user.profil || '',
        user.classe || '',
        user.filiere || '',
        user.moyenne || '',
        (user.spes && user.spes.length > 0 ? user.spes.join('/') : ''),
        user.options || '',
        user.englishLevel || '',
        user.objectif || '',
        user.scoreAlbert || 0,
        user.scoreEugenia || 0,
        user.badge || '',
        user.matchPercentage || user.score || 0,
        user.source || '',
        user.statut || '',
        user.tempsJeu || 0,
        user.dateInscription || ''
      ].map(val => `"${val}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'sider_leads.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Fonction pour changer le statut dans Firestore
  const handleStatusChange = async (userId, newStatus) => {
    try {
      let userRef;
      try {
        userRef = doc(db, 'candidates', userId);
      } catch (e) {
        userRef = doc(db, 'candidats', userId);
      }
      await updateDoc(userRef, {
        statut: newStatus
      });
      
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === userId ? { ...user, statut: newStatus } : user
        )
      );
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
    }
  };

  // Tooltip personnalisé
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.08] rounded-lg p-3 shadow-xl">
          <p className="text-white font-semibold mb-2">{payload[0].name}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm text-slate-300" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const objectifsUniques = useMemo(() => {
    return ['Tous', ...new Set(validUsers.map(u => u.objectif).filter(Boolean))];
  }, [validUsers]);

  const statutsUniques = useMemo(() => {
    return ['Tous', ...new Set(validUsers.map(u => u.statut).filter(Boolean))];
  }, [validUsers]);

  const profilsUniques = useMemo(() => {
    return ['Tous', 'Albert', 'Eugenia'];
  }, []);

  const bacsUniques = useMemo(() => {
    const bacs = new Set();
    validUsers.forEach(u => {
      if (u.bac) bacs.add(u.bac);
      if (u.classe) bacs.add(u.classe);
    });
    return ['Tous', ...Array.from(bacs)];
  }, [validUsers]);

  const sourcesUniques = useMemo(() => {
    return ['Tous', ...new Set(validUsers.map(u => u.source).filter(Boolean))];
  }, [validUsers]);

  const spesUniques = useMemo(() => {
    const spes = new Set();
    validUsers.forEach(u => {
      if (u.spes && Array.isArray(u.spes)) {
        u.spes.forEach(spec => {
          if (spec && spec !== 'Aucune') spes.add(spec);
        });
      }
    });
    return ['Tous', ...Array.from(spes)];
  }, [validUsers]);

  if (error && !loading) {
    return (
      <div className="min-h-screen bg-[#0B0C15] text-white p-8 font-sans flex items-center justify-center">
        <div className="text-center max-w-2xl">
          <h2 className="text-2xl font-bold mb-4 text-red-400">❌ Erreur de connexion Firebase</h2>
          <p className="text-slate-400 mb-4">{error}</p>
          <div className="bg-white/[0.02] border border-red-500/30 rounded-xl p-6 mt-6 text-left">
            <h3 className="text-lg font-semibold mb-3 text-white">Vérifications à faire :</h3>
            <ul className="space-y-2 text-slate-300 text-sm">
              <li>• Vérifiez que Firebase est bien configuré dans <code className="bg-white/5 px-2 py-1 rounded">firebase/config.js</code></li>
              <li>• Vérifiez les règles de sécurité Firestore (doivent autoriser la lecture)</li>
              <li>• Vérifiez que la collection "candidates" ou "candidats" existe dans Firestore</li>
              <li>• Ouvrez la console du navigateur (F12) pour voir les logs détaillés</li>
            </ul>
          </div>
          {onBack && (
            <button
              onClick={onBack}
              className="mt-6 px-6 py-3 bg-white text-black hover:bg-slate-200 rounded-lg font-medium"
            >
              Retour
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0C15] text-white p-4 sm:p-6 md:p-8 font-sans relative overflow-hidden">
      {/* Fond avec dégradés comme dans le jeu */}
      <div className="fixed inset-0 pointer-events-none z-0">
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

      <div className="relative z-10">
      {/* Header */}
      <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3 sm:space-x-4">
          {onBack && (
            <motion.button
              onClick={onBack}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
                className="p-2 bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.08] rounded-xl transition-all backdrop-blur-sm"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </motion.button>
          )}
          <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 tracking-tight text-white">SIDER COMMAND CENTER</h1>
              <p className="text-xs sm:text-sm text-slate-400">Tableau de bord stratégique d'analyse d'admissions</p>
              {loading ? (
                <p className="text-xs text-blue-400 mt-1">🔄 Chargement depuis Firebase...</p>
              ) : validUsers.length > 0 ? (
                <p className="text-xs text-green-400 mt-1">✅ {validUsers.length} candidat(s) chargé(s) depuis Firebase</p>
              ) : (
                <p className="text-xs text-yellow-400 mt-1">⚠️ Aucun candidat trouvé dans Firebase</p>
              )}
          </div>
        </div>
        <motion.button
          onClick={handleExport}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-2 px-6 py-3 bg-white text-black hover:bg-slate-200 transition-colors rounded-lg font-medium text-sm"
        >
          <Download className="w-5 h-5" />
          <span>EXPORT CSV</span>
        </motion.button>
      </div>

        {/* SECTION 1 : RÉSUMÉ EXÉCUTIF */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8 bg-white/[0.02] backdrop-blur-2xl border border-white/[0.08] rounded-2xl sm:rounded-[32px] shadow-2xl shadow-black/80 p-4 sm:p-6 md:p-8"
        >
          <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
            <Target className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-slate-300" />
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">Résumé Exécutif</h2>
          </div>
          <p className="text-slate-400 mb-4 sm:mb-6 text-sm sm:text-base md:text-lg">Vue d'ensemble stratégique des candidatures et tendances clés</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
            <div className="bg-white/[0.02] border border-white/[0.08] rounded-xl p-4 sm:p-6 backdrop-blur-sm">
              <p className="text-xs sm:text-sm text-slate-400 mb-2">Total Candidats</p>
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">{executiveSummary.total}</p>
            </div>
            <div className="bg-white/[0.02] border border-white/[0.08] rounded-xl p-4 sm:p-6 backdrop-blur-sm">
              <p className="text-xs sm:text-sm text-slate-400 mb-2">Profil Dominant</p>
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold" style={{ color: COLORS[executiveSummary.profilDominant?.toLowerCase()] || '#fff' }}>
                {executiveSummary.profilDominant}
              </p>
              <p className="text-xs sm:text-sm text-slate-400 mt-2">{executiveSummary.pourcentageDominant}% des candidats</p>
            </div>
            <div className="bg-white/[0.02] border border-white/[0.08] rounded-xl p-4 sm:p-6 backdrop-blur-sm">
              <p className="text-xs sm:text-sm text-slate-400 mb-2">Spécialité la Plus Fréquente</p>
              <p className="text-xl sm:text-2xl md:text-3xl font-bold text-white">{executiveSummary.specialiteFrequente}</p>
            </div>
            <div className="bg-white/[0.02] border border-white/[0.08] rounded-xl p-4 sm:p-6 backdrop-blur-sm">
              <p className="text-xs sm:text-sm text-slate-400 mb-2">Source de Leads la Plus Performante</p>
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-white">{executiveSummary.canalPerformant}</p>
            </div>
            <div className="bg-white/[0.02] border border-white/[0.08] rounded-xl p-4 sm:p-6 backdrop-blur-sm">
              <p className="text-xs sm:text-sm text-slate-400 mb-2">Score Moyen Global</p>
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">{executiveSummary.scoreMoyen}/100</p>
            </div>
            <div className="bg-white/[0.02] border border-white/[0.08] rounded-xl p-4 sm:p-6 backdrop-blur-sm">
              <p className="text-xs sm:text-sm text-slate-400 mb-2">Temps Moyen Global</p>
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                {Math.floor(executiveSummary.tempsMoyen / 60)}min {executiveSummary.tempsMoyen % 60}s
              </p>
            </div>
          </div>

          {/* Interprétations */}
          {executiveSummary.interpretation.length > 0 && (
            <div className="bg-white/[0.02] border border-white/[0.08] rounded-xl p-6 backdrop-blur-sm">
              <div className="flex items-start space-x-3">
                <Lightbulb className="w-6 h-6 text-slate-300 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-white">Interprétations Clés</h3>
                  <ul className="space-y-2">
                    {executiveSummary.interpretation.map((interp, index) => (
                      <li key={index} className="text-slate-300 flex items-start">
                        <CheckCircle className="w-4 h-4 text-slate-400 mr-2 mt-1 flex-shrink-0" />
                        <span>{interp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* SECTION 2 : INSIGHT ALBERT & INSIGHT EUGÉNIA */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Insight Albert */}
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
            className="bg-white/[0.02] backdrop-blur-2xl border border-white/[0.08] rounded-[32px] p-6 shadow-2xl shadow-black/80"
            style={{ borderColor: `${COLORS.albert}40` }}
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-white/[0.02]" style={{ borderColor: `${COLORS.albert}40`, borderWidth: '2px' }}>
                <School className="w-6 h-6" style={{ color: COLORS.albert }} />
            </div>
              <h2 className="text-2xl font-bold" style={{ color: COLORS.albert }}>Insight Albert</h2>
          </div>
            
            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/[0.02] border border-white/[0.08] rounded-xl p-4">
                  <p className="text-sm text-slate-400 mb-1">% Candidats</p>
                  <p className="text-3xl font-bold" style={{ color: COLORS.albert }}>{insightAlbert.pourcentage}%</p>
                </div>
                <div className="bg-white/[0.02] border border-white/[0.08] rounded-xl p-4">
                  <p className="text-sm text-slate-400 mb-1">Score Moyen</p>
                  <p className="text-3xl font-bold text-white">{insightAlbert.scoreMoyen}/100</p>
                </div>
              </div>
              
              <div className="bg-white/[0.02] border border-white/[0.08] rounded-xl p-4">
                <p className="text-sm text-slate-400 mb-2">Spécialités Corrélées</p>
                <div className="flex flex-wrap gap-2">
                  {insightAlbert.specialitesCorrelees.length > 0 ? (
                    insightAlbert.specialitesCorrelees.map((spec, i) => (
                      <span key={i} className="px-3 py-1 rounded-full text-sm font-medium bg-white/[0.05] text-slate-300 border border-white/[0.08]">
                        {spec}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-400 text-sm">Aucune</span>
                  )}
                </div>
              </div>
              
              <div className="bg-white/[0.02] border border-white/[0.08] rounded-xl p-4">
                <p className="text-sm text-slate-400 mb-1">Source Performante</p>
                <p className="text-lg font-semibold text-white">{insightAlbert.sourcePerformante}</p>
              </div>
              
              <div className="bg-white/[0.02] border border-white/[0.08] rounded-xl p-4">
                <p className="text-sm text-slate-400 mb-1">Temps Moyen</p>
                <p className="text-lg font-semibold text-white">
                  {Math.floor(insightAlbert.tempsMoyen / 60)}min {insightAlbert.tempsMoyen % 60}s
                </p>
              </div>

              {insightAlbert.topCandidats.length > 0 && (
                <div className="bg-white/[0.02] border border-white/[0.08] rounded-xl p-4">
                  <p className="text-sm text-slate-400 mb-3">Top 3 Candidats</p>
                  <div className="space-y-2">
                    {insightAlbert.topCandidats.map((candidat, i) => (
                      <div key={i} className="flex items-center justify-between bg-white/[0.02] border border-white/[0.08] rounded-lg p-2">
                        <span className="text-sm text-white">{candidat.nom}</span>
                        <span className="text-sm font-semibold" style={{ color: COLORS.albert }}>{candidat.score}/100</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white/[0.02] border border-white/[0.08] rounded-xl p-4">
              <p className="text-sm text-slate-300 leading-relaxed">{insightAlbert.interpretation}</p>
            </div>
        </motion.div>

          {/* Insight Eugénia */}
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
            className="bg-white/[0.02] backdrop-blur-2xl border border-white/[0.08] rounded-[32px] p-6 shadow-2xl shadow-black/80"
            style={{ borderColor: `${COLORS.eugenia}40` }}
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-white/[0.02]" style={{ borderColor: `${COLORS.eugenia}40`, borderWidth: '2px' }}>
                <School className="w-6 h-6" style={{ color: COLORS.eugenia }} />
            </div>
              <h2 className="text-2xl font-bold" style={{ color: COLORS.eugenia }}>Insight Eugénia</h2>
          </div>
            
            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/[0.02] border border-white/[0.08] rounded-xl p-4">
                  <p className="text-sm text-slate-400 mb-1">% Candidats</p>
                  <p className="text-3xl font-bold" style={{ color: COLORS.eugenia }}>{insightEugenia.pourcentage}%</p>
                </div>
                <div className="bg-white/[0.02] border border-white/[0.08] rounded-xl p-4">
                  <p className="text-sm text-slate-400 mb-1">Score Moyen</p>
                  <p className="text-3xl font-bold text-white">{insightEugenia.scoreMoyen}/100</p>
                </div>
              </div>
              
              <div className="bg-white/[0.02] border border-white/[0.08] rounded-xl p-4">
                <p className="text-sm text-slate-400 mb-2">Spécialités Corrélées</p>
                <div className="flex flex-wrap gap-2">
                  {insightEugenia.specialitesCorrelees.length > 0 ? (
                    insightEugenia.specialitesCorrelees.map((spec, i) => (
                      <span key={i} className="px-3 py-1 rounded-full text-sm font-medium bg-white/[0.05] text-slate-300 border border-white/[0.08]">
                        {spec}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-400 text-sm">Aucune</span>
                  )}
                </div>
              </div>
              
              <div className="bg-white/[0.02] border border-white/[0.08] rounded-xl p-4">
                <p className="text-sm text-slate-400 mb-1">Source Performante</p>
                <p className="text-lg font-semibold text-white">{insightEugenia.sourcePerformante}</p>
              </div>
              
              <div className="bg-white/[0.02] border border-white/[0.08] rounded-xl p-4">
                <p className="text-sm text-slate-400 mb-1">Temps Moyen</p>
                <p className="text-lg font-semibold text-white">
                  {Math.floor(insightEugenia.tempsMoyen / 60)}min {insightEugenia.tempsMoyen % 60}s
                </p>
              </div>

              {insightEugenia.topCandidats.length > 0 && (
                <div className="bg-white/[0.02] border border-white/[0.08] rounded-xl p-4">
                  <p className="text-sm text-slate-400 mb-3">Top 3 Candidats</p>
                  <div className="space-y-2">
                    {insightEugenia.topCandidats.map((candidat, i) => (
                      <div key={i} className="flex items-center justify-between bg-white/[0.02] border border-white/[0.08] rounded-lg p-2">
                        <span className="text-sm text-white">{candidat.nom}</span>
                        <span className="text-sm font-semibold" style={{ color: COLORS.eugenia }}>{candidat.score}/100</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white/[0.02] border border-white/[0.08] rounded-xl p-4">
              <p className="text-sm text-slate-300 leading-relaxed">{insightEugenia.interpretation}</p>
            </div>
        </motion.div>
        </div>

        {/* SECTION 3 : COMPARATIF DES ÉCOLES */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8 bg-white/[0.02] backdrop-blur-2xl border border-white/[0.08] rounded-[32px] p-6 shadow-2xl shadow-black/80"
        >
          <div className="flex items-center space-x-3 mb-6">
            <BarChart3 className="w-6 h-6 text-slate-300" />
            <h2 className="text-2xl font-bold text-white">Comparatif des Écoles</h2>
            </div>
          <p className="text-slate-400 mb-6">Duel Albert vs Eugénia - Analyse comparative des performances</p>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/[0.08]">
                  <th className="pb-4 text-sm font-semibold text-slate-400 uppercase tracking-wider">Critère</th>
                  <th className="pb-4 text-sm font-semibold text-center uppercase tracking-wider" style={{ color: COLORS.albert }}>Albert</th>
                  <th className="pb-4 text-sm font-semibold text-center uppercase tracking-wider" style={{ color: COLORS.eugenia }}>Eugénia</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-white/[0.05]">
                  <td className="py-4 text-white font-medium">% Candidats</td>
                  <td className="py-4 text-center text-2xl font-bold" style={{ color: COLORS.albert }}>{comparatifEcoles.albert.pourcentage}%</td>
                  <td className="py-4 text-center text-2xl font-bold" style={{ color: COLORS.eugenia }}>{comparatifEcoles.eugenia.pourcentage}%</td>
                </tr>
                <tr className="border-b border-white/[0.05]">
                  <td className="py-4 text-white font-medium">Score Moyen</td>
                  <td className="py-4 text-center text-xl font-semibold text-white">{comparatifEcoles.albert.scoreMoyen}/100</td>
                  <td className="py-4 text-center text-xl font-semibold text-white">{comparatifEcoles.eugenia.scoreMoyen}/100</td>
                </tr>
                <tr className="border-b border-white/[0.05]">
                  <td className="py-4 text-white font-medium">Temps Moyen</td>
                  <td className="py-4 text-center text-white">
                    {Math.floor(comparatifEcoles.albert.tempsMoyen / 60)}min {comparatifEcoles.albert.tempsMoyen % 60}s
                  </td>
                  <td className="py-4 text-center text-white">
                    {Math.floor(comparatifEcoles.eugenia.tempsMoyen / 60)}min {comparatifEcoles.eugenia.tempsMoyen % 60}s
                  </td>
                </tr>
                <tr className="border-b border-white/[0.05]">
                  <td className="py-4 text-white font-medium">Spécialité Dominante</td>
                  <td className="py-4 text-center text-white">{comparatifEcoles.albert.specDominante}</td>
                  <td className="py-4 text-center text-white">{comparatifEcoles.eugenia.specDominante}</td>
                </tr>
                <tr className="border-b border-white/[0.05]">
                  <td className="py-4 text-white font-medium">Source Dominante</td>
                  <td className="py-4 text-center text-white">{comparatifEcoles.albert.sourceDominante}</td>
                  <td className="py-4 text-center text-white">{comparatifEcoles.eugenia.sourceDominante}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {comparatifEcoles.conclusion && (
            <div className="mt-6 bg-white/[0.02] border border-white/[0.08] rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <Lightbulb className="w-5 h-5 text-slate-300 mt-0.5 flex-shrink-0" />
                <p className="text-slate-300 leading-relaxed">{comparatifEcoles.conclusion}</p>
              </div>
            </div>
          )}
        </motion.div>

        {/* SECTION 3.5 : COMPATIBILITÉ ÉCOLES */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-3 mb-6">
            <Award className="w-6 h-6 text-slate-300" />
            <h2 className="text-2xl font-bold text-white">Compatibilité Écoles</h2>
            </div>
          <p className="text-slate-400 mb-6">Analyse de compatibilité basée sur les critères d'admission officiels</p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Compatibilité Albert */}
            <div className="bg-white/[0.02] backdrop-blur-2xl border border-white/[0.08] rounded-[32px] p-6 shadow-2xl shadow-black/80" style={{ borderColor: `${COLORS.albert}40` }}>
              <div className="flex items-center space-x-3 mb-6">
                <School className="w-6 h-6" style={{ color: COLORS.albert }} />
                <h3 className="text-xl font-bold" style={{ color: COLORS.albert }}>Compatibilité Albert</h3>
          </div>
              
              <div className="space-y-4">
                <div className="bg-white/[0.02] border border-white/[0.08] rounded-xl p-4">
                  <p className="text-sm text-slate-400 mb-2">Compatibilité Globale</p>
                  <p className="text-4xl font-bold" style={{ color: COLORS.albert }}>{compatibilityStats.albert.avgScore}%</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/[0.02] border border-white/[0.08] rounded-xl p-4">
                    <p className="text-sm text-slate-400 mb-1">Compatibles</p>
                    <p className="text-2xl font-bold text-white">{compatibilityStats.albert.compatible}</p>
                  </div>
                  <div className="bg-white/[0.02] border border-white/[0.08] rounded-xl p-4">
                    <p className="text-sm text-slate-400 mb-1">Incompatibles</p>
                    <p className="text-2xl font-bold text-white">{compatibilityStats.albert.incompatible}</p>
                  </div>
                </div>

                {compatibilityStats.albert.topCandidates.length > 0 && (
                  <div className="bg-white/[0.02] border border-white/[0.08] rounded-xl p-4">
                    <p className="text-sm text-slate-400 mb-3">Top 3 Profils Compatibles</p>
                    <div className="space-y-2">
                      {compatibilityStats.albert.topCandidates.map((candidat, i) => (
                        <div key={i} className="flex items-center justify-between bg-white/[0.02] border border-white/[0.08] rounded-lg p-2">
                          <div>
                            <p className="text-sm font-medium text-white">{candidat.nom}</p>
                            <p className="text-xs text-slate-400">{candidat.spes.join(', ')} • Moy: {candidat.moyenne}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold" style={{ color: COLORS.albert }}>{candidat.score}%</p>
                            <p className="text-xs text-slate-400">Score: {candidat.scoreAlbert}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Compatibilité Eugénia */}
            <div className="bg-white/[0.02] backdrop-blur-2xl border border-white/[0.08] rounded-[32px] p-6 shadow-2xl shadow-black/80" style={{ borderColor: `${COLORS.eugenia}40` }}>
              <div className="flex items-center space-x-3 mb-6">
                <School className="w-6 h-6" style={{ color: COLORS.eugenia }} />
                <h3 className="text-xl font-bold" style={{ color: COLORS.eugenia }}>Compatibilité Eugénia</h3>
              </div>
              
              <div className="space-y-4">
                <div className="bg-white/[0.02] border border-white/[0.08] rounded-xl p-4">
                  <p className="text-sm text-slate-400 mb-2">Compatibilité Globale</p>
                  <p className="text-4xl font-bold" style={{ color: COLORS.eugenia }}>{compatibilityStats.eugenia.avgScore}%</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/[0.02] border border-white/[0.08] rounded-xl p-4">
                    <p className="text-sm text-slate-400 mb-1">Compatibles</p>
                    <p className="text-2xl font-bold text-white">{compatibilityStats.eugenia.compatible}</p>
                  </div>
                  <div className="bg-white/[0.02] border border-white/[0.08] rounded-xl p-4">
                    <p className="text-sm text-slate-400 mb-1">Incompatibles</p>
                    <p className="text-2xl font-bold text-white">{compatibilityStats.eugenia.incompatible}</p>
                  </div>
                </div>

                {compatibilityStats.eugenia.topCandidates.length > 0 && (
                  <div className="bg-white/[0.02] border border-white/[0.08] rounded-xl p-4">
                    <p className="text-sm text-slate-400 mb-3">Top 3 Profils Compatibles</p>
                    <div className="space-y-2">
                      {compatibilityStats.eugenia.topCandidates.map((candidat, i) => (
                        <div key={i} className="flex items-center justify-between bg-white/[0.02] border border-white/[0.08] rounded-lg p-2">
                          <div>
                            <p className="text-sm font-medium text-white">{candidat.nom}</p>
                            <p className="text-xs text-slate-400">{candidat.spes.join(', ')} • {candidat.objectif}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold" style={{ color: COLORS.eugenia }}>{candidat.score}%</p>
                            <p className="text-xs text-slate-400">Score: {candidat.scoreEugenia}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* SECTION 3.6 : CRITÈRES NON SATISFAITS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8 bg-white/[0.02] backdrop-blur-2xl border border-white/[0.08] rounded-[32px] p-6 shadow-2xl shadow-black/80"
        >
          <div className="flex items-center space-x-3 mb-6">
            <AlertTriangle className="w-6 h-6 text-slate-300" />
            <h2 className="text-2xl font-bold text-white">Critères Non Satisfaits</h2>
          </div>
          <p className="text-slate-400 mb-6">Analyse des prérequis manquants par école</p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Critères manquants Albert */}
            <div className="bg-white/[0.02] border border-white/[0.08] rounded-xl p-4">
              <h3 className="text-lg font-semibold mb-4" style={{ color: COLORS.albert }}>Albert</h3>
              {missingCriteria.albert.length > 0 ? (
                <div className="space-y-2">
                  {missingCriteria.albert.map((item, i) => (
                    <div key={i} className="flex items-center justify-between bg-white/[0.02] border border-red-500/30 rounded-lg p-3">
                      <p className="text-sm text-white">{item.crit}</p>
                      <span className="text-sm font-bold text-red-400">{item.count} candidat{item.count > 1 ? 's' : ''}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-400">Tous les candidats satisfont les critères Albert.</p>
              )}
            </div>

            {/* Critères manquants Eugénia */}
            <div className="bg-white/[0.02] border border-white/[0.08] rounded-xl p-4">
              <h3 className="text-lg font-semibold mb-4" style={{ color: COLORS.eugenia }}>Eugénia</h3>
              {missingCriteria.eugenia.length > 0 ? (
                <div className="space-y-2">
                  {missingCriteria.eugenia.map((item, i) => (
                    <div key={i} className="flex items-center justify-between bg-white/[0.02] border border-red-500/30 rounded-lg p-3">
                      <p className="text-sm text-white">{item.crit}</p>
                      <span className="text-sm font-bold text-red-400">{item.count} candidat{item.count > 1 ? 's' : ''}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-400">Tous les candidats satisfont les critères Eugénia.</p>
              )}
            </div>
          </div>
        </motion.div>

        {/* SECTION 3.7 : INSIGHTS ADMISSIONS AUTOMATIQUES */}
        {automaticInsights.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="mb-8 bg-white/[0.02] backdrop-blur-2xl border border-white/[0.08] rounded-[32px] p-6 shadow-2xl shadow-black/80"
          >
            <div className="flex items-center space-x-3 mb-6">
              <Lightbulb className="w-6 h-6 text-yellow-400" />
              <h2 className="text-2xl font-bold text-white">Insights Admissions Automatiques</h2>
      </div>
            <p className="text-slate-400 mb-6">Analyses générées automatiquement à partir des données réelles</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {automaticInsights.map((insight, index) => (
                <div key={index} className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl p-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                    <p className="text-white font-medium">{insight}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* SECTION 3.8 : TOP CANDIDATS À PRIORISER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-3 mb-6">
            <Star className="w-6 h-6 text-slate-300" />
            <h2 className="text-2xl font-bold text-white">Top Candidats à Prioriser</h2>
          </div>
          <p className="text-slate-400 mb-6">Candidats les plus prometteurs pour chaque école</p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Albert */}
            <div className="bg-white/[0.02] backdrop-blur-2xl border border-white/[0.08] rounded-[32px] p-6 shadow-2xl shadow-black/80" style={{ borderColor: `${COLORS.albert}40` }}>
              <h3 className="text-xl font-bold mb-4" style={{ color: COLORS.albert }}>🔵 Top Albert</h3>
              {compatibilityStats.albert.topCandidates.length > 0 ? (
                <div className="space-y-3">
                  {compatibilityStats.albert.topCandidates.map((candidat, i) => (
                    <div key={i} className="bg-white/[0.02] border border-white/[0.08] rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-semibold text-white">{candidat.nom}</p>
                        <span className="px-3 py-1 rounded-full text-sm font-bold" style={{ backgroundColor: `${COLORS.albert}20`, color: COLORS.albert }}>
                          {candidat.score}%
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
                        <p>Moyenne: {candidat.moyenne}</p>
                        <p>Score Logique: {candidat.scoreAlbert}</p>
                        <p className="col-span-2">Spés: {candidat.spes.join(', ')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400 text-sm">Aucun candidat compatible Albert pour le moment.</p>
              )}
            </div>

            {/* Top Eugénia */}
            <div className="bg-white/[0.02] backdrop-blur-2xl border border-white/[0.08] rounded-[32px] p-6 shadow-2xl shadow-black/80" style={{ borderColor: `${COLORS.eugenia}40` }}>
              <h3 className="text-xl font-bold mb-4" style={{ color: COLORS.eugenia }}>🔴 Top Eugénia</h3>
              {compatibilityStats.eugenia.topCandidates.length > 0 ? (
                <div className="space-y-3">
                  {compatibilityStats.eugenia.topCandidates.map((candidat, i) => (
                    <div key={i} className="bg-white/[0.02] border border-white/[0.08] rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-semibold text-white">{candidat.nom}</p>
                        <span className="px-3 py-1 rounded-full text-sm font-bold" style={{ backgroundColor: `${COLORS.eugenia}20`, color: COLORS.eugenia }}>
                          {candidat.score}%
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
                        <p>Moyenne: {candidat.moyenne}</p>
                        <p>Score Créativité: {candidat.scoreEugenia}</p>
                        <p className="col-span-2">Spés: {candidat.spes.join(', ')}</p>
                        <p className="col-span-2">Objectif: {candidat.objectif}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400 text-sm">Aucun candidat compatible Eugénia pour le moment.</p>
              )}
            </div>
          </div>
        </motion.div>

        {/* SECTION 3.9 : RECOMMANDATIONS ADMISSIONS */}
        {recommendations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
            className="mb-6 sm:mb-8 bg-white/[0.02] backdrop-blur-2xl border border-white/[0.08] rounded-2xl sm:rounded-[32px] p-4 sm:p-6 shadow-2xl shadow-black/80"
          >
            <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
              <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-slate-300" />
              <h2 className="text-xl sm:text-2xl font-bold text-white">Recommandations Admissions</h2>
            </div>
            <p className="text-slate-400 mb-4 sm:mb-6 text-sm sm:text-base">Suggestions d'actions basées sur l'analyse des données</p>
            <div className="space-y-3">
              {recommendations.map((rec, index) => (
                <div key={index} className="flex items-start space-x-3 bg-white/[0.02] border border-white/[0.08] rounded-xl p-4">
                  <Target className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                  <p className="text-white font-medium">{rec}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* SECTION 4 : ALERTES ADMISSIONS */}
        {alerts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-6 sm:mb-8 bg-white/[0.02] backdrop-blur-2xl border border-white/[0.08] rounded-2xl sm:rounded-[32px] p-4 sm:p-6 shadow-2xl shadow-black/80"
          >
            <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
              <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-slate-300" />
              <h2 className="text-xl sm:text-2xl font-bold text-white">Alertes Admissions</h2>
      </div>
            <p className="text-slate-400 mb-4 sm:mb-6 text-sm sm:text-base">Notifications automatiques basées sur l'analyse des données</p>
            <div className="space-y-3">
              {alerts.map((alert, index) => {
                const Icon = alert.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className={`flex items-start space-x-3 p-4 rounded-xl border bg-white/[0.02] ${
                      alert.type === 'warning'
                        ? 'border-red-500/30'
                        : 'border-blue-500/30'
                    }`}
                  >
                    <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                      alert.type === 'warning' ? 'text-red-400' : 'text-blue-400'
                    }`} />
                    <p className="text-white font-medium">{alert.message}</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* SECTION 5 : GRAPHIQUES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Pie Chart - Répartition des Profils */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-white/[0.02] backdrop-blur-2xl border border-white/[0.08] rounded-2xl sm:rounded-[32px] p-4 sm:p-6 shadow-2xl shadow-black/80"
        >
            <h3 className="text-lg sm:text-xl font-semibold mb-2 text-white">Répartition des Profils</h3>
            <p className="text-xs sm:text-sm text-slate-400 mb-4 sm:mb-6">Distribution des candidats par école (Albert vs Eugénia)</p>
          <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
            <div className="mt-4 p-4 bg-white/[0.02] border border-white/[0.08] rounded-xl">
              <p className="text-sm text-slate-300">
                <strong className="text-white">Interprétation:</strong> Cette répartition montre l'équilibre entre les deux écoles. 
                {executiveSummary.profilDominant && 
                  ` ${executiveSummary.profilDominant} domine actuellement avec ${executiveSummary.pourcentageDominant}% des candidats.`
                }
                {executiveSummary.profilDominant === 'Albert' && ' Cette tendance peut indiquer un fort intérêt pour les profils analytiques et techniques.'}
                {executiveSummary.profilDominant === 'Eugenia' && ' Cette tendance peut indiquer un fort intérêt pour les profils créatifs et entrepreneuriaux.'}
              </p>
            </div>
        </motion.div>

          {/* Bar Chart - Spécialités par Profil */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 }}
            className="bg-white/[0.02] backdrop-blur-2xl border border-white/[0.08] rounded-2xl sm:rounded-[32px] p-4 sm:p-6 shadow-2xl shadow-black/80"
        >
            <h3 className="text-lg sm:text-xl font-semibold mb-2 text-white">Spécialités → Profils</h3>
            <p className="text-xs sm:text-sm text-slate-400 mb-4 sm:mb-6">Corrélation entre spécialités choisies et profils obtenus</p>
          <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="specialite" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="Albert" fill={COLORS.albert} />
                <Bar dataKey="Eugénia" fill={COLORS.eugenia} />
            </BarChart>
          </ResponsiveContainer>
            <div className="mt-4 p-4 bg-white/[0.02] border border-white/[0.08] rounded-xl">
              <p className="text-sm text-slate-300">
                <strong className="text-white">Interprétation:</strong> {graphInsights.specialites || 
                  'Ce graphique révèle les tendances entre spécialités et profils. Les candidats avec des spécialités techniques (Maths, NSI) tendent vers Albert, tandis que les spécialités créatives (SES) tendent vers Eugénia.'}
              </p>
            </div>
        </motion.div>
      </div>

        {/* SECTION 6 : SOURCES → PROFILS */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mb-6 sm:mb-8 bg-white/[0.02] backdrop-blur-2xl border border-white/[0.08] rounded-2xl sm:rounded-[32px] p-4 sm:p-6 shadow-2xl shadow-black/80"
        >
          <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
            <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-slate-300" />
            <h2 className="text-xl sm:text-2xl font-bold text-white">Sources → Profils</h2>
          </div>
          <p className="text-slate-400 mb-4 sm:mb-6 text-sm sm:text-base">Analyse des canaux de recrutement par école</p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
              <BarChart data={sourceData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis type="number" stroke="#94a3b8" />
                <YAxis dataKey="source" type="category" stroke="#94a3b8" width={120} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="Albert" fill={COLORS.albert} />
                <Bar dataKey="Eugénia" fill={COLORS.eugenia} />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex flex-col justify-center">
              <div className="bg-white/[0.02] border border-white/[0.08] rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4 text-white">Insight Sources</h3>
                <p className="text-slate-300 leading-relaxed mb-4">
                  {graphInsights.sources || 'Les différents canaux de recrutement génèrent des profils variés. Les canaux digitaux (Site Web, Instagram) tendent à attirer plus de profils Albert, tandis que les canaux physiques (Salon Paris, QR Vitrine) génèrent plus de profils Eugénia.'}
                </p>
                <div className="mt-4 pt-4 border-t border-white/[0.08]">
                  <p className="text-sm text-slate-400">
                    <strong className="text-white">Recommandation:</strong> Diversifiez vos canaux marketing pour équilibrer les profils et ciblez spécifiquement les canaux les plus performants pour chaque école.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* SECTION 7 : CRM CANDIDATS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-white/[0.02] backdrop-blur-2xl border border-white/[0.08] rounded-2xl sm:rounded-[32px] p-4 sm:p-6 shadow-2xl shadow-black/80"
      >
        <div className="mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-semibold mb-2 text-white">CRM - Liste des Candidats</h2>
            <p className="text-xs sm:text-sm text-slate-400 mb-4 sm:mb-6">Gestion complète de votre pipeline d'admissions avec filtres avancés et actions rapides</p>
            
            {/* Boutons Actions Rapides */}
            <div className="flex flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-6">
              <motion.button
                onClick={() => setQuickFilter(quickFilter === 'prioritaires' ? null : 'prioritaires')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  quickFilter === 'prioritaires'
                    ? 'bg-white text-black hover:bg-slate-200'
                    : 'bg-white/[0.02] border border-white/[0.08] text-white hover:bg-white/[0.05]'
                }`}
              >
                <Star className="w-4 h-4" />
                <span>Candidats Prioritaires</span>
              </motion.button>
              <motion.button
                onClick={() => setQuickFilter(quickFilter === 'albert' ? null : 'albert')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  quickFilter === 'albert'
                    ? 'bg-white text-black hover:bg-slate-200'
                    : 'bg-white/[0.02] border border-white/[0.08] text-white hover:bg-white/[0.05]'
                }`}
              >
                <Eye className="w-4 h-4" />
                <span>Profils Élevés Albert</span>
              </motion.button>
              <motion.button
                onClick={() => setQuickFilter(quickFilter === 'eugenia' ? null : 'eugenia')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  quickFilter === 'eugenia'
                    ? 'bg-white text-black hover:bg-slate-200'
                    : 'bg-white/[0.02] border border-white/[0.08] text-white hover:bg-white/[0.05]'
                }`}
              >
                <Eye className="w-4 h-4" />
                <span>Profils Élevés Eugénia</span>
              </motion.button>
            </div>
            
            {/* Filtres Intelligents */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4 mb-6">
              <div className="xl:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Rechercher par nom ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white/[0.02] border border-white/[0.08] rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-white/[0.2] transition-colors"
                />
              </div>
            </div>
            
              <select
                value={filterProfil}
                onChange={(e) => setFilterProfil(e.target.value)}
                className="px-4 py-2 bg-white/[0.02] border border-white/[0.08] rounded-lg text-white focus:outline-none focus:border-white/[0.2] transition-colors"
              >
                {profilsUniques.map(profil => (
                  <option key={profil} value={profil} className="bg-[#0B0C15]">{profil}</option>
                ))}
              </select>

              <select
                value={filterBac}
                onChange={(e) => setFilterBac(e.target.value)}
                className="px-4 py-2 bg-white/[0.02] border border-white/[0.08] rounded-lg text-white focus:outline-none focus:border-white/[0.2] transition-colors"
              >
                {bacsUniques.map(bac => (
                  <option key={bac} value={bac} className="bg-[#0B0C15]">{bac}</option>
                ))}
              </select>

              <select
                value={filterSpec}
                onChange={(e) => setFilterSpec(e.target.value)}
                className="px-4 py-2 bg-white/[0.02] border border-white/[0.08] rounded-lg text-white focus:outline-none focus:border-white/[0.2] transition-colors"
              >
                {spesUniques.map(spec => (
                  <option key={spec} value={spec} className="bg-[#0B0C15]">{spec}</option>
                ))}
              </select>

              <select
                value={filterSource}
                onChange={(e) => setFilterSource(e.target.value)}
                className="px-4 py-2 bg-white/[0.02] border border-white/[0.08] rounded-lg text-white focus:outline-none focus:border-white/[0.2] transition-colors"
              >
                {sourcesUniques.map(source => (
                  <option key={source} value={source} className="bg-[#0B0C15]">{source}</option>
                ))}
              </select>

              <input
                type="number"
                placeholder="Score min"
                value={filterScoreMin}
                onChange={(e) => setFilterScoreMin(Number(e.target.value) || 0)}
                min="0"
                max="100"
                className="px-4 py-2 bg-white/[0.02] border border-white/[0.08] rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-white/[0.2] transition-colors"
              />
            </div>

            <div className="flex flex-wrap gap-4 mb-4">
              <select
                value={filterObjectif}
                onChange={(e) => setFilterObjectif(e.target.value)}
                className="px-4 py-2 bg-white/[0.02] border border-white/[0.08] rounded-lg text-white focus:outline-none focus:border-white/[0.2] transition-colors"
              >
                {objectifsUniques.map(obj => (
                  <option key={obj} value={obj} className="bg-[#0B0C15]">{obj}</option>
                ))}
              </select>

            <select
              value={filterStatut}
              onChange={(e) => setFilterStatut(e.target.value)}
                className="px-4 py-2 bg-white/[0.02] border border-white/[0.08] rounded-lg text-white focus:outline-none focus:border-white/[0.2] transition-colors"
            >
              {statutsUniques.map(statut => (
                  <option key={statut} value={statut} className="bg-[#0B0C15]">{statut}</option>
              ))}
            </select>

              <div className="ml-auto text-sm text-slate-400">
                {filteredUsers.length} candidat{filteredUsers.length > 1 ? 's' : ''} trouvé{filteredUsers.length > 1 ? 's' : ''}
              </div>
          </div>
        </div>

        {loading && (
          <div className="text-center py-12">
            <p className="text-slate-400">Chargement des données depuis Firebase...</p>
          </div>
        )}

          {!loading && validUsers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-400 mb-4">Aucune donnée trouvée dans Firebase.</p>
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6 mt-6 max-w-2xl mx-auto text-left">
                <h3 className="text-lg font-semibold mb-3 text-yellow-400">🔧 Guide de Diagnostic</h3>
                <ol className="space-y-2 text-slate-300 text-sm list-decimal list-inside">
                  <li>Ouvrez la console du navigateur (F12) et regardez les logs lors de la sauvegarde</li>
                  <li>Vérifiez les règles Firestore dans Firebase Console :
                    <pre className="bg-black/50 p-3 rounded mt-2 text-xs overflow-x-auto">
{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /candidates/{document=**} {
      allow read, write: if true;
    }
  }
}`}
                    </pre>
                  </li>
                  <li>Vérifiez que la collection "candidates" existe dans Firestore</li>
                  <li>Testez en jouant au jeu : après avoir complété le profil, vérifiez la console pour voir si la sauvegarde fonctionne</li>
                </ol>
              </div>
          </div>
        )}

        {!loading && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
            <thead>
                <tr className="border-b border-white/[0.08]">
                <th className="pb-4 text-sm font-semibold text-slate-400 uppercase tracking-wider">Candidat</th>
                <th className="pb-4 text-sm font-semibold text-slate-400 uppercase tracking-wider">Profil</th>
                <th className="pb-4 text-sm font-semibold text-slate-400 uppercase tracking-wider">Parcours</th>
                <th className="pb-4 text-sm font-semibold text-slate-400 uppercase tracking-wider">Source</th>
                <th className="pb-4 text-sm font-semibold text-slate-400 uppercase tracking-wider">Score</th>
                <th className="pb-4 text-sm font-semibold text-slate-400 uppercase tracking-wider">Statut CRM</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => {
                  const profilColor = user.profil === 'Albert' ? COLORS.albert : COLORS.eugenia;
                const nomComplet = user.nom || user.prenom || 'Anonyme';
                const initiales = nomComplet.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
                
                return (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.02 }}
                      className="border-b border-white/[0.05] hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="py-4">
                      <div className="flex items-center space-x-3">
                        <div
                            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold text-white border-2"
                            style={{ backgroundColor: `${profilColor}20`, borderColor: profilColor }}
                        >
                          {initiales}
                        </div>
                        <div>
                          <p className="font-medium text-white">
                            {user.prenom && user.nom ? `${user.prenom} ${user.nom}` : (user.nom || user.prenom || 'Anonyme')}
                          </p>
                          <p className="text-xs text-slate-400">{user.email || 'Pas d\'email'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <span
                          className="px-3 py-1 rounded-full text-xs font-semibold border"
                        style={{
                          backgroundColor: `${profilColor}20`,
                          color: profilColor,
                            borderColor: `${profilColor}40`
                        }}
                      >
                        {user.profil}
                      </span>
                    </td>
                    <td className="py-4">
                        <p className="text-sm text-white">{user.classe || user.bac || 'N/A'}</p>
                      <p className="text-xs text-slate-400">
                        {user.filiere ? `${user.filiere} • ` : ''}
                        {user.spes && user.spes.length > 0 ? user.spes.join(' / ') : 'Aucune'}
                      </p>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-slate-400" />
                          <span className="text-sm text-slate-300">{user.source || 'Non spécifié'}</span>
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-semibold text-white">{user.matchPercentage || user.score || 0}</span>
                        <span className="text-xs text-slate-400">/ 100</span>
                      </div>
                    </td>
                    <td className="py-4">
                      <select
                        value={user.statut || 'Nouveau'}
                        onChange={(e) => handleStatusChange(user.id, e.target.value)}
                          className="px-3 py-1 bg-white/[0.02] border border-white/[0.08] rounded-lg text-sm text-white focus:outline-none focus:border-white/[0.2] transition-colors"
                      >
                        {statutsUniques.filter(s => s !== 'Tous').map(statut => (
                            <option key={statut} value={statut} className="bg-[#0B0C15]">{statut}</option>
                        ))}
                      </select>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
          </div>
        )}

        {!loading && filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-400">Aucun candidat trouvé avec ces filtres.</p>
          </div>
        )}
      </motion.div>
      </div>
    </div>
  );
}
