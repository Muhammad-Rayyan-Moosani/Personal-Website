import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import Background from "./components/Background";
import Hero from "./components/Hero";
import About from "./components/About"
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import Navbar from "./components/Navbar";
import Contacts from "./components/Contacts";
import CustomCursor from "./components/CustomCursor";
import Preloader from "./components/Preloader";
import "./index.css";
import useScrollBullets from "./useScrollBullets";

function App() {
  const [loading, setLoading] = useState(true);

  useScrollBullets();

  useEffect(() => {
    // Simulate content loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {loading && <Preloader key="preloader" />}
      </AnimatePresence>

      {!loading && (
        <>
          <CustomCursor />
          <Background />
          <Navbar />
          <Hero />
          <About />
          <Experience />
          <Projects />
          <Contacts />
        </>
      )}
    </>
  );
}

export default App;