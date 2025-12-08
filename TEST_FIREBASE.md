# Test de Connexion Firebase

## Vérifications à faire

### 1. Ouvrir la console du navigateur (F12)

### 2. Recharger la page

Vous devriez voir ces logs dans la console :
```
✅ Firebase app initialisé: [DEFAULT]
✅ Firestore initialisé, projet: sider-73b83
🚀 App démarrée - Test de connexion Firebase...
✅ Firebase db est disponible
✅ Collection "candidates" accessible
✅ Permissions OK - X document(s) trouvé(s)
```

### 3. Si vous voyez des erreurs

#### Erreur "permission-denied"
→ Vérifiez les règles Firestore dans Firebase Console

#### Erreur "unavailable"
→ Vérifiez votre connexion internet

#### Erreur "db n'est pas initialisé"
→ Vérifiez que `firebase/config.js` est correctement importé

### 4. Tester la sauvegarde

1. Jouez au jeu
2. Complétez le profil
3. Cliquez sur le bouton final
4. Vérifiez les logs dans la console

Vous devriez voir :
```
🎯 ResultCard: Bouton cliqué
💾 Tentative d'écriture dans Firestore collection "candidates"...
✅ Collection "candidates" accessible
✅ Candidat sauvegardé avec succès! ID: [ID]
```

### 5. Vérifier dans Firebase Console

1. Allez sur https://console.firebase.google.com
2. Projet : sider-73b83
3. Firestore Database → Data
4. Vérifiez que la collection `candidates` existe
5. Vérifiez qu'elle contient des documents

## Si rien ne fonctionne

1. Vérifiez que Firebase est bien installé : `npm list firebase`
2. Vérifiez que le fichier `src/firebase/config.js` existe
3. Vérifiez que les règles Firestore permettent read/write
4. Vérifiez la console du navigateur pour les erreurs exactes

