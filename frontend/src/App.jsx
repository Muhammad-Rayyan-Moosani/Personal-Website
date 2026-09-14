import { useState, useEffect, memo } from "react";
import { AnimatePresence } from "framer-motion";
import Background from "./components/Background";
import Hero from "./components/Hero";
import ProofStrip from "./components/ProofStrip";
import About from "./components/About"
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import Navbar from "./components/Navbar";
import Contacts from "./components/Contacts";
import Preloader from "./components/Preloader";
import "./index.css";
import useScrollBullets from "./useScrollBullets";

// Memoize components that don't need frequent updates
const MemoizedBackground = memo(Background);
const MemoizedNavbar = memo(Navbar);
const MemoizedHero = memo(Hero);
const MemoizedAbout = memo(About);
const MemoizedContacts = memo(Contacts);

function App() {
  const [loading, setLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

  useScrollBullets();

  useEffect(() => {
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      setLoading(false);
      requestAnimationFrame(() => setShowContent(true));
    };
    // Reveal as soon as fonts are ready instead of a fixed artificial delay.
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(finish);
    }
    const fallback = setTimeout(finish, 1000); // safety cap
    return () => clearTimeout(fallback);
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {loading && <Preloader key="preloader" />}
      </AnimatePresence>

      {/* Render content early but hidden - allows pre-painting */}
      <div style={{ 
        opacity: showContent ? 1 : 0, 
        visibility: showContent ? 'visible' : 'hidden',
        transition: 'opacity 0.3s ease-out'
      }}>
        <MemoizedBackground />
        <MemoizedNavbar />
        <MemoizedHero />
        <ProofStrip />
        <Experience />
        <Projects />
        <MemoizedAbout />
        <MemoizedContacts />
      </div>
    </>
  );
}

export default App;
