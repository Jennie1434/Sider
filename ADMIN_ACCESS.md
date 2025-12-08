# 🔐 Accès Admin - Directeurs d'École

## Sécurité

L'accès au dashboard admin est **réservé uniquement aux directeurs d'école**. Le bouton d'accès admin n'est plus visible publiquement.

## Méthodes d'accès

### 1. Via URL avec code secret
Ajoutez le paramètre `admin_code` dans l'URL avec le code secret :
```
https://votre-site.com?admin_code=CODE_SECRET
```

### 2. Via raccourci clavier
Appuyez sur **Ctrl + Shift + A** (ou **Cmd + Shift + A** sur Mac) pour ouvrir la fenêtre d'authentification.

### 3. Code secret
Le code secret est défini dans `src/config/adminConfig.js` :
- **Code par défaut** : `SIDER2024_DIRECTEUR`
- **⚠️ IMPORTANT** : Changez ce code en production !

## Configuration

Pour modifier le code secret, éditez le fichier `src/config/adminConfig.js` :

```javascript
export const ADMIN_SECRET_CODE = 'VOTRE_CODE_SECRET_ICI';
```

## Authentification

- L'authentification est valide pour **la session en cours** (sessionStorage)
- Une fois authentifié, vous pouvez accéder au dashboard admin
- L'authentification expire à la fermeture du navigateur

## Sécurité en production

1. **Changez le code secret** avant le déploiement
2. Utilisez un code fort (majuscules, chiffres, caractères spéciaux)
3. Ne partagez le code qu'avec les directeurs autorisés
4. Considérez l'utilisation d'une authentification Firebase plus robuste pour la production

