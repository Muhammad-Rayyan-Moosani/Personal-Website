import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import LazyImage from "./LazyImage";
import "./StyleSheet.css";

export default function EnhancedCard({ title, bullets = [], description, date, link, image }) {
  const ref = useRef(null);
  const [visibleCount, setVisibleCount] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const hasBullets = bullets && bullets.length > 0;

  // Mouse position for 3D tilt effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), {
    stiffness: 300,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), {
    stiffness: 300,
    damping: 30,
  });

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) / rect.width);
    y.set((e.clientY - centerY) / rect.height);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

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
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);

    return () => {
      observer.disconnect();
      clearTimeout(timeout);
    };
  }, [bullets, hasBullets]);

  return (
    <motion.div
      ref={ref}
      className="card enhanced-card"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      whileHover={{
        scale: 1.02,
        transition: { duration: 0.3, ease: [0.34, 1.56, 0.64, 1] },
      }}
      whileTap={{
        scale: 0.98,
        transition: { duration: 0.1 },
      }}
    >
      {/* Glow effect on hover */}
      <motion.div
        className="card-glow"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      {image && (
        <motion.div
          className="card-image-container"
          style={{ transform: "translateZ(20px)" }}
        >
          <LazyImage src={image} alt={title} className="card-image" />
        </motion.div>
      )}
      
      <motion.h3
        className="card-title"
        style={{ transform: "translateZ(30px)" }}
      >
        <a href={link} target="_blank" rel="noreferrer">{title}</a>
      </motion.h3>

      {date && (
        <motion.p
          className="card-date"
          style={{ transform: "translateZ(25px)" }}
        >
          {date}
        </motion.p>
      )}

      {hasBullets ? (
        <motion.ul
          className="card-bullets"
          style={{ transform: "translateZ(20px)" }}
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
          style={{ transform: "translateZ(20px)" }}
        >
          {description}
        </motion.div>
      )}
    </motion.div>
  );
}
