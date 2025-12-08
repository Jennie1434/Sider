# Erreurs d'Extensions - Guide

## Les erreurs `content_script.js` sont normales

Ces erreurs proviennent d'**extensions de navigateur** (comme des outils d'autocomplétion, gestionnaires de mots de passe, etc.), **PAS de votre code**.

### Comment les ignorer dans la console

#### Chrome / Edge
1. Ouvrez la console (F12)
2. Cliquez sur l'icône de filtre (funnel) en haut à droite
3. Ajoutez un filtre négatif : `-content_script.js`
4. Les erreurs d'extensions seront masquées

#### Firefox
1. Ouvrez la console (F12)
2. Cliquez sur l'icône de filtre
3. Décochez "Extensions" si disponible
4. Ou ajoutez un filtre : `-content_script`

### Alternative : Désactiver temporairement les extensions

Pour tester sans ces erreurs :
1. Ouvrez Chrome en mode incognito (les extensions sont désactivées)
2. Ou désactivez temporairement les extensions dans les paramètres du navigateur

## Vérifier que votre code fonctionne

Ces erreurs n'affectent **PAS** votre application. Pour vérifier que tout fonctionne :

1. **Firebase** : Les logs montrent que Firebase est bien connecté ✅
2. **Sauvegarde** : Testez en jouant au jeu et vérifiez les logs de sauvegarde
3. **Dashboard** : Vérifiez que les candidats apparaissent dans le dashboard admin

## Logs importants à surveiller

Au lieu de ces erreurs d'extensions, surveillez ces logs de votre application :

- `💾 Tentative d'écriture dans Firestore...`
- `✅ Candidat sauvegardé avec succès!`
- `✅ Permissions OK - X document(s) trouvé(s)`

Ces logs confirment que Firebase fonctionne correctement.

