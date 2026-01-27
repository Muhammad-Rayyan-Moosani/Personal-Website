import React from "react";
import "./StyleSheet.css";
import logo from "./View recent photos.png";
import { useTheme } from "../contexts/ThemeContext";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="navbar">
      {/* Logo / Image */}
      <div className="navbar-logo">
        <img src={logo} alt="Logo" />
      </div>

      {/* Navigation links */}
      <ul className="navbar-links">
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
        <li>
          <button 
            className="theme-toggle" 
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
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
          </button>
        </li>
      </ul>
    </nav>
  );
}