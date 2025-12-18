import React, { useState, useEffect } from "react";

export default function Hero() {
  const words = [" I am a Software Developer", " I am a Problem Solver", " I am a Learner"];
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
          setIndex((index + 1) % words.length);
        }, 1500);
      }
    }, 100);

    return () => clearTimeout(timeout);
  }, [charIndex, index]);

  return (
    <section className="hero">
      <h1 className="hero-title">
        Hey, I am Rayyan Moosani
      </h1>
      <h2> Computer Science UnderGrad @ University Of Waterloo</h2>
      <p className="hero-subtitle">{text}|</p>
    </section>
  );
}