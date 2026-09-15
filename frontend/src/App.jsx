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
    // Play the full intro animation (the progress bar fills over ~1.5s), and
    // also wait for fonts so the text never flashes a fallback face — whichever
    // finishes last, hard-capped so it can never hang.
    const minShow = new Promise((r) => setTimeout(r, 1800));
    const fontsReady = (document.fonts && document.fonts.ready) || Promise.resolve();
    Promise.all([minShow, fontsReady]).then(finish);
    const hardCap = setTimeout(finish, 4000);
    return () => clearTimeout(hardCap);
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
