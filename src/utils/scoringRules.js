// Règles de scoring pour Albert et Eugénia

export const SCORING_RULES = {
  // 1️⃣ Classe actuelle
  classe: {
    'Seconde': { albert: 0, eugenia: 0 },
    'Première': { albert: 0, eugenia: 0 },
    'Terminale': { albert: 1, eugenia: 0 },
    'Étudiant (Bac+)': { albert: 0, eugenia: 2 },
    'En réorientation': { albert: 0, eugenia: 2 }
  },

  // 2️⃣ Filière / Type de Bac
  filiere: {
    'Générale': { albert: 2, eugenia: 0 },
    'Technologique (STI2D, STMG...)': { albert: 0, eugenia: 2 },
    'Professionnelle': { albert: 0, eugenia: 3 },
    'Pro / Autre': { albert: 0, eugenia: 3 }
  },

  // 3️⃣ Moyenne générale
  moyenne: {
    '<11': { albert: 0, eugenia: 2 },
    '11-13': { albert: 0, eugenia: 1 },
    '14-15': { albert: 1, eugenia: 1 },
    '16+': { albert: 2, eugenia: 0 }
  },

  // 4️⃣ Spécialités
  specialites: {
    // Albert
    'maths': { albert: 3, eugenia: 0 },
    'physique-chimie': { albert: 2, eugenia: 0 },
    'svt': { albert: 1, eugenia: 0 },
    'ses': { albert: 1, eugenia: 0 },
    'hggsp': { albert: 1, eugenia: 0 },
    // Eugénia
    'nsi': { albert: 0, eugenia: 3 },
    'si': { albert: 0, eugenia: 2 },
    'hlp': { albert: 0, eugenia: 1 },
    'arts': { albert: 0, eugenia: 2 },
    'llcer': { albert: 0, eugenia: 1 },
    // Autres (par défaut)
    'default': { albert: 1, eugenia: 1 }
  },

  // 5️⃣ Options
  options: {
    'Maths Expertes': { albert: 4, eugenia: 0 },
    'Maths Complémentaire': { albert: 3, eugenia: 0 },
    'Maths Complémentaires': { albert: 3, eugenia: 0 },
    'Droit/DGEMC': { albert: 0, eugenia: 2 },
    'Droit': { albert: 0, eugenia: 2 },
    'DGEMC': { albert: 0, eugenia: 2 },
    'Aucune': { albert: 0, eugenia: 0 }
  },

  // 6️⃣ Niveau d'anglais
  anglais: {
    'A1-A2': { albert: 0, eugenia: 2 },
    'B1': { albert: 0, eugenia: 1 },
    'B2': { albert: 2, eugenia: 0 },
    'C1-C2': { albert: 3, eugenia: 0 }
  },

  // 7️⃣ Objectif de carrière
  objectif: {
    'entreprise': { albert: 0, eugenia: 3 }, // Créer une boîte
    'expert': { albert: 3, eugenia: 0 }, // Expert Tech/Data
    'voie': { albert: 0, eugenia: 1 }, // Trouver ma voie
    'autre': { albert: 0, eugenia: 0 }
  },

  // 8️⃣ Mini-jeux / Choix de personnalité (déjà dans PhaseIA)
  personality: {
    // Ces scores sont déjà gérés dans PhaseIA avec choice.score
    // On les garde pour référence
  }
};

// Fonction helper pour calculer les scores d'une spécialité
export const getSpecialiteScore = (specialite) => {
  if (!specialite) return SCORING_RULES.specialites.default;
  
  const normalized = specialite.toLowerCase().trim();
  
  // Mapping des variations de noms
  const mapping = {
    'maths': 'maths',
    'mathématiques': 'maths',
    'math': 'maths',
    'physique-chimie': 'physique-chimie',
    'physique': 'physique-chimie',
    'pc': 'physique-chimie',
    'svt': 'svt',
    'ses': 'ses',
    'hggsp': 'hggsp',
    'nsi': 'nsi',
    'si': 'si',
    'hlp': 'hlp',
    'arts': 'arts',
    'llcer': 'llcer'
  };
  
  const mappedKey = mapping[normalized] || normalized;
  return SCORING_RULES.specialites[mappedKey] || SCORING_RULES.specialites.default;
};

// Fonction helper pour calculer tous les scores depuis les données utilisateur
export const calculateScoresFromUserData = (userData) => {
  let albert = 0;
  let eugenia = 0;
  const reasons = [];

  // Classe
  if (userData.classe && SCORING_RULES.classe[userData.classe]) {
    const score = SCORING_RULES.classe[userData.classe];
    albert += score.albert;
    eugenia += score.eugenia;
    reasons.push(`Classe: ${userData.classe}`);
  }

  // Filière
  if (userData.filiere && SCORING_RULES.filiere[userData.filiere]) {
    const score = SCORING_RULES.filiere[userData.filiere];
    albert += score.albert;
    eugenia += score.eugenia;
    reasons.push(`Filière: ${userData.filiere}`);
  }

  // Moyenne
  if (userData.moyenne && SCORING_RULES.moyenne[userData.moyenne]) {
    const score = SCORING_RULES.moyenne[userData.moyenne];
    albert += score.albert;
    eugenia += score.eugenia;
    reasons.push(`Moyenne: ${userData.moyenne}`);
  }

  // Spécialités
  if (userData.spes && Array.isArray(userData.spes)) {
    userData.spes.forEach(spec => {
      const score = getSpecialiteScore(spec);
      albert += score.albert;
      eugenia += score.eugenia;
      reasons.push(`Spécialité: ${spec}`);
    });
  }

  // Options
  if (userData.options && SCORING_RULES.options[userData.options]) {
    const score = SCORING_RULES.options[userData.options];
    albert += score.albert;
    eugenia += score.eugenia;
    reasons.push(`Option: ${userData.options}`);
  }

  // Anglais
  if (userData.englishLevel && SCORING_RULES.anglais[userData.englishLevel]) {
    const score = SCORING_RULES.anglais[userData.englishLevel];
    albert += score.albert;
    eugenia += score.eugenia;
    reasons.push(`Anglais: ${userData.englishLevel}`);
  }

  // Objectif
  if (userData.objectif && SCORING_RULES.objectif[userData.objectif]) {
    const score = SCORING_RULES.objectif[userData.objectif];
    albert += score.albert;
    eugenia += score.eugenia;
    reasons.push(`Objectif: ${userData.objectif}`);
  }

  return { albert, eugenia, reasons };
};

