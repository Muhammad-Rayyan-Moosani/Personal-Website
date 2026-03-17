import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import "./StyleSheet.css";
import EnhancedCard from "./EnhancedCard.jsx";
import gamesRandomImage from "./Games.Random.jpeg";
import barakahLinkImage from "./Barakah-link.jpeg";
import directAidImage from "./SCR-20260317-czet.png";

export default function Projects() {
  const gridRef = useRef(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: "0px 0px -20px 0px" }
    );

    if (gridRef.current) {
      const cards = gridRef.current.querySelectorAll(".card");
      cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.05}s`;
        observer.observe(card);
      });
    }

    return () => observer.disconnect();
  }, []);

  const projects = [
    {
      title: "Games.Random",
      image: gamesRandomImage,
      description: (
          <ul className="project-bullets">
            <li>
              <span className="tech-stack">
                Tech-Stack: React, Node.js, MongoDB, Phaser 3, p5.js
              </span>
            </li>
            <li>
              Built an AI-powered game platform enabling users to design, play,
              and modify custom games in real time
            </li>
            <li>
              Implemented live code highlighting for Phaser 3 and p5.js,
              turning gameplay into an interactive programming experience
            </li>
            <li>
              Integrated Google authentication, MongoDB, and an in-platform AI chatbot
              for scalable user management and real-time guidance
            </li>
          </ul>
),
      link: "https://github.com/Shayan-Mazahir/games.random"
    },
    {
      title: "VoiceAI Web Agent",
      description: (
        <ul className="project-bullets">
          <li>
            <span className="tech-stack">
              Tech-Stack: Python, Flask, JavaScript, Chrome Extension (Manifest V3), SmallestAI (STT/TTS), LLM Integration
            </span>
          </li>
          <li>
            Engineered a Manifest V3 Chrome extension featuring a custom STT/TTS pipeline for real-time, voice-directed browser automation
          </li>
          <li>
            Developed a neural intent-mapping system that parses speech and DOM context into precise, executable browser actions via LLMs
          </li>
          <li>
            Architected a Flask microservice to process multi-modal inputs, utilizing structured JSON output for complex, automated UI navigation
          </li>
          <li>
            Reduced end-to-end pipeline latency by 40% through asynchronous audio streaming, C-Extension API optimizations, and efficient DOM parsing
          </li>
        </ul>
      ),
      link: "https://github.com/Muhammad-Rayyan-Moosani/VoiceAI-Web-Agent"
    },
    {
      title: "AI-TRACKER",
 description: (
  <ul className="project-bullets">
    <li>
      <span className="tech-stack">
        Tech-Stack: Python (Flask API), Supabase, Chrome Extensions (MV3), React.js
      </span>
    </li>
    <li>
      Built a Chrome extension that uses an AI backend to generate custom,
      dynamic trackers from simple natural-language prompts
    </li>
    <li>
      Developed content scripts to extract live webpage data and a clean,
      React-based popup UI for effortless tracker management
    </li>
    <li>
      Enabled seamless communication via REST APIs using Flask and securely
      stored user data in Supabase for a production-ready experience
    </li>
  </ul>
),
      link: "https://github.com/Muhammad-Rayyan-Moosani/AI-tracker"
    },
    {
      title: "Anr Awaaz",
      description: (
        <ul className="project-bullets">
          <li>
            <span className="tech-stack">
              Tech-Stack: Python, FastAPI, Whisper (OpenAI), Claude (Anthropic), ElevenLabs, PHOIBLE, Pandas, JavaScript
            </span>
          </li>
          <li>
            Engineered a phoneme-level diagnostic engine using PHOIBLE and CMU Dict to identify language-specific articulation gaps for real-time phonetic feedback
          </li>
          <li>
            Developed an adaptive AI tutor using Claude and ElevenLabs that generates personalized, voice-guided curriculum based on individual learner sound-deficits
          </li>
          <li>
            Architected a high-concurrency FastAPI backend with asynchronous STT/TTS pipelines, reducing end-to-end processing latency for natural, fluid dialogue
          </li>
          <li>
            Implemented a neural role-play engine featuring cross-session memory and custom accent-aware Whisper prompting to sustain complex, multi-turn simulations
          </li>
        </ul>
      ),
      link: "https://github.com/Muhammad-Rayyan-Moosani/Anr-Awaaz"
    },
    {
      title: "DirectAid",
      image: directAidImage,
      description: (
        <ul className="project-bullets">
          <li>
            <span className="tech-stack">
              Tech-Stack: Next.js, TypeScript, Supabase, TailwindCSS, Recharts, Zod
            </span>
          </li>
          <li>
            Architected a multi-rail disbursement engine in TypeScript to automate high-integrity fund transfers across mobile wallets, bank APIs, and USSD claim codes
          </li>
          <li>
            Engineered a secure, role-based infrastructure using Supabase Auth and Zod-validated schemas to manage donor, recipient, and verifier permissions
          </li>
          <li>
            Developed an inclusive, low-literacy-friendly UI with Next.js and TailwindCSS, prioritizing accessibility and transparency for unbanked user populations
          </li>
          <li>
            Built an integrated analytics dashboard using Recharts to provide real-time transparency into fund distribution, risk rules, and regional payout success rates
          </li>
        </ul>
      ),
      link: "https://github.com/Muhammad-Rayyan-Moosani/DirectAid"
    },
    {
      title: "Barakah-Link",
      image: barakahLinkImage,
      description: (
  <ul className="project-bullets">
    <li>
      <span className="tech-stack">
        Tech-Stack: Twilio, React, Flask
      </span>
    </li>
    <li>
      Fighting hunger systemically — Turns food surplus into life-saving resources for those in need.
    </li>
    <li>
      Inclusive access — SMS-based backend ensures everyone can find food, even without smartphones.
    </li>
    <li>
      Empathetic tech — React.js frontend makes donating easy while preserving recipients' dignity.
    </li>
    <li>
      Scalable local impact — Built for Kitchener–Waterloo with potential to expand to other essentials.
    </li>
  </ul>
),
      link: "https://github.com/Muhammad-Rayyan-Moosani/Youtube-Playlist-Video-Downloader-"
    }
  ];

  return (
    <motion.section
      className="projects"
      id="projects"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.3 }}
    >
      <motion.h1
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        Projects
      </motion.h1>
      
      {/* Container for cards */}
      <div className="projects-grid" ref={gridRef}>
        {projects.map((project, index) => (
          <EnhancedCard
            key={index}
            title={project.title}
            description={project.description}
            date={project.date}
            link={project.link}
            image={project.image}
          />
        ))}
      </div>
    </motion.section>
  );
}