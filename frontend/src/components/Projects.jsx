import { useEffect, useRef } from "react";
import "./StyleSheet.css";
import EnhancedCard from "./EnhancedCard.jsx";
import gamesRandomImage from "./Games.Random.jpeg";
import barakahLinkImage from "./Barakah-link.jpeg";
import directAidImage from "./SCR-20260317-czet.png";
import storyVerseImage from "./StoryVerse.png";

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
      title: "StoryVerse",
      image: storyVerseImage,
      description: (
        <ul className="project-bullets">
          <li>
            <span className="tech-stack">
              Tech-Stack: TypeScript, Node.js, Express, React, PostgreSQL (Drizzle ORM), Cloudflare R2, FFmpeg, Multi-Model AI (Claude, GPT-4o-mini, FLUX, Runway, Veo 3, ElevenLabs)
            </span>
          </li>
          <li>
            Built a full-stack, AI-native platform that turns a written manuscript into a finished 45-second cinematic book trailer — visuals, camera motion, time-aligned narration, and lip-sync — in minutes
          </li>
          <li>
            Architected a declarative step-runner orchestrating ~10 AI providers behind one uniform interface across 8 model-agnostic tiers spanning a ~600× cost range ($0.03–$18 per trailer)
          </li>
          <li>
            Engineered a resumable, human-in-the-loop pipeline with database-persisted state — users pause, preview, edit prompts, regenerate a single asset, or swap models mid-run without restarting or re-paying for completed work
          </li>
          <li>
            Raised AI character-consistency from ~22% to 100% of scenes by moving correctness out of unreliable LLM instructions into a deterministic prompt injector
          </li>
        </ul>
      ),
      link: "https://storyverse-production-2356.up.railway.app/"
    },
    {
      title: "File Guardian Agent",
      description: (
        <ul className="project-bullets">
          <li>
            <span className="tech-stack">
              Tech-Stack: Python, Flask, pandas/NumPy, SQLite, watchdog, Anthropic/OpenAI, React, PyInstaller
            </span>
          </li>
          <li>
            Engineered an agentic data-quality gatekeeper at XORBIX that watches folders, validates every file against per-column rules, and routes it to good, quarantine, or review
          </li>
          <li>
            Rebuilt the validation core into a chunked, vectorized pandas engine hitting ~442,000 rows/second (~50× faster) with flat memory on multi-hundred-GB files
          </li>
          <li>
            Added an LLM explanation agent with a 5-provider abstraction that turns failures into plain-English summaries emailed to the responsible team
          </li>
          <li>
            Cut a REST API from 3.1s to 0.56s (~5.5×) by collapsing 301 N+1 queries into 3 bulk reads, and packaged the full stack as a single offline Windows executable
          </li>
        </ul>
      )
    },
    {
      title: "Xorbix Document Flow",
      description: (
        <ul className="project-bullets">
          <li>
            <span className="tech-stack">
              Tech-Stack: C# / .NET 8, WPF (MVVM), JSON Schema, PdfPig, OpenXML, Multi-provider LLMs (Anthropic, OpenAI, LM Studio)
            </span>
          </li>
          <li>
            Built a local-first document-intelligence desktop app at XORBIX that turns RFQ PDFs into structured, priced customer quotes across 10+ document workflows
          </li>
          <li>
            Designed an "AI recommends, deterministic C# decides" pipeline — the LLM extracts fields against a strict schema while all pricing math runs in code, keeping quotes auditable
          </li>
          <li>
            Re-architected the AI extraction path to single-turn streaming over stdin, cutting per-document latency ~95% (from 3–6 minutes to ~5 seconds)
          </li>
          <li>
            Built a 5-provider LLM abstraction with hardened JSON-Schema outputs and reduced hot-path disk I/O ~8× via state-transition-only persistence
          </li>
        </ul>
      )
    },
    {
      title: "Kickstarter Cockpit",
      description: (
        <ul className="project-bullets">
          <li>
            <span className="tech-stack">
              Tech-Stack: C# / .NET 8, WPF (MVVM), Claude Code CLI, ASP.NET Core, EF Core, PostgreSQL (pgvector), React/Vite, xUnit
            </span>
          </li>
          <li>
            Helped build an internal AI application generator at XORBIX that drives Claude through a governed 6-step pipeline to produce full .NET + React apps with human approval at each step
          </li>
          <li>
            Engineered a "Finalize & Launch" agentic pass that makes generated code actually build and run — creating glue files, installing dependencies, and iterating until it compiles
          </li>
          <li>
            Built a unit-tested rollback and start-over safety subsystem with path-boundary checks that guarantee deletions never escape the generated-code folder
          </li>
          <li>
            Designed a feature-to-feature handoff-contract document so isolated generations integrate cleanly, producing 200+ file apps across 10 features in a single run
          </li>
        </ul>
      )
    },
    {
      title: "WorkAssist AI",
      description: (
        <ul className="project-bullets">
          <li>
            <span className="tech-stack">
              Tech-Stack: React 19, Python/Flask, Supabase (PostgreSQL), Azure OpenAI, Azure AI Search, JWT
            </span>
          </li>
          <li>
            Built an end-to-end RAG assistant at XORBIX that answers shop-floor questions only from approved SOPs, with source citations, confidence scores, and a decline path to avoid hallucination
          </li>
          <li>
            Engineered access-scoped hybrid (keyword + vector) search that injects team-based filters into the query, so users never receive answers from documents they can't access
          </li>
          <li>
            Added an AI quiz generator and a supervisor analytics dashboard that surfaces documentation gaps from the query log, with CSV export
          </li>
          <li>
            Shipped 35 REST endpoints across a 13-module backend with JWT role-gating over 1,536-dimension embeddings on a ~1,200-chunk document corpus
          </li>
        </ul>
      )
    },
    {
      title: "Derse Vista (QA Engineering)",
      description: (
        <ul className="project-bullets">
          <li>
            <span className="tech-stack">
              Tech-Stack: .NET 10, C#, EF Core, PostgreSQL, React 19, Azure DevOps, Python (openpyxl)
            </span>
          </li>
          <li>
            Led QA at XORBIX for a full-stack, multi-role logistics platform, authoring a 167-case test matrix mapped to requirements, roles, and acceptance criteria
          </li>
          <li>
            Validated all 10 application roles against a permission matrix and ran API-level authorization tests with spoofed division IDs to confirm server-side scoping
          </li>
          <li>
            Identified 15+ documented defects, including a silent client-save data-loss bug and a server-side authorization gap that the UI and automated tests missed
          </li>
          <li>
            Built Python (openpyxl) automation to turn findings into repeatable QA reports and used a repo→Figma→task traceability method to cut mis-filed bugs
          </li>
        </ul>
      )
    },
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
    <section
      className="projects"
      id="projects"
    >
      <h1>
        Projects
      </h1>
      
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
    </section>
  );
}