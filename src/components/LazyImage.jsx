import { useState, useEffect, useRef, memo } from 'react';

// Use CSS transitions instead of Framer Motion for better performance
function LazyImage({ src, alt, className }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef(null);
  const observerRef = useRef(null);

  useEffect(() => {
    // Use native lazy loading as primary, IntersectionObserver as fallback
    if ('loading' in HTMLImageElement.prototype) {
      setIsInView(true);
      return;
    }

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observerRef.current?.disconnect();
        }
      },
      {
        rootMargin: '100px', // Increased for earlier loading
        threshold: 0.01,
      }
    );

    if (imgRef.current) {
      observerRef.current.observe(imgRef.current);
    }

    return () => observerRef.current?.disconnect();
  }, []);

  const handleLoad = () => {
    // Use rAF to batch the state update
    requestAnimationFrame(() => {
      setIsLoaded(true);
    });
  };

  return (
    <div 
      ref={imgRef} 
      className={className}
      style={{
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {isInView && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={handleLoad}
          style={{
            width: '100%',
            height: 'auto',
            display: 'block',
            opacity: isLoaded ? 1 : 0,
            transform: isLoaded ? 'scale(1)' : 'scale(1.05)',
            transition: 'opacity 0.4s ease-out, transform 0.4s ease-out',
            willChange: isLoaded ? 'auto' : 'opacity, transform',
          }}
        />
      )}
      {/* Skeleton placeholder */}
      {!isLoaded && (
        <div
          style={{
            position: isInView ? 'absolute' : 'relative',
            top: 0,
            left: 0,
            width: '100%',
            height: isInView ? '100%' : '200px',
            minHeight: '150px',
            background: 'var(--bg-card)',
            borderRadius: '12px',
            animation: 'pulse 1.5s ease-in-out infinite',
          }}
        />
      )}
    </div>
  );
}

// Memoize to prevent unnecessary re-renders
export default memo(LazyImage);
