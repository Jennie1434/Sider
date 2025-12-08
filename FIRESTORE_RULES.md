# Règles Firestore Recommandées

Copiez-collez ces règles dans Firebase Console → Firestore Database → Règles

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    
    // Règle générale pour toutes les collections (valide jusqu'au 4 janvier 2026)
    match /{document=**} {
      allow read, write: if request.time < timestamp.date(2026, 1, 4);
    }
    
    // Règle explicite pour la collection candidates (plus sécurisée)
    match /candidates/{candidateId} {
      allow read, write: if request.time < timestamp.date(2026, 1, 4);
    }
    
    // Règle explicite pour la collection candidats (alternative)
    match /candidats/{candidateId} {
      allow read, write: if request.time < timestamp.date(2026, 1, 4);
    }
  }
}
```

## Instructions

1. Allez sur https://console.firebase.google.com
2. Sélectionnez le projet **sider-73b83**
3. Cliquez sur **Firestore Database** dans le menu de gauche
4. Cliquez sur l'onglet **Règles**
5. Copiez-collez les règles ci-dessus
6. Cliquez sur **Publier**

## Test de connexion

Après avoir mis à jour les règles, testez en :
1. Jouant au jeu
2. Complétant le profil
3. Vérifiant la console du navigateur (F12) pour les logs
4. Vérifiant dans Firestore Console que le document apparaît dans la collection `candidates`

