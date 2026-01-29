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
        <p className="about-intro">
          A computer science student who enjoys building systems that actually
          get used — from automation tools and analytics platforms to full-stack
          and backend applications. Driven by impact, clarity, and solving real
          operational problems with code.
        </p>

        <h2 className="about-subhead about-subhead-exp">Experience Highlights</h2>
        <ul className="about-highlights">
          <li>
            <span className="about-item-title">
              Industrial Digital Systems Internship (SCITRA)
            </span>
            Built a full 3D digital twin of an operational factory using Unity
            and C#, modeling real machinery and workflows to support
            visualization, simulation, and future system integration.
          </li>
          <li>
            <span className="about-item-title">
              Factory Operations Automation Project
            </span>
            Designed and implemented a fault-reporting and tracking system using
            Python, Telegram Bot API, and Google Sheets, streamlining machine
            issue reporting and reducing downtime.
          </li>
          <li>
            <span className="about-item-title">
              Student Organization Contract Developer
            </span>
            Currently developing financial analytics and reporting systems to
            improve transparency, budgeting, and data-driven decision-making for
            a large student organization.
          </li>
          <li>
            <span className="about-item-title">
              Cybersecurity Ambassador & IT Experience
            </span>
            Completed certified cybersecurity training and worked with IT teams
            to understand network security, system risks, and real-world
            infrastructure, promoting safer digital practices.
          </li>
          <li>
            <span className="about-item-title">
              Robotics & App Development Leadership
            </span>
            Led teams in robotics and mobile app design, translating ideas into
            functional products while coordinating technical and design
            decisions.
          </li>
        </ul>

        <h2 className="about-subhead about-subhead-athletics">
          Athletics & Extracurriculars
        </h2>
        <ul className="about-highlights">
          <li>
            <span className="about-item-title">Cricket (Professional Level)</span>
            Professional-level cricketer and team captain, known for leadership,
            discipline, and performing under pressure — strengths carried
            directly into engineering teams.
          </li>
          <li>
            <span className="about-item-title">Table Tennis</span>
            Highly competitive player with strong reflexes, focus, and
            consistency developed through years of match play.
          </li>
        </ul>
      </motion.div>
    </motion.section>
  );
}
