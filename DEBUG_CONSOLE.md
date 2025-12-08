# Guide de Diagnostic - Console Vide

## Si la console ne ressort RIEN du tout

### 1. Vérifier que le serveur tourne
```bash
npm run dev
```
Vous devriez voir quelque chose comme :
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### 2. Vérifier la console du navigateur

1. **Ouvrez la console** : Appuyez sur `F12` ou `Cmd+Option+I` (Mac) / `Ctrl+Shift+I` (Windows)
2. **Vérifiez les filtres** : Assurez-vous que les filtres ne masquent pas les logs
   - Cliquez sur l'icône de filtre (funnel)
   - Décochez "Hide network" si coché
   - Vérifiez que "All levels" est sélectionné (pas seulement "Errors")

3. **Rechargez la page** : `Cmd+R` (Mac) / `Ctrl+R` (Windows)

### 3. Logs attendus

Vous devriez voir dans l'ordre :

```
🔥 [FIREBASE CONFIG] Fichier chargé!
🔥 [FIREBASE CONFIG] Imports chargés
🔥 [FIREBASE CONFIG] Configuration: sider-73b83
✅ [FIREBASE] App initialisé: [DEFAULT]
✅ [FIREBASE] Projet: sider-73b83
✅ [FIREBASE] Analytics initialisé
✅ [FIREBASE] Firestore initialisé
✅ [FIREBASE] DB disponible: true
✅ [FIREBASE] Projet Firestore: sider-73b83
🔥 [FIREBASE CONFIG] Configuration complète!
🚀 [MAIN] Application démarre...
✅ [MAIN] Firebase importé avec succès
✅ [MAIN] DB disponible: true
✅ [MAIN] Application rendue
🎯 [APP] Composant App rendu
🎯 [APP] useEffect exécuté - Test Firebase...
🚀 [APP] Test de connexion Firebase...
```

### 4. Si vous ne voyez AUCUN log

**Problème possible** : Le JavaScript ne se charge pas

**Solutions** :
1. Vérifiez l'onglet **Console** (pas Network, pas Elements)
2. Vérifiez l'onglet **Network** pour voir si les fichiers JS se chargent
3. Vérifiez l'onglet **Sources** pour voir si les fichiers sont présents
4. Videz le cache : `Cmd+Shift+R` (Mac) / `Ctrl+Shift+R` (Windows)

### 5. Si vous voyez des erreurs rouges

Copiez l'erreur complète et vérifiez :
- **Erreur de module** : Problème d'import
- **Erreur Firebase** : Problème de configuration
- **Erreur réseau** : Problème de connexion

### 6. Test manuel dans la console

Ouvrez la console et tapez :
```javascript
console.log('Test manuel');
```

Si vous ne voyez même pas ce log, le problème vient de la console elle-même, pas du code.

### 7. Vérifier que le code est bien sauvegardé

1. Vérifiez que `src/firebase/config.js` existe
2. Vérifiez que `src/main.jsx` existe
3. Vérifiez que `src/App.jsx` existe
4. Redémarrez le serveur : `Ctrl+C` puis `npm run dev`

## Checklist complète

- [ ] Serveur de développement tourne (`npm run dev`)
- [ ] Page web s'affiche dans le navigateur
- [ ] Console du navigateur ouverte (F12)
- [ ] Filtres de console désactivés
- [ ] Page rechargée (Cmd+R / Ctrl+R)
- [ ] Cache vidé (Cmd+Shift+R / Ctrl+Shift+R)
- [ ] Aucune erreur rouge dans la console

