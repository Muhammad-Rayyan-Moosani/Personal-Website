import React, { useState, useEffect } from "react";
import "./StyleSheet.css";
import waterlooLogo from "./waterloo logo.jpeg";
import PromptBox from "./PromptBox";

export default function Hero() {
  const words = ["a Software Engineer", "a Problem Solver", "a Fast Learner"];
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
    <section className="hero" id="home">
      <h1 className="hero-title">
        Hey, I am Rayyan Moosani
      </h1>

      <h2 className="hero-school">
        Computer Science Undergrad @ University of{" "}
        <span className="hero-waterloo-wrap">
          Waterloo
          <img
            src={waterlooLogo}
            alt="University of Waterloo"
            className="hero-waterloo-logo"
          />
        </span>
      </h2>

      <p className="hero-subtitle">
        I am <span className="typing">{text}</span>
        <span className="cursor">|</span>
      </p>

      <div>
        <PromptBox />
      </div>
    </section>
  );
}