import { useEffect, useState } from "react";

// Bottom-right shortcut back to the assistant. Shown only while the hero's
// assistant is scrolled out of view; a click scrolls to it and focuses the input.
export default function FloatingAsk() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const target = document.querySelector(".hero-assistant");
    if (!target) return;
    const io = new IntersectionObserver(([e]) => setVisible(!e.isIntersecting), { threshold: 0 });
    io.observe(target);
    return () => io.disconnect();
  }, []);

  const goToAssistant = () => {
    const box = document.querySelector(".hero-assistant");
    const input = document.querySelector(".prompt-input");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    box?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
    // Focus once the scroll has settled so the page doesn't jump.
    setTimeout(() => input?.focus({ preventScroll: true }), reduced ? 0 : 450);
  };

  return (
    <button
      type="button"
      className={`floating-ask${visible ? " is-visible" : ""}`}
      onClick={goToAssistant}
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
      </svg>
      Ask AI about me
    </button>
  );
}
