# Système de Scoring Complet - Documentation

## 🎯 Vue d'ensemble

Le système de scoring calcule automatiquement les points pour Albert et Eugénia à chaque étape du jeu, puis détermine le profil final avant l'envoi dans Firestore.

## 📁 Structure des fichiers

### 1. `src/context/ScoringContext.jsx`
- Context React global pour gérer les scores
- Fonctions : `addScore()`, `resetScores()`, `getFinalProfile()`
- Accessible via `useScoring()` dans tous les composants

### 2. `src/utils/scoringRules.js`
- Toutes les règles de scoring définies
- Fonction `calculateScoresFromUserData()` pour calculer depuis les données
- Fonction `getSpecialiteScore()` pour les spécialités

### 3. Composants modifiés
- `App.jsx` : Enveloppé avec `ScoringProvider`, combine les scores pour Firebase
- `Onboarding.jsx` : Ajoute des points à chaque sélection
- `PhaseIA.jsx` : Ajoute des points pour les choix de personnalité
- `ResultCard.jsx` : Affiche les scores finaux et déclenche la sauvegarde

## 📊 Règles de Scoring Implémentées

### 1️⃣ Classe actuelle
- Seconde/Première : 0
- Terminale : +1 Albert
- Étudiant (Bac+) : +2 Eugénia
- En réorientation : +2 Eugénia

### 2️⃣ Filière
- Générale : +2 Albert
- Technologique : +2 Eugénia
- Professionnelle : +3 Eugénia

### 3️⃣ Moyenne
- < 11 : +2 Eugénia
- 11-13 : +1 Eugénia
- 14-15 : +1 Albert et +1 Eugénia
- 16+ : +2 Albert

### 4️⃣ Spécialités
**Albert :**
- Maths : +3
- Physique-Chimie : +2
- SVT : +1
- SES : +1
- HGGSP : +1

**Eugénia :**
- NSI : +3
- SI : +2
- HLP : +1
- Arts : +2
- LLCER : +1

### 5️⃣ Options
- Maths Expertes : +4 Albert
- Maths Complémentaire : +3 Albert
- Droit/DGEMC : +2 Eugénia

### 6️⃣ Anglais
- A1-A2 : +2 Eugénia
- B1 : +1 Eugénia
- B2 : +2 Albert
- C1-C2 : +3 Albert

### 7️⃣ Objectif
- Créer une boîte : +3 Eugénia
- Expert Tech/Data : +3 Albert
- Trouver ma voie : +1 Eugénia

### 8️⃣ Mini-jeux (PhaseIA)
- Chaque choix ajoute +2 points selon l'orientation (Albert ou Eugénia)

## 🔄 Flux de Scoring

1. **Onboarding** : Points ajoutés à chaque sélection via `addScore()`
2. **PhaseIA** : Points ajoutés pour chaque choix de personnalité
3. **Résultat** : Scores combinés du context → Profil final calculé
4. **Firebase** : Tous les scores + profil final sauvegardés

## 🧮 Calcul du Profil Final

```javascript
const profilFinal = scoreAlbert > scoreEugenia ? "Albert" : "Eugenia";
```

Si égalité, le profil est déterminé par le badge calculé dans `calculateFinalBadge()`.

## 📤 Données Sauvegardées dans Firebase

```javascript
{
  // Données onboarding
  prenom, nom, email, classe, filiere, moyenne, spes, options, englishLevel, objectif,
  
  // Scores finaux
  scoreAlbert: totalScoreAlbert,
  scoreEugenia: totalScoreEugenia,
  
  // Profil et badge
  profil: profilFinal,
  badge, subtitle, message, matchPercentage, advice,
  
  // Métadonnées
  source, dateInscription, statut
}
```

## ✅ Test

1. Jouer au jeu complet
2. Vérifier les logs dans la console pour voir les scores s'accumuler
3. Vérifier que le profil final est correct
4. Vérifier dans Firebase que toutes les données sont sauvegardées

