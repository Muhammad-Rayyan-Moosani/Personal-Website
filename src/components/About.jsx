import { motion } from "framer-motion";
import "./StyleSheet.css";

export default function About() {
  return (
    <motion.section
      className="about-section"
      id="about"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
    >
      <motion.h1
        className="about-heading"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
      >
        About Me
      </motion.h1>

      <motion.div
        className="about-box"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
        whileHover={{
          scale: 1.02,
          boxShadow: "0 15px 40px var(--shadow-color)",
          transition: { duration: 0.3 },
        }}
      >
        <p>
          I am a Computer Science undergraduate at University of Waterloo, passionate about AI, 
          cybersecurity, and software development. I enjoy building projects that solve real-world 
          problems and contribute positively to technology.
        </p>
      </motion.div>
    </motion.section>
  );
}