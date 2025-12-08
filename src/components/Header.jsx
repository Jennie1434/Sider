import { motion } from 'framer-motion';

export default function Header({ progress = 0 }) {
  return (
    <header className="fixed left-0 right-0 top-0 z-50">
      {/* Ultra-thin Progress Bar */}
      <div className="h-0.5 w-full bg-white/5">
        <motion.div
          className="h-full bg-gradient-to-r from-white/40 via-white/60 to-white/40"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 30,
          }}
        />
      </div>
    </header>
  );
}

