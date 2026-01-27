import { useEffect, useRef } from "react";
import { useTheme } from "../contexts/ThemeContext";

export default function Background() {
  const canvasRef = useRef(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    let particles = [];
    let animationFrameId;
    const particleCount = 130;
    
    // Theme-based colors
    const isDark = theme === 'dark';
    const bgColor = isDark ? 'rgba(0, 0, 0, 0.25)' : 'rgba(255, 255, 255, 0.05)';
    const gridColor = isDark ? 'rgba(0, 255, 255, 0.1)' : 'rgba(0, 234, 255, 0.15)';
    const particleColor = isDark ? '#00eaff' : '#00a8cc';
    const particleShadow = isDark ? '#00eaff' : '#00a8cc';

    // Function to get actual viewport dimensions
    const getViewportSize = () => {
      return {
        width: Math.max(window.innerWidth, document.documentElement.clientWidth, window.screen.width),
        height: Math.max(window.innerHeight, document.documentElement.clientHeight, window.screen.height)
      };
    };

    class Particle {
      constructor(width, height) {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.speedX = (Math.random() - 0.5) * 0.7;
        this.speedY = (Math.random() - 0.5) * 0.7;
        this.size = Math.random() * 2 + 1;
      }
      update(width, height) {
        this.x += this.speedX;
        this.y += this.speedY;

        // bounce from edges
        if (this.x <= 0 || this.x >= width) this.speedX *= -1;
        if (this.y <= 0 || this.y >= height) this.speedY *= -1;
        
        // Keep particles within bounds
        this.x = Math.max(0, Math.min(width, this.x));
        this.y = Math.max(0, Math.min(height, this.y));
      }
      draw(particleColor, particleShadow) {
        ctx.fillStyle = particleColor;
        ctx.shadowBlur = 15;
        ctx.shadowColor = particleShadow;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Function to set canvas size
    const setCanvasSize = () => {
      const { width, height } = getViewportSize();
      // Set actual canvas size
      canvas.width = width;
      canvas.height = height;
      // Set CSS size to match
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      
      // Reinitialize particles with new dimensions
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle(width, height));
      }
    };

    function animate() {
      const { width, height } = getViewportSize();
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const isDarkNow = currentTheme === 'dark';
      const currentBgColor = isDarkNow ? 'rgba(0, 0, 0, 0.25)' : 'rgba(255, 255, 255, 0.05)';
      const currentGridColor = isDarkNow ? 'rgba(0, 255, 255, 0.1)' : 'rgba(0, 234, 255, 0.15)';
      const currentParticleColor = isDarkNow ? '#00eaff' : '#00a8cc';
      const currentParticleShadow = isDarkNow ? '#00eaff' : '#00a8cc';
      
      // Clear with fade effect
      ctx.fillStyle = currentBgColor;
      ctx.fillRect(0, 0, width, height);

      // GRID effect
      ctx.strokeStyle = currentGridColor;
      ctx.lineWidth = 1;
      const gridSize = 60;

      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // particles
      particles.forEach((p) => {
        p.update(width, height);
        p.draw(currentParticleColor, currentParticleShadow);
      });

      animationFrameId = requestAnimationFrame(animate);
    }

    // Initialize
    setCanvasSize();
    animate();

    // Resize handler with debounce
    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        setCanvasSize();
      }, 100);
    };
    
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
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
        minWidth: "100vw",
        minHeight: "100vh",
      }}
    />
  );
}