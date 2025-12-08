import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function IntroScreen({ onStart }) {
  return (
    <div style={{
      textAlign: 'center',
      padding: '2rem 0'
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h1 style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '1.5rem',
            letterSpacing: '-0.025em'
          }}>
            MISSION : LEAD PRODUCT
          </h1>
          
          <p style={{
            fontSize: '1.125rem',
            color: '#94a3b8',
            marginBottom: '3rem',
            maxWidth: '42rem',
            margin: '0 auto 3rem',
            lineHeight: '1.75'
          }}>
            Vous prenez la tête d'une startup Tech. 4 décisions clés vont définir l'ADN de votre entreprise.
          </p>

          <motion.button
            onClick={onStart}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '1rem 2rem',
              backgroundColor: '#13151F',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '0.75rem',
              color: 'white',
              fontWeight: '500',
              cursor: 'pointer',
              fontSize: '1rem',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            }}
          >
            COMMENCER LA MISSION
            <ArrowRight style={{ width: '1.25rem', height: '1.25rem' }} />
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}
