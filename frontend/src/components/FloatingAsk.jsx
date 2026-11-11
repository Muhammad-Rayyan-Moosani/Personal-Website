import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

// Bottom-right shortcut back to the assistant.
// - Rendered into <body> through a portal: the hero has a transform, which
//   would otherwise pin this "fixed" button to the hero instead of the screen.
// - Shown only once the visitor has scrolled past the hero's assistant, and
//   hidden again at the Contact section (it would cover the message bubble).
export default function FloatingAsk() {
  const [pastAssistant, setPastAssistant] = useState(false);
  const [atContact, setAtContact] = useState(false);

  useEffect(() => {
    const assistant = document.querySelector(".hero-assistant");
    const contact = document.querySelector("#contacts");
    const observers = [];
    if (assistant) {
      const io = new IntersectionObserver(([e]) => {
        // Out of view *because we scrolled below it* (its top is above the screen).
        setPastAssistant(!e.isIntersecting && e.boundingClientRect.top < 0);
      });
      io.observe(assistant);
      observers.push(io);
    }
    if (contact) {
      const io = new IntersectionObserver(([e]) => setAtContact(e.isIntersecting), {
        rootMargin: "0px 0px -25% 0px", // hide once Contact is properly on screen
      });
      io.observe(contact);
      observers.push(io);
    }
    return () => observers.forEach((io) => io.disconnect());
  }, []);

  const visible = pastAssistant && !atContact;

  const goToAssistant = () => {
    const box = document.querySelector(".hero-assistant");
    const input = document.querySelector(".prompt-input");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    box?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
    // Focus once the scroll has settled so the page doesn't jump.
    setTimeout(() => input?.focus({ preventScroll: true }), reduced ? 0 : 450);
  };

  return createPortal(
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
    </button>,
    document.body,
  );
}
