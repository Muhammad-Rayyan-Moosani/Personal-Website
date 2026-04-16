// Performance utilities - optimized for minimal runtime cost

// Cache results to avoid repeated queries
let _prefersReducedMotion = null;
let _isMobile = null;
let _isLowEnd = null;

export const prefersReducedMotion = () => {
  if (_prefersReducedMotion !== null) return _prefersReducedMotion;
  _prefersReducedMotion = typeof window !== 'undefined' && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  return _prefersReducedMotion;
};

export const isMobileDevice = () => {
  if (_isMobile !== null) return _isMobile;
  if (typeof window === 'undefined') return false;
  
  _isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  ) || window.matchMedia('(pointer: coarse)').matches;
  return _isMobile;
};

export const isLowEndDevice = () => {
  if (_isLowEnd !== null) return _isLowEnd;
  if (typeof navigator === 'undefined') return false;
  
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  const slowConnection = connection && (
    connection.saveData || 
    connection.effectiveType === 'slow-2g' || 
    connection.effectiveType === '2g'
  );
  const lowMemory = navigator.deviceMemory && navigator.deviceMemory < 4;
  const lowCores = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
  
  _isLowEnd = slowConnection || lowMemory || lowCores;
  return _isLowEnd;
};

// Reset cache on visibility change (user might have changed settings)
if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      _prefersReducedMotion = null;
    }
  }, { passive: true });
}

// Optimized animation config getter
export const getAnimationConfig = () => {
  if (prefersReducedMotion()) {
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0 },
    };
  }

  if (isLowEndDevice() || isMobileDevice()) {
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.3, ease: 'easeOut' },
    };
  }

  return {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.34, 1.56, 0.64, 1] },
  };
};

// Debounce utility - prevents function from being called too frequently
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle utility - ensures function is called at most once per interval
export const throttle = (func, limit) => {
  let inThrottle;
  let lastResult;
  return function(...args) {
    if (!inThrottle) {
      lastResult = func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
    return lastResult;
  };
};

// RAF-based throttle for animations
export const rafThrottle = (callback) => {
  let requestId = null;
  let lastArgs = null;
  
  const later = () => {
    requestId = null;
    callback(...lastArgs);
  };
  
  return (...args) => {
    lastArgs = args;
    if (requestId === null) {
      requestId = requestAnimationFrame(later);
    }
  };
};

// Batch DOM reads to avoid layout thrashing
export const batchRead = (readFn) => {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      const result = readFn();
      resolve(result);
    });
  });
};

// Batch DOM writes 
export const batchWrite = (writeFn) => {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        writeFn();
        resolve();
      });
    });
  });
};
