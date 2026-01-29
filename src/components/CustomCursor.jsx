import { useEffect, useRef, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';
import { prefersReducedMotion, isMobileDevice } from '../utils/performance';
import './CustomCursor.css';

export default function CustomCursor() {
  const cursorRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 200, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Check if mobile/touch device or reduced motion preference
    const checkDeviceAndMotion = () => {
      setIsMobile(isMobileDevice());
      setReducedMotion(prefersReducedMotion());
    };
    checkDeviceAndMotion();
    window.addEventListener('resize', checkDeviceAndMotion);

    if (isMobile || reducedMotion) return;

    const moveCursor = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    // Handle hover states for interactive elements
    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    const interactiveElements = document.querySelectorAll(
      'a, button, .card, .timeline-item, .theme-toggle, input, textarea'
    );

    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('resize', checkDeviceAndMotion);
      interactiveElements.forEach((el) => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, [cursorX, cursorY, isMobile, reducedMotion]);

  if (isMobile || reducedMotion) return null;

  return (
    <>
      <motion.div
        ref={cursorRef}
        className={`custom-cursor ${isHovering ? 'hovering' : ''} ${isClicking ? 'clicking' : ''}`}
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
        }}
      >
        {/* Spaceship SVG */}
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="spaceship-icon"
        >
          <path
            d="M16 4L20 12L28 16L20 20L16 28L12 20L4 16L12 12L16 4Z"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <circle cx="16" cy="16" r="3" fill="var(--bg-primary)" />
        </svg>

        {/* Thrust particles on click */}
        {isClicking && (
          <>
            <motion.div
              className="thrust-particle"
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 2, opacity: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
            <motion.div
              className="thrust-particle thrust-2"
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut', delay: 0.05 }}
            />
          </>
        )}
      </motion.div>

      {/* Trail effect */}
      <motion.div
        className="cursor-trail"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
        }}
      />
    </>
  );
}
