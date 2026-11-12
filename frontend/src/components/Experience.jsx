import { useEffect, useRef } from "react";
import "./StyleSheet.css";
import EnhancedCard from "./EnhancedCard.jsx";

export default function Experience() {
  const timelineRef = useRef(null);
  
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

    if (timelineRef.current) {
      const items = timelineRef.current.querySelectorAll(".timeline-item");
      items.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.05}s`;
        observer.observe(item);
      });
    }

    return () => observer.disconnect();
  }, []);

  // Lock each card's timeline dot and date to the vertical middle of its
  // card. Card heights change as text wraps at different widths, so this is
  // recomputed on resize and once fonts are ready.
  useEffect(() => {
    const timeline = timelineRef.current;
    if (!timeline) return;
    const align = () => {
      timeline.querySelectorAll(".timeline-item").forEach((item) => {
        const card = item.querySelector(".card");
        if (!card) return;
        const y = card.offsetTop + card.offsetHeight / 2; // layout only, so animations can't skew it
        item.style.setProperty("--card-mid", `${Math.round(y)}px`);
      });
    };
    align();
    // Re-align whenever the timeline or any card changes size (wrapping text,
    // or a card expanding / collapsing its details).
    const ro = new ResizeObserver(align);
    ro.observe(timeline);
    timeline.querySelectorAll(".card").forEach((card) => ro.observe(card));
    document.fonts?.ready.then(align);
    return () => ro.disconnect();
  }, []);

  // Open the full project list (the XORBIX work isn't all in the featured five).
  const showXorbixWork = () => window.dispatchEvent(new Event("projects:show-all"));

  const experiences = [
    {
      role: "Software Engineer",
      company: "XORBIX",
      date: "May 2026 – Present",
      link: "https://www.xorbix.com/",
      stack: ["C# / .NET 8", "Python", "Flask", "React", "pandas", "Azure OpenAI", "Azure AI Search", "Multi-provider LLMs"],
      bullets: [
        <>Built a vectorized pandas validation engine hitting <strong>~442K rows/sec</strong> (<strong>~50× faster</strong>) and cut a REST API <strong>3.1s → 0.56s</strong></>,
        <>Built AI document-processing & code-gen desktop apps in C#/.NET, cutting AI extraction latency <strong>~95%</strong> (<strong>minutes → ~5s</strong>)</>,
        <>Shipped a RAG assistant on Azure OpenAI/AI Search; QA&apos;d a .NET/React app via a <strong>167-case matrix</strong>, finding <strong>15+ defects</strong></>,
        "Projects from this role: File Guardian Agent, Xorbix Document Flow, Kickstarter Cockpit, WorkAssist AI and Derse Vista",
      ],
      extraLinks: [{ label: "View tagged projects ↓", href: "#projects", onClick: () => showXorbixWork() }],
    },
    {
      role: "Software Developer",
      company: "IICUW",
      date: "Sep 2025 – Dec 2025",
      link: "https://uwmsa.com/",
      stack: ["GitHub", "Python", "Discord API", "React"],
      bullets: [
        <>Optimized frontend performance by refactoring React (ES6+) components, reducing bundle size & improving team load times by <strong>~20%</strong></>,
        "Developed Python-based Discord bots to automate internal workflows and streamline team operations",
        <>Supported <strong>100+ active users</strong> by developing interactive bot features, significantly improving server engagement</>,
        <>Added <strong>6 successful web pages</strong> by delivering clean, maintainable code and collaborating using Git/GitHub</>,
      ],
    },
    {
      role: "QA Analyst",
      company: "MEDAD",
      date: "July 2025 – Aug 2025",
      link: "https://www.albatha.com/medad-printing.htm",
      stack: ["Adobe Illustrator", "Adobe Photoshop"],
      bullets: [
        "Analyzed packaging workflow across design, printing, and quality teams to understand production pipeline",
        "Conducted print quality inspections, evaluating color accuracy, alignment, and packaging output using verification tools",
        "Prepared print-ready artwork in Adobe Illustrator, ensuring files met production specifications and formatting standards",
      ],
    },
    {
      role: "Software Automation Developer",
      company: "SCITRA",
      date: "Aug 2024 – Sep 2024",
      link: "https://www.albatha.com/scitra.htm",
      stack: ["Telegram Bot API", "Google Sheets API", "Unity", "C#", "IoT Systems"],
      bullets: [
        <>Developed and deployed a Python-based Telegram chatbot integrated with the Google Sheets API to enable real-time reporting of machinery issues across <strong>30+ production lines</strong>. Reduced reporting latency by <strong>40%</strong> by architecting a streamlined, automated issue-tracking workflow</>,
        <>Engineered high-fidelity 3D digital twins of factory machinery using Unity & C#, integrating real-time IoT sensor data to support predictive maintenance strategies. Automated intelligent error logging, improving the engineering team&apos;s fault diagnosis and resolution speed by <strong>30%</strong></>,
      ],
    },
    {
      role: "IT Intern",
      company: "AGMC",
      date: "June 2024 – July 2024",
      link: "https://www.bmw-dubai.com/",
      stack: ["Microsoft Forms", "SharePoint", "Excel workflow", "Microsoft 365 systems"],
      bullets: [
        "Designed and implemented a Microsoft Forms, SharePoint, and Excel workflow replacing a paper-based process and centralizing internal data collection",
        "Led the transition of internal requests to Microsoft 365 systems, improving information accessibility and reducing manual administrative steps",
        "Supported IT operations by assisting staff with internal software tools, documentation, and troubleshooting, streamlining enterprise workflows",
      ],
    },
  ];

  return (
    <section
      className="experience"
      id="experience"
    >
      <h2>
        Experience
      </h2>

      <div className="timeline" ref={timelineRef}>
        {experiences.map((exp, index) => (
          <div
            className={`timeline-item ${index % 2 === 0 ? "left" : "right"}`}
            key={index}
          >
            <div
              className="timeline-dot"
            />
            {/* Desktop: the date sits across the line from its card */}
            <span className="timeline-date">{exp.date}</span>
            <EnhancedCard
              title={exp.role}
              subtitle={`@ ${exp.company}`}
              tags={exp.stack}
              bullets={exp.bullets}
              date={exp.date}
              link={exp.link}
              linkLabel="Company site ↗"
              linkTitle={false}
              collapsible
              extraLinks={exp.extraLinks}
            />
          </div>
        ))}
      </div>
    </section>
  );
}