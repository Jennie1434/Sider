import { motion } from 'framer-motion';

export default function ProgressBar({ progress }) {
  const currentStep = progress > 0 ? Math.ceil(progress / 25) : 1;
  const totalSteps = 4;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 50,
      backgroundColor: 'rgba(11, 12, 21, 0.8)',
      backdropFilter: 'blur(8px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
    }}>
      <div style={{
        maxWidth: '42rem',
        margin: '0 auto',
        padding: '0.75rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem'
      }}>
        <span style={{
          fontSize: '0.75rem',
          color: '#94a3b8',
          fontWeight: '500'
        }}>
          {currentStep}/{totalSteps}
        </span>
        <div style={{
          flex: 1,
          height: '2px',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '9999px',
          overflow: 'hidden'
        }}>
          <motion.div
            style={{
              height: '100%',
              background: 'linear-gradient(to right, #6366f1, #a855f7)'
            }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
        </div>
      </div>
    </div>
  );
}
