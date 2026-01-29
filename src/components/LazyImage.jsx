import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export default function LazyImage({ src, alt, className }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px',
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={imgRef} className={className}>
      {isInView && (
        <motion.img
          src={src}
          alt={alt}
          onLoad={() => setIsLoaded(true)}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: isLoaded ? 1 : 0, scale: isLoaded ? 1 : 1.1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{ width: '100%', height: 'auto', display: 'block' }}
        />
      )}
      {!isLoaded && isInView && (
        <div
          style={{
            width: '100%',
            height: '200px',
            background: 'var(--bg-card)',
            borderRadius: '12px',
            animation: 'pulse 1.5s ease-in-out infinite',
          }}
        />
      )}
    </div>
  );
}
