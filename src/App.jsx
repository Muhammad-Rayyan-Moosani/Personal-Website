import { useState, useEffect, memo } from "react";
import { AnimatePresence } from "framer-motion";
import Background from "./components/Background";
import Hero from "./components/Hero";
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
    // Faster preloader - actual content loads while preloader shows
    const timer = setTimeout(() => {
      setLoading(false);
      // Small delay before showing content for smooth transition
      requestAnimationFrame(() => {
        setShowContent(true);
      });
    }, 1800);

    return () => clearTimeout(timer);
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
        <MemoizedAbout />
        <Experience />
        <Projects />
        <MemoizedContacts />
      </div>
    </>
  );
}

export default App;
