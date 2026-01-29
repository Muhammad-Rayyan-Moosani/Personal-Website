import { motion } from 'framer-motion';
import './Preloader.css';

export default function Preloader({ onComplete }) {
  return (
    <motion.div
      className="preloader"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      onAnimationComplete={onComplete}
    >
      <div className="preloader-content">
        {/* Animated Spaceship */}
        <motion.div
          className="preloader-spaceship"
          initial={{ scale: 0, rotate: 0 }}
          animate={{
            scale: [0, 1.2, 1],
            rotate: [0, 360],
          }}
          transition={{
            duration: 1.2,
            ease: 'easeOut',
            times: [0, 0.6, 1],
          }}
        >
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
        </motion.div>

        {/* Loading Text */}
        <motion.p
          className="preloader-text"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Preparing launch...
        </motion.p>

        {/* Progress Bar */}
        <motion.div
          className="preloader-bar"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
        />
      </div>
    </motion.div>
  );
}
