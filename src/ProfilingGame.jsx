import { useState } from 'react';

function ProfilingGame() {
  const [currentStep, setCurrentStep] = useState('intro');

  console.log('ProfilingGame rendu, currentStep:', currentStep);

  const handleStart = () => {
    console.log('Bouton cliqué !');
    setCurrentStep('phase1');
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0B0C15',
      fontFamily: 'Inter, system-ui, sans-serif',
      color: '#FFFFFF',
      padding: '0',
      margin: '0'
    }}>
      {currentStep === 'intro' && (
        <div style={{
          maxWidth: '672px',
          margin: '0 auto',
          padding: '80px 24px',
          textAlign: 'center'
        }}>
          <h1 style={{
            fontSize: '48px',
            fontWeight: 'bold',
            color: '#FFFFFF',
            marginBottom: '24px',
            letterSpacing: '-0.02em'
          }}>
            MISSION : LEAD PRODUCT
          </h1>
          
          <p style={{
            fontSize: '18px',
            color: '#94a3b8',
            marginBottom: '48px',
            maxWidth: '576px',
            margin: '0 auto 48px',
            lineHeight: '1.75'
          }}>
            Vous prenez la tête d'une startup Tech. 4 décisions clés vont définir l'ADN de votre entreprise.
          </p>

          <button
            onClick={handleStart}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              padding: '16px 32px',
              backgroundColor: '#13151F',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              color: '#FFFFFF',
              fontWeight: '500',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            COMMENCER LA MISSION →
          </button>
        </div>
      )}

      {currentStep === 'phase1' && (
        <div style={{
          maxWidth: '672px',
          margin: '0 auto',
          padding: '80px 24px',
          color: '#FFFFFF'
        }}>
          <h2 style={{ fontSize: '32px', marginBottom: '16px' }}>
            ÉTAPE 1 : IA (L'USAGE)
          </h2>
          <p style={{ fontSize: '18px', color: '#94a3b8', marginBottom: '32px' }}>
            Nous devons intégrer une feature IA pour le lancement. Laquelle priorisez-vous ?
          </p>
          <button
            onClick={() => setCurrentStep('intro')}
            style={{
              padding: '12px 24px',
              backgroundColor: '#13151F',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              color: '#FFFFFF',
              cursor: 'pointer'
            }}
          >
            Retour
          </button>
        </div>
      )}
    </div>
  );
}

export default ProfilingGame;
