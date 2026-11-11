import { useEffect, useRef, useState } from "react";
import "./StyleSheet.css";
import EnhancedCard from "./EnhancedCard.jsx";
import gamesRandomImage from "./Games.Random.jpeg";
import barakahLinkImage from "./Barakah-link.jpeg";
import directAidImage from "./SCR-20260317-czet.png";
import storyVerseImage from "./StoryVerse.jpg";
import circuitGuardImage from "./CircuitGuard.webp";

// Monochrome outline icons (Lucide, ISC licence) instead of OS emoji.
const iconProps = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true };
const TrophyIcon = (
  <svg {...iconProps}>
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
  </svg>
);
const BriefcaseIcon = (
  <svg {...iconProps}>
    <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);
const XORBIX_WORK = [{ label: "Work @ XORBIX", icon: BriefcaseIcon }];
const FEATURED = 5; // flagship projects shown before "View all"

export default function Projects() {
  const gridRef = useRef(null);
  const [showAll, setShowAll] = useState(false);

  // The XORBIX role in Experience links here and asks for the full list.
  useEffect(() => {
    const open = () => setShowAll(true);
    window.addEventListener("projects:show-all", open);
    return () => window.removeEventListener("projects:show-all", open);
  }, []);
  
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
  }, [showAll]);

  const projects = [
    {
      title: "Circuit Guard",
      badges: [{ label: "Hackathon winner · FormulaTechHacks 2026", icon: TrophyIcon, kind: "award" }],
      image: circuitGuardImage,
      description: (
        <ul className="project-bullets">
          <li>
            <span className="tech-stack">
              Tech-Stack: Python 3.12, FastAPI, NumPy/SciPy, Next.js 16, React 19, TypeScript, three.js / React Three Fiber, Claude (Anthropic SDK), Hugging Face Whisper, MiniLM embeddings, SSE
            </span>
          </li>
          <li>
            <strong>Won the Ampere Track (AI for Motorsport Safety) at FormulaTechHacks 2026</strong> — led a 4-person team to build Circuit Guard, an AI race-control and insurance platform running on real Formula 1 data
          </li>
          <li>
            Built a live safety loop that streams real OpenF1 telemetry onto a React Three Fiber 3D digital twin of the circuit, detects crashes and lost grip, lights marshal panels sector-by-sector, and warns the following car over server-sent events
          </li>
          <li>
            Integrated a Claude steward agent that writes the steward's call with cited FIA 2026 regulations — structured outputs, validated citations, and a deterministic rule-engine fallback so it never invents a rule
          </li>
          <li>
            Wrote a 240 Hz vehicle-dynamics simulation (Pacejka-style tyres, split-μ braking, tyre barrier) proving an early warning saves the following car; between races, the top-3 riskiest corners caught 47–51% of the next seasons' serious incidents (1.7–2.2× chance)
          </li>
        </ul>
      ),
      link: "https://github.com/Muhammad-Rayyan-Moosani/FIA_ASSISTANT"
    },
    {
      title: "TestGuard Platform",
      description: (
        <ul className="project-bullets">
          <li>
            <span className="tech-stack">
              Tech-Stack: Python 3.12, Docker SDK, SQLAlchemy, JUnit XML, Click CLI, GitHub Actions
            </span>
          </li>
          <li>
            <strong>Reports what changed, not just pass/fail:</strong> runs untrusted test suites in a hardened Docker sandbox and reports what actually changed vs the last green run — not just pass/fail counts
          </li>
          <li>
            <strong>Locked-down Docker sandbox:</strong> no root, all capabilities dropped, read-only rootfs, capped memory/CPU/pids, and network revoked before tests run (attached only for dependency install; the run aborts if the disconnect fails)
          </li>
          <li>
            <strong>Language-agnostic by contract:</strong> a project declares an image + command and leaves JUnit XML behind; results diff against the last fully-green baseline, and flaky tests are surfaced but never fail the build
          </li>
          <li>
            <strong>Escape-tested in CI:</strong> verified confinement with adversarial escape tests that run inside a live container in CI
          </li>
        </ul>
      ),
      link: "https://github.com/Muhammad-Rayyan-Moosani/testguard"
    },
    {
      title: "Portfolio RAG Assistant",
      description: (
        <ul className="project-bullets">
          <li>
            <span className="tech-stack">
              Tech-Stack: Python, FastAPI, Anthropic Claude (Haiku), prompt caching, server-sent events, React, Render
            </span>
          </li>
          <li>
            <strong>The "Ask me anything" box on this site:</strong> Claude answers recruiters' questions in my voice from a curated markdown knowledge base, and only from it, with no invented employers, dates or numbers
          </li>
          <li>
            <strong>No retrieval step:</strong> the whole ~45 KB knowledge base (~11k tokens) rides in a prompt-cached system prompt, so every answer sees every role and project, repeat requests come from the cache (~10× cheaper), and dropping the embedding model cut server start-up to about a second
          </li>
          <li>
            <strong>Streams as it writes:</strong> answers arrive token by token over server-sent events; the frontend retries only cold-start errors (502/503/504) and fails fast on anything else
          </li>
          <li>
            <strong>Time-aware and grounded:</strong> today's date is injected after the cache breakpoint so "most recent role" questions are right without invalidating the cache; prompt-injection attempts are ignored, and the easter eggs are opt-in
          </li>
        </ul>
      ),
      link: "https://github.com/Muhammad-Rayyan-Moosani/Personal-Website/tree/main/LLM-Integration"
    },
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
            <strong>Manuscript → 45-second trailer in minutes:</strong> a full-stack, AI-native platform that turns a written manuscript into a finished cinematic book trailer with visuals, camera motion, time-aligned narration and lip-sync
          </li>
          <li>
            <strong>~10 AI providers, ~600× cost range:</strong> a declarative step-runner puts them behind one uniform interface across 8 model-agnostic tiers ($0.03–$18 per trailer)
          </li>
          <li>
            <strong>Resumable, human-in-the-loop pipeline:</strong> with database-persisted state, users pause, preview, edit prompts, regenerate a single asset, or swap models mid-run without restarting or re-paying for completed work
          </li>
          <li>
            <strong>Character consistency ~22% → 100% of scenes:</strong> moved correctness out of unreliable LLM instructions into a deterministic prompt injector
          </li>
        </ul>
      ),
      live: "https://storyverse-production-2356.up.railway.app/"
    },
    {
      title: "File Guardian Agent",
      badges: XORBIX_WORK,
      description: (
        <ul className="project-bullets">
          <li>
            <span className="tech-stack">
              Tech-Stack: Python, Flask, pandas/NumPy, SQLite, watchdog, Anthropic/OpenAI, React, PyInstaller
            </span>
          </li>
          <li>
            <strong>Agentic data-quality gatekeeper:</strong> watches folders, validates every file against per-column rules, and routes it to good, quarantine, or review
          </li>
          <li>
            <strong>~442,000 rows/second (~50× faster):</strong> rebuilt the validation core into a chunked, vectorized pandas engine with flat memory on multi-hundred-GB files
          </li>
          <li>
            <strong>Plain-English failure reports:</strong> an LLM explanation agent with a 5-provider abstraction that turns failures into plain-English summaries emailed to the responsible team
          </li>
          <li>
            <strong>REST API 3.1s → 0.56s (~5.5×):</strong> collapsed 301 N+1 queries into 3 bulk reads, and packaged the full stack as a single offline Windows executable
          </li>
        </ul>
      ),
      link: "https://github.com/Muhammad-Rayyan-Moosani/file-guardian"
    },
    {
      title: "Xorbix Document Flow",
      badges: XORBIX_WORK,
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
      badges: XORBIX_WORK,
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
      badges: XORBIX_WORK,
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
      badges: XORBIX_WORK,
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
      link: "https://github.com/Shayan-Mazahir/games.random",
      live: "https://games-random.onrender.com"
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
      link: "https://github.com/Muhammad-Rayyan-Moosani/Autonomous_Voice_Web_Agent"
    },
    {
      title: "TrackerFlow AI",
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
      link: "https://github.com/Muhammad-Rayyan-Moosani/TrackerFlow-AI"
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
      link: "https://github.com/Muhammad-Rayyan-Moosani/DirectAid-multi-rail-donation-platform",
      live: "https://direct-aid-multi-rail-donation-plat.vercel.app"
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
      link: "https://github.com/Muhammad-Rayyan-Moosani/barakahlink",
      live: "https://barakahlink.vercel.app"
    }
  ];

  return (
    <section
      className="projects"
      id="projects"
    >
      <h2>
        Projects
      </h2>
      
      {/* Container for cards */}
      <div className="projects-grid" ref={gridRef}>
        {(showAll ? projects : projects.slice(0, FEATURED)).map((project, index) => (
          <EnhancedCard
            key={index}
            title={project.title}
            description={project.description}
            date={project.date}
            link={project.link}
            live={project.live}
            writeup={project.writeup}
            image={project.image}
            badges={project.badges}
          />
        ))}
      </div>

      <button
        type="button"
        className="projects-toggle"
        aria-expanded={showAll}
        onClick={() => setShowAll((v) => !v)}
      >
        {showAll ? "Show featured projects only" : `View all projects (${projects.length})`}
      </button>
    </section>
  );
}