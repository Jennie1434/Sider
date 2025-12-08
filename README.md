# PROJECT: ORIGIN

Une expérience web interactive luxueuse et fluide pour définir votre profil professionnel.

## Design Direction

**Modern Minimalist Luxury** - Inspiré par Apple, Linear.app et les apps Fintech premium.

### Caractéristiques
- 🎨 Palette noir minuit élégante avec dégradés subtils
- ✨ Animations fluides et élastiques (Framer Motion)
- 📱 Design mobile-first responsive
- 🔤 Typographie Manrope moderne et propre

## Stack Technique

- **React** + **Vite** - Build rapide et moderne
- **Tailwind CSS** - Styling utility-first
- **Framer Motion** - Animations fluides et naturelles
- **Google Fonts** - Manrope

## Installation

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Build pour la production
npm run build
```

## Structure du Projet

```
src/
├── components/
│   ├── Layout.jsx        # Container principal avec fond animé
│   ├── Header.jsx        # Barre de progression minimaliste
│   └── WelcomeScreen.jsx # Écran d'accueil premium
├── App.jsx               # Point d'entrée de l'application
├── main.jsx              # Configuration React
└── index.css             # Styles globaux Tailwind
```

## Animations

Toutes les animations utilisent des transitions "spring" pour un mouvement naturel et élastique :
- **Stiffness**: 300
- **Damping**: 30

## Couleurs

- **Midnight Background**: `#020617` (Slate 950)
- **Business Gradient**: Or pâle → Ambre doux
- **Tech Gradient**: Turquoise → Violet Indigo
- **Text Primary**: Blanc pur
- **Text Secondary**: `#94a3b8` (Slate 400)

