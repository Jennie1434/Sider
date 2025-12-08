// Configuration d'accès admin
// Code secret pour accéder au dashboard admin
// À changer en production avec un code fort
export const ADMIN_SECRET_CODE = 'SIDER2024_DIRECTEUR';

// Vérifier si l'utilisateur est authentifié comme directeur
export const isAdminAuthenticated = () => {
  // Vérifier dans sessionStorage
  const authToken = sessionStorage.getItem('admin_auth_token');
  if (authToken === ADMIN_SECRET_CODE) {
    return true;
  }
  
  // Vérifier dans l'URL
  const urlParams = new URLSearchParams(window.location.search);
  const urlCode = urlParams.get('admin_code');
  if (urlCode === ADMIN_SECRET_CODE) {
    // Sauvegarder pour la session
    sessionStorage.setItem('admin_auth_token', ADMIN_SECRET_CODE);
    // Nettoyer l'URL pour ne pas exposer le code
    window.history.replaceState({}, '', window.location.pathname);
    return true;
  }
  
  return false;
};

// Authentifier l'utilisateur avec un code
export const authenticateAdmin = (code) => {
  if (code === ADMIN_SECRET_CODE) {
    sessionStorage.setItem('admin_auth_token', ADMIN_SECRET_CODE);
    return true;
  }
  return false;
};

// Déconnecter l'admin
export const logoutAdmin = () => {
  sessionStorage.removeItem('admin_auth_token');
};

