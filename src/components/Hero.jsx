import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./StyleSheet.css";
import waterlooLogo from "./waterloo logo.jpeg";

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.34, 1.56, 0.64, 1],
      },
    },
  };

  return (
    <motion.section
      className="hero"
      id="home"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h1 className="hero-title" variants={itemVariants}>
        Hey, I am Rayyan Moosani
      </motion.h1>

      <motion.h2 className="hero-school" variants={itemVariants}>
        Computer Science Undergrad @ University of{" "}
        <span className="hero-waterloo-wrap">
          Waterloo
          <img
            src={waterlooLogo}
            alt="University of Waterloo"
            className="hero-waterloo-logo"
          />
        </span>
      </motion.h2>

      <motion.p className="hero-subtitle" variants={itemVariants}>
        I am <span className="typing">{text}</span>
        <span className="cursor">|</span>
      </motion.p>
    </motion.section>
  );
}