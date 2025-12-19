import React, { useState, useEffect } from "react";
import "./StyleSheet.css";

export default function Hero() {
  const words = ["a Software Developer", "a Problem Solver", "a Learner"];
  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (charIndex < words[index].length) {
        setText((prev) => prev + words[index][charIndex]);
        setCharIndex(charIndex + 1);
      } else {
        setTimeout(() => {
          setText("");
          setCharIndex(0);
          setIndex((prev) => (prev + 1) % words.length);
        }, 1500);
      }
    }, 100);

    return () => clearTimeout(timeout);
  }, [charIndex, index, words]);

  return (
    <section className="hero">
      {/* Static title (no typing) */}
      <h1 className="hero-title">
        Hey, I am Rayyan Moosani
      </h1>

      <h2>Computer Science Undergrad @ University of Waterloo</h2>

      {/* Static "I am" + dynamic typing */}
      <p className="hero-subtitle">
        I am <span className="typing">{text}</span>
        <span className="cursor">|</span>
      </p>
    </section>
  );
}