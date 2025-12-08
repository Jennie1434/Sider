// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCAQzV7FxfF56WxwbX5udnUu7X_NxNeFQs",
  authDomain: "sider-73b83.firebaseapp.com",
  projectId: "sider-73b83",
  storageBucket: "sider-73b83.firebasestorage.app",
  messagingSenderId: "868092437302",
  appId: "1:868092437302:web:87a37625bc11d814fb0997",
  measurementId: "G-MB62CB06JW"
};

// Initialize Firebase
let app;
try {
  app = initializeApp(firebaseConfig);
  console.log('✅ Firebase app initialisé:', app.name);
} catch (error) {
  console.error('❌ Erreur initialisation Firebase app:', error);
  throw error;
}

// Initialize Analytics
let analytics;
try {
  analytics = getAnalytics(app);
  console.log('✅ Firebase Analytics initialisé');
} catch (error) {
  // Analytics peut ne pas être disponible en développement
  console.warn('⚠️ Analytics non disponible:', error.message);
  analytics = null;
}

// Initialize Firestore
let db;
try {
  db = getFirestore(app);
  console.log('✅ Firestore initialisé');
  console.log('✅ Projet:', firebaseConfig.projectId);
} catch (error) {
  console.error('❌ Erreur initialisation Firestore:', error);
  throw error;
}

// Export pour utilisation dans l'application
export { db, analytics, app };

