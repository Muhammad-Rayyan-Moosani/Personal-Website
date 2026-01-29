import { motion } from "framer-motion";
import "./StyleSheet.css";

export default function Contacts() {
  return (
    <motion.section
      className="contacts"
      id="contacts"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
    >
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
      >
        Contact
      </motion.h1>
      
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        Let's connect
      </motion.p>

      <motion.div
        className="contact-box"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
        whileHover={{
          scale: 1.05,
          boxShadow: "0 15px 40px var(--shadow-color)",
          transition: { duration: 0.3 },
        }}
      >
        {/* Top row: Links */}
        <div className="contact-links">
          <motion.a
            href="https://www.linkedin.com/in/rayyan-moosani-64b4971aa/"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            LinkedIn
          </motion.a>
          <motion.a
            href="https://github.com/Muhammad-Rayyan-Moosani"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            GitHub
          </motion.a>
          <motion.a
            href="mailto:mrayyanm411@gmail.com"
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            Gmail
          </motion.a>
        </div>

        {/* Bottom row: Webring logo with arrows */}
        <div className="webring-container">
          <motion.a
            href="https://cs.uwatering.com/#https://www.rayyanmoosani.com/?nav=prev"
            className="webring-arrow"
            whileHover={{ scale: 1.2, x: -3 }}
            whileTap={{ scale: 0.9 }}
          >
            ⤆
          </motion.a>
          <motion.a
            href="https://cs.uwatering.com/#https://www.rayyanmoosani.com/"
            target="_blank"
            whileHover={{ scale: 1.1, rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            <img
              src="https://cs.uwatering.com/icon.white.svg"
              alt="CS Webring"
              className="webring-icon"
            />
          </motion.a>
          <motion.a
            href="https://cs.uwatering.com/#https://www.rayyanmoosani.com/?nav=next"
            className="webring-arrow"
            whileHover={{ scale: 1.2, x: 3 }}
            whileTap={{ scale: 0.9 }}
          >
            ⤇
          </motion.a>
        </div>
      </motion.div>
    </motion.section>
  );
}
