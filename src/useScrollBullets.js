import { useEffect } from "react";

export default function useScrollBullets() {
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let scrollSpeed = 0;

    const handleScroll = () => {
      scrollSpeed = Math.abs(window.scrollY - lastScrollY);
      lastScrollY = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const bullets = entry.target.querySelectorAll("li");

          bullets.forEach((bullet, index) => {
            // Faster scroll → faster animation
            const baseDelay = scrollSpeed > 30 ? 50 : 120;

            bullet.style.transitionDuration =
              scrollSpeed > 30 ? "0.2s" : "0.4s";

            bullet.style.transitionDelay = `${index * baseDelay}ms`;

            bullet.classList.add("show");
          });

          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.3 }
    );

    document.querySelectorAll(".animated-bullets").forEach((list) => {
      observer.observe(list);
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
}