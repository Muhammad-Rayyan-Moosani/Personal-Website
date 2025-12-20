import React from "react";
import "./StyleSheet.css";
import logo from "./View recent photos.png"

export default function Navbar() {
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
      </ul>
    </nav>
  );
}