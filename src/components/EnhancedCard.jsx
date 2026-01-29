import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import LazyImage from "./LazyImage";
import "./StyleSheet.css";

// Check if device supports hover (desktop)
const supportsHover = typeof window !== 'undefined' && 
  window.matchMedia('(hover: hover)').matches;

export default function EnhancedCard({ title, bullets = [], description, date, link, image }) {
  const ref = useRef(null);
  const [visibleCount, setVisibleCount] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  
  // Cached rect values - prevents layout thrashing
  const rectCache = useRef({ left: 0, top: 0, width: 0, height: 0, centerX: 0, centerY: 0 });
  const rafId = useRef(null);
  const pendingUpdate = useRef({ x: 0, y: 0 });

  const hasBullets = bullets && bullets.length > 0;

  // Mouse position for 3D tilt effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Optimized spring config - same visual, less internal work
  const springConfig = useMemo(() => ({
    stiffness: 300,
    damping: 30,
    restDelta: 0.001,
    restSpeed: 0.001,
  }), []);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), springConfig);

  // Cache rect on hover start - avoid repeated getBoundingClientRect calls
  const cacheRect = useCallback(() => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    rectCache.current = {
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height,
      centerX: rect.left + rect.width / 2,
      centerY: rect.top + rect.height / 2,
    };
  }, []);

  // Batch DOM writes in rAF
  const flushUpdate = useCallback(() => {
    x.set(pendingUpdate.current.x);
    y.set(pendingUpdate.current.y);
    rafId.current = null;
  }, [x, y]);

  // Throttled mouse move - schedules update in next rAF
  const handleMouseMove = useCallback((e) => {
    if (!supportsHover) return;
    
    const cache = rectCache.current;
    // Calculate relative position using cached values
    pendingUpdate.current.x = (e.clientX - cache.centerX) / cache.width;
    pendingUpdate.current.y = (e.clientY - cache.centerY) / cache.height;
    
    // Schedule rAF if not already pending
    if (!rafId.current) {
      rafId.current = requestAnimationFrame(flushUpdate);
    }
  }, [flushUpdate]);

  const handleMouseEnter = useCallback(() => {
    if (!supportsHover) return;
    cacheRect(); // Cache rect once on enter
    setIsHovered(true);
  }, [cacheRect]);

  const handleMouseLeave = useCallback(() => {
    // Cancel any pending rAF
    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
      rafId.current = null;
    }
    x.set(0);
    y.set(0);
    setIsHovered(false);
  }, [x, y]);

  // Cleanup rAF on unmount
  useEffect(() => {
    return () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, []);

  // Bullet reveal animation with IntersectionObserver
  useEffect(() => {
    if (!hasBullets) return;

    let timeout;
    let index = 0;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const reveal = () => {
            setVisibleCount(v => Math.min(v + 1, bullets.length));
            index++;
            if (index < bullets.length) {
              timeout = setTimeout(reveal, 140);
            }
          };
          reveal();
          observer.disconnect(); // Only trigger once
        }
      },
      { threshold: 0.3, rootMargin: '50px' }
    );

    if (ref.current) observer.observe(ref.current);

    return () => {
      observer.disconnect();
      clearTimeout(timeout);
    };
  }, [bullets, hasBullets]);

  // Memoized transition configs - prevent object recreation
  const hoverTransition = useMemo(() => ({ 
    duration: 0.3, 
    ease: [0.34, 1.56, 0.64, 1] 
  }), []);
  
  const tapTransition = useMemo(() => ({ duration: 0.1 }), []);
  const glowTransition = useMemo(() => ({ duration: 0.3 }), []);

  return (
    <motion.div
      ref={ref}
      className="card enhanced-card"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: supportsHover ? rotateX : 0,
        rotateY: supportsHover ? rotateY : 0,
        transformStyle: supportsHover ? "preserve-3d" : "flat",
      }}
      whileHover={{
        scale: 1.02,
        transition: hoverTransition,
      }}
      whileTap={{
        scale: 0.98,
        transition: tapTransition,
      }}
    >
      {/* Glow effect on hover - only render when hovered for perf */}
      {supportsHover && (
        <motion.div
          className="card-glow"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={glowTransition}
        />
      )}

      {image && (
        <motion.div
          className="card-image-container"
          style={{ transform: supportsHover ? "translateZ(20px)" : "none" }}
        >
          <LazyImage src={image} alt={title} className="card-image" />
        </motion.div>
      )}
      
      <motion.h3
        className="card-title"
        style={{ transform: supportsHover ? "translateZ(30px)" : "none" }}
      >
        <a href={link} target="_blank" rel="noreferrer">{title}</a>
      </motion.h3>

      {date && (
        <motion.p
          className="card-date"
          style={{ transform: supportsHover ? "translateZ(25px)" : "none" }}
        >
          {date}
        </motion.p>
      )}

      {hasBullets ? (
        <motion.ul
          className="card-bullets"
          style={{ transform: supportsHover ? "translateZ(20px)" : "none" }}
        >
          {bullets.slice(0, visibleCount).map((b, i) => (
            <motion.li
              key={i}
              className="bullet"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4, ease: "easeOut" }}
            >
              {b}
            </motion.li>
          ))}
        </motion.ul>
      ) : (
        <motion.div
          className="card-description"
          style={{ transform: supportsHover ? "translateZ(20px)" : "none" }}
        >
          {description}
        </motion.div>
      )}
    </motion.div>
  );
}
