import React from "react";
import { motion } from "framer-motion";
import "./StyleSheet.css";
import logo from "./View recent photos.png";
import { useTheme } from "../contexts/ThemeContext";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();

  const navVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.34, 1.56, 0.64, 1],
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.nav
      className="navbar"
      variants={navVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Logo / Image */}
      <motion.div className="navbar-logo" variants={itemVariants}>
        <img src={logo} alt="Logo" />
      </motion.div>

      {/* Navigation links */}
      <motion.ul className="navbar-links" variants={itemVariants}>
        <li>
  <a
    href="#home"
    onClick={(e) => {
      e.preventDefault();
      document.getElementById("home")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }}
  >
    Home
  </a>
</li>

  <li>
  <a
    href="#about"
    onClick={(e) => {
      e.preventDefault();
      document.getElementById("about")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }}
  >
    About Me
  </a>
</li>



<li>
  <a
    href="#experience"
    onClick={(e) => {
      e.preventDefault();
      document.getElementById("experience")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }}
  >
    Experience
  </a>
</li>

<li>
  <a
    href="#projects"
    onClick={(e) => {
      e.preventDefault();
      document.getElementById("projects")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }}
  >
    Projects
  </a>
</li>

<li>
  <a
    href="#contacts"
    onClick={(e) => {
      e.preventDefault();
      document.getElementById("contacts")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }}
  >
    Contact
  </a>
</li>
        <motion.li whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <motion.button 
            className="theme-toggle" 
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.3 }}
          >
            {theme === 'light' ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
            )}
          </motion.button>
        </motion.li>
      </motion.ul>
    </motion.nav>
  );
}