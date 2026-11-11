import { useEffect, useRef, memo } from "react";

const GRID_SIZE = 60;

const isNarrow = () =>
  typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches;

// Static backdrop: a solid fill and a faint grid. No particles and no animation
// loop, so nothing ever floats over the content and the page stays idle.
function Background() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });

    const draw = () => {
      const isDark = document.documentElement.getAttribute("data-theme") === "dark";
      const width = Math.max(window.innerWidth, document.documentElement.clientWidth);
      const height = Math.max(window.innerHeight, document.documentElement.clientHeight);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      ctx.fillStyle = isDark ? "#000000" : "#ffffff";
      ctx.fillRect(0, 0, width, height);

      // Fainter on phones so the grid stays a backdrop behind the hero.
      ctx.strokeStyle = isNarrow()
        ? (isDark ? "rgba(0, 234, 255, 0.045)" : "rgba(8, 145, 178, 0.07)")
        : (isDark ? "rgba(0, 234, 255, 0.1)" : "rgba(8, 145, 178, 0.15)");
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x <= width; x += GRID_SIZE) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = 0; y <= height; y += GRID_SIZE) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();
    };

    draw();

    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(draw, 100);
    };
    const observer = new MutationObserver(draw);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    window.addEventListener("resize", handleResize, { passive: true });
    window.addEventListener("orientationchange", handleResize, { passive: true });

    return () => {
      clearTimeout(resizeTimeout);
      observer.disconnect();
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
        pointerEvents: "none", // never intercept cursor/pointer events
        contain: "strict",
      }}
    />
  );
}

export default memo(Background);
