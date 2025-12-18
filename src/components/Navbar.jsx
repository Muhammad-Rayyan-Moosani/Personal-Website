import React from "react";
import "./StyleSheet.css";
import logo from "./IMG_3529.JPG"

export default function Navbar() {
  return (
    <nav className="navbar">
      {/* Logo / Image */}
      <div className="navbar-logo">
        <img src={logo} alt="Logo" />
      </div>

      {/* Navigation links */}
      <ul className="navbar-links">
        <li><a href="#home">Home</a></li>
        <li><a href="#about">About Me</a></li>
        
        <li><a href="#experience">Experience</a></li>
        <li><a href="#projects">Projects</a></li>
        <li><a href="#contacts">Contact</a></li>
      </ul>
    </nav>
  );
}