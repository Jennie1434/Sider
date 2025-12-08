# 🔧 Guide de Diagnostic Firebase

## ✅ Vérifications Rapides

### 1. Ouvrir la console (F12)
Filtrez les erreurs d'extensions : `-content_script.js`

### 2. Recharger la page
Vous devriez voir :
```
✅ Firebase app initialisé: [DEFAULT]
✅ Firestore initialisé
✅ Projet: sider-73b83
🔍 Test de connexion Firebase au démarrage...
✅ Firebase db est initialisé
```

### 3. Jouer au jeu
Après avoir complété le profil et cliqué sur le bouton final, vous devriez voir :
```
🎯 ResultCard: Bouton cliqué!
🎮 Phase IA Complete! Fonction appelée!
💾 Tentative de sauvegarde dans Firebase...
✅ Collection "candidates" accessible
💾 AVANT addDoc - Collection et données prêtes
✅ Candidat sauvegardé avec succès! ID: [ID]
```

## ❌ Si vous ne voyez PAS ces logs

### Problème 1 : Firebase n'est pas initialisé
**Symptôme** : Pas de logs `✅ Firebase app initialisé`

**Solution** :
1. Vérifiez que `src/firebase/config.js` existe
2. Vérifiez que `npm install firebase` a été exécuté
3. Redémarrez le serveur : `Ctrl+C` puis `npm run dev`

### Problème 2 : Le bouton ne déclenche pas la sauvegarde
**Symptôme** : Pas de logs `🎯 ResultCard: Bouton cliqué!`

**Solution** :
1. Vérifiez que vous cliquez bien sur le bouton final
2. Vérifiez que le bouton est visible (pas masqué)
3. Vérifiez la console pour des erreurs JavaScript

### Problème 3 : Erreur "permission-denied"
**Symptôme** : Logs `❌ Code: permission-denied`

**Solution** :
1. Allez sur https://console.firebase.google.com
2. Projet : `sider-73b83`
3. Firestore Database → Règles
4. Vérifiez que les règles permettent read/write jusqu'au 4 janvier 2026

### Problème 4 : Erreur "db n'est pas initialisé"
**Symptôme** : Logs `❌ db est null ou undefined!`

**Solution** :
1. Vérifiez que `src/firebase/config.js` exporte bien `db`
2. Vérifiez que l'import dans `App.jsx` est correct : `import { db } from './firebase/config'`
3. Redémarrez le serveur

## 🧪 Test Manuel

Ouvrez la console et tapez :
```javascript
import { db } from './firebase/config.js';
console.log('db:', db);
```

Si ça ne fonctionne pas, il y a un problème d'import.

## 📋 Checklist Complète

- [ ] Firebase installé : `npm list firebase` montre `firebase@12.6.0`
- [ ] Fichier `src/firebase/config.js` existe
- [ ] Fichier `src/context/ScoringContext.jsx` existe
- [ ] Serveur de développement tourne
- [ ] Console ouverte (F12)
- [ ] Logs Firebase visibles au démarrage
- [ ] Bouton final cliqué
- [ ] Logs de sauvegarde visibles
- [ ] Aucune erreur rouge dans la console

## 🆘 Si Rien Ne Fonctionne

1. **Redémarrez tout** :
   ```bash
   # Arrêter le serveur (Ctrl+C)
   # Puis relancer
   npm run dev
   ```

2. **Videz le cache** :
   - Chrome : `Cmd+Shift+R` (Mac) / `Ctrl+Shift+R` (Windows)
   - Ou : Paramètres → Effacer les données de navigation → Cache

3. **Vérifiez les erreurs** :
   - Copiez TOUTES les erreurs de la console
   - Vérifiez s'il y a des erreurs d'import

4. **Test minimal** :
   - Créez un nouveau fichier de test
   - Importez Firebase et testez une sauvegarde simple

