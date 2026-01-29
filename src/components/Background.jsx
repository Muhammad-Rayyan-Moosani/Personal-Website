import { useEffect, useRef, memo } from "react";
import { useTheme } from "../contexts/ThemeContext";

// Detect low-end devices
const isLowEndDevice = () => {
  if (typeof navigator === 'undefined') return false;
  const memory = navigator.deviceMemory;
  const cores = navigator.hardwareConcurrency;
  return (memory && memory < 4) || (cores && cores < 4);
};

const isMobile = typeof window !== 'undefined' && 
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// Adaptive particle count
const getParticleCount = () => {
  if (isMobile) return 40;
  if (isLowEndDevice()) return 60;
  return 100; // Reduced from 130 for better perf
};

function Background() {
  const canvasRef = useRef(null);
  const { theme } = useTheme();
  const animationRef = useRef(null);
  const particlesRef = useRef([]);
  const dimensionsRef = useRef({ width: 0, height: 0 });
  const colorsRef = useRef({});
  const lastFrameTime = useRef(0);
  const gridPathRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d", { 
      alpha: false, // Opaque canvas = faster
      desynchronized: true // Reduce latency
    });
    
    const particleCount = getParticleCount();
    const GRID_SIZE = 60;
    const TARGET_FPS = isMobile ? 30 : 60;
    const FRAME_DURATION = 1000 / TARGET_FPS;

    // Pre-calculate colors based on theme
    // Blue mode = dark blue background, Dark mode = pure black background
    const updateColors = () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      colorsRef.current = {
        // Dark mode: pure black, Blue mode: dark navy blue
        bg: isDark ? '#000000' : '#0a0a1a',
        bgFade: isDark ? 'rgba(0, 0, 0, 0.25)' : 'rgba(10, 10, 26, 0.25)',
        grid: 'rgba(0, 234, 255, 0.1)',
        particle: '#00eaff',
        shadow: '#00eaff',
      };
    };

    // Particle class - optimized with object pooling
    class Particle {
      constructor() {
        this.reset();
      }
      
      reset() {
        const { width, height } = dimensionsRef.current;
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.speedX = (Math.random() - 0.5) * 0.7;
        this.speedY = (Math.random() - 0.5) * 0.7;
        this.size = Math.random() * 2 + 1;
      }
      
      update() {
        const { width, height } = dimensionsRef.current;
        this.x += this.speedX;
        this.y += this.speedY;

        // Bounce from edges - branchless optimization
        if (this.x <= 0 || this.x >= width) this.speedX = -this.speedX;
        if (this.y <= 0 || this.y >= height) this.speedY = -this.speedY;
        
        // Clamp to bounds
        this.x = Math.max(0, Math.min(width, this.x));
        this.y = Math.max(0, Math.min(height, this.y));
      }
    }

    // Pre-create grid path for reuse
    const createGridPath = (width, height) => {
      const path = new Path2D();
      for (let x = 0; x <= width; x += GRID_SIZE) {
        path.moveTo(x, 0);
        path.lineTo(x, height);
      }
      for (let y = 0; y <= height; y += GRID_SIZE) {
        path.moveTo(0, y);
        path.lineTo(width, y);
      }
      return path;
    };

    // Set canvas size and initialize particles
    const setCanvasSize = () => {
      const width = Math.max(window.innerWidth, document.documentElement.clientWidth);
      const height = Math.max(window.innerHeight, document.documentElement.clientHeight);
      
      // Only resize if dimensions changed
      if (width === dimensionsRef.current.width && height === dimensionsRef.current.height) {
        return;
      }
      
      dimensionsRef.current = { width, height };
      
      // Set canvas size with device pixel ratio for sharpness
      const dpr = Math.min(window.devicePixelRatio || 1, 2); // Cap at 2x for performance
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.scale(dpr, dpr);
      
      // Pre-create grid path
      gridPathRef.current = createGridPath(width, height);
      
      // Initialize or reset particles
      if (particlesRef.current.length === 0) {
        for (let i = 0; i < particleCount; i++) {
          particlesRef.current.push(new Particle());
        }
      } else {
        particlesRef.current.forEach(p => p.reset());
      }
    };

    // Optimized animation loop
    const animate = (timestamp) => {
      // Throttle to target FPS
      const elapsed = timestamp - lastFrameTime.current;
      if (elapsed < FRAME_DURATION) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      lastFrameTime.current = timestamp - (elapsed % FRAME_DURATION);

      const { width, height } = dimensionsRef.current;
      const colors = colorsRef.current;

      // Clear with fade effect - single fill operation
      ctx.fillStyle = colors.bgFade;
      ctx.fillRect(0, 0, width, height);

      // Draw grid using pre-created path - single stroke operation
      ctx.strokeStyle = colors.grid;
      ctx.lineWidth = 1;
      ctx.stroke(gridPathRef.current);

      // Batch particle drawing
      ctx.fillStyle = colors.particle;
      ctx.shadowBlur = 15;
      ctx.shadowColor = colors.shadow;
      
      // Begin single path for all particles
      ctx.beginPath();
      const particles = particlesRef.current;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.update();
        ctx.moveTo(p.x + p.size, p.y);
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      }
      ctx.fill();
      
      // Reset shadow for next frame
      ctx.shadowBlur = 0;

      animationRef.current = requestAnimationFrame(animate);
    };

    // Initialize
    updateColors();
    setCanvasSize();
    animationRef.current = requestAnimationFrame(animate);

    // Debounced resize handler
    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(setCanvasSize, 100);
    };

    // Theme change observer
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.attributeName === 'data-theme') {
          updateColors();
          break;
        }
      }
    });
    
    observer.observe(document.documentElement, { 
      attributes: true, 
      attributeFilter: ['data-theme'] 
    });

    window.addEventListener("resize", handleResize, { passive: true });
    window.addEventListener("orientationchange", handleResize, { passive: true });

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      clearTimeout(resizeTimeout);
      observer.disconnect();
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
        pointerEvents: "none", // CRITICAL: Never intercept cursor/pointer events
        contain: "strict", // CSS containment for isolation
      }}
    />
  );
}

// Memo to prevent unnecessary re-renders
export default memo(Background);
