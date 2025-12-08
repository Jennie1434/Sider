import { motion } from 'framer-motion';

export default function Layout({ children }) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-midnight">
      {/* Animated Radial Gradient Background */}
      <motion.div
        className="absolute inset-0 opacity-50"
        animate={{
          background: [
            'radial-gradient(circle at 30% 40%, rgba(255, 255, 255, 0.03) 0%, transparent 50%)',
            'radial-gradient(circle at 70% 60%, rgba(255, 255, 255, 0.03) 0%, transparent 50%)',
            'radial-gradient(circle at 40% 70%, rgba(255, 255, 255, 0.03) 0%, transparent 50%)',
            'radial-gradient(circle at 30% 40%, rgba(255, 255, 255, 0.03) 0%, transparent 50%)',
          ],
        }}
        transition={{
          duration: 15,
          ease: 'easeInOut',
          repeat: Infinity,
        }}
      />

      {/* Main Content Container */}
      <div className="relative z-10 flex h-full w-full items-center justify-center px-6">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {children}
        </motion.div>
      </div>

      {/* Subtle Vignette Effect */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-midnight/30" />
    </div>
  );
}

