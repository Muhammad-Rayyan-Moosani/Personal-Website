import { memo } from 'react';
import { motion } from 'framer-motion';
import './Preloader.css';

// Memoized Preloader - uses CSS animations internally for better perf
function Preloader({ onComplete }) {
  return (
    <motion.div
      className="preloader"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      onAnimationComplete={onComplete}
    >
      <div className="preloader-content">
        {/* Spaceship - CSS animated for GPU acceleration */}
        <div className="preloader-spaceship">
          <svg
            width="80"
            height="80"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16 4L20 12L28 16L20 20L16 28L12 20L4 16L12 12L16 4Z"
              fill="var(--accent-color)"
              stroke="var(--accent-glow)"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <circle cx="16" cy="16" r="3" fill="var(--bg-primary)" />
          </svg>
        </div>

        {/* Loading Text - CSS animated */}
        <p className="preloader-text">
          Preparing launch...
        </p>

        {/* Progress Bar - CSS animated */}
        <div className="preloader-bar" />
      </div>
    </motion.div>
  );
}

export default memo(Preloader);
