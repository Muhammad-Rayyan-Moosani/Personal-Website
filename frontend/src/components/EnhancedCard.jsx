import { useEffect, useRef, useState, useCallback, useMemo } from "react";
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

  // Throttled mouse move - schedules update in next rAF
  const handleMouseMove = useCallback((e) => {
    if (!supportsHover) return;

    const cache = rectCache.current;
    // Calculate relative position using cached values
    pendingUpdate.current.x = (e.clientX - cache.centerX) / cache.width;
    pendingUpdate.current.y = (e.clientY - cache.centerY) / cache.height;
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (!supportsHover) return;
    cacheRect(); // Cache rect once on enter
    setIsHovered(true);
  }, [cacheRect]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  // Cleanup rAF on unmount
  useEffect(() => {
    return () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, []);

  // Bullet reveal animation with IntersectionObserver - faster
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
              timeout = setTimeout(reveal, 60);
            }
          };
          reveal();
          observer.disconnect(); // Only trigger once
        }
      },
      { threshold: 0.15, rootMargin: '100px' }
    );

    if (ref.current) observer.observe(ref.current);

    return () => {
      observer.disconnect();
      clearTimeout(timeout);
    };
  }, [bullets, hasBullets]);

  return (
    <div
      ref={ref}
      className="card enhanced-card"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: supportsHover ? "preserve-3d" : "flat",
      }}
    >
      {/* Glow effect on hover - only render when hovered for perf */}
      {supportsHover && (
        <div
          className="card-glow"
          style={{ opacity: isHovered ? 1 : 0 }}
        />
      )}

      {image && (
        <div
          className="card-image-container"
          style={{ transform: supportsHover ? "translateZ(20px)" : "none" }}
        >
          <LazyImage src={image} alt={title} className="card-image" />
        </div>
      )}

      <h3
        className="card-title"
        style={{ transform: supportsHover ? "translateZ(30px)" : "none" }}
      >
        <a href={link} target="_blank" rel="noreferrer">{title}</a>
      </h3>

      {date && (
        <p
          className="card-date"
          style={{ transform: supportsHover ? "translateZ(25px)" : "none" }}
        >
          {date}
        </p>
      )}

      {hasBullets ? (
        <ul
          className="card-bullets"
          style={{ transform: supportsHover ? "translateZ(20px)" : "none" }}
        >
          {bullets.slice(0, visibleCount).map((b, i) => (
            <li
              key={i}
              className="bullet"
            >
              {b}
            </li>
          ))}
        </ul>
      ) : (
        <div
          className="card-description"
          style={{ transform: supportsHover ? "translateZ(20px)" : "none" }}
        >
          {description}
        </div>
      )}
    </div>
  );
}
