// Performance utilities

export const prefersReducedMotion = () => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

export const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  ) || window.matchMedia('(pointer: coarse)').matches;
};

export const isLowEndDevice = () => {
  // Check for low-end device indicators
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  const slowConnection = connection && (connection.saveData || connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g');
  const lowMemory = navigator.deviceMemory && navigator.deviceMemory < 4;
  const lowCores = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
  
  return slowConnection || lowMemory || lowCores;
};

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

export const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};
