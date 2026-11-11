import { useEffect, useRef, useState, useCallback } from "react";
import LazyImage from "./LazyImage";
import "./StyleSheet.css";

// Check if device supports hover (desktop)
const supportsHover = typeof window !== 'undefined' && 
  window.matchMedia('(hover: hover)').matches;

// Link label from where it points, instead of a generic "Repo/Site".
const defaultLinkLabel = (url) => (/github\.com/.test(url) ? "GitHub ↗" : "Website ↗");

export default function EnhancedCard({ title, subtitle, tags = [], bullets = [], description, date, link, linkLabel, live, writeup, extraLinks = [], linkTitle = true, image, badges = [] }) {
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
          {/* Decorative: the title right below names it, so screen readers and crawlers don't read it twice */}
          <LazyImage src={image} alt="" className="card-image" />
        </div>
      )}

      {badges.length > 0 && (
        <div className="card-badges" style={{ transform: supportsHover ? "translateZ(28px)" : "none" }}>
          {badges.map((b) => (
            <span key={b.label} className={`card-badge${b.kind ? ` card-badge-${b.kind}` : ""}`}>
              {b.icon}
              {b.label}
            </span>
          ))}
        </div>
      )}

      <h3
        className="card-title"
        style={{ transform: supportsHover ? "translateZ(30px)" : "none" }}
      >
        {link && linkTitle ? <a href={link} target="_blank" rel="noreferrer">{title}</a> : title}
      </h3>

      {subtitle && (
        <p className="card-subtitle" style={{ transform: supportsHover ? "translateZ(28px)" : "none" }}>
          {subtitle}
        </p>
      )}

      {date && (
        <p
          className="card-date"
          style={{ transform: supportsHover ? "translateZ(25px)" : "none" }}
        >
          {date}
        </p>
      )}

      {tags.length > 0 && (
        <ul className="card-tags" aria-label="Tech stack" style={{ transform: supportsHover ? "translateZ(22px)" : "none" }}>
          {tags.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      )}

      {hasBullets ? (
        <ul
          className="card-bullets"
          style={{ transform: supportsHover ? "translateZ(20px)" : "none" }}
        >
          {/* Every bullet is always in the page (for crawlers and screen
              readers); the scroll-in reveal only animates their visibility. */}
          {bullets.map((b, i) => (
            <li
              key={i}
              className={`bullet${i < visibleCount ? " is-visible" : ""}`}
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

      {(link || live || writeup || extraLinks.length > 0) && (
        <div
          className="card-cta"
          style={{ transform: supportsHover ? "translateZ(20px)" : "none" }}
        >
          {extraLinks.map(({ label, href, onClick }) => (
            <a key={label} href={href} onClick={onClick}>{label}</a>
          ))}
          {live && <a href={live} target="_blank" rel="noreferrer">Live ↗</a>}
          {link && <a href={link} target="_blank" rel="noreferrer">{linkLabel || defaultLinkLabel(link)}</a>}
          {writeup && <a href={writeup} target="_blank" rel="noreferrer">Write-up</a>}
        </div>
      )}
    </div>
  );
}
