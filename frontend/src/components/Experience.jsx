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

  const experiences = [
    {
      title: "IICUW - Software Developer",
      date: "Sep 2025 – Dec 2025",
      link: "https://www.iicuwaterloo.com/",
      bullets: [
        <span className="tech-stack">GitHub, Python, Discord API, React</span>,
        "Optimized frontend performance by refactoring React (ES6+) components, reducing bundle size & improving team load times by ~20%",
        "Developed Python-based Discord bots to automate internal workflows and streamline team operations",
        "Supported 100+ active users by developing interactive bot features, significantly improving server engagement",
        "Added 6 successful web pages by delivering clean, maintainable code and collaborating using Git/GitHub"
      ]
    },
    {
      title: "SCITRA - Software Automation Developer",
      date: "Aug 2024 – Sep 2024",
      link: "https://www.albatha.com/scitra.htm",
      bullets: [
        <span className="tech-stack">Telegram bot API, Google Sheets API, Unity, C#, IOT Systems</span>,
        "Developed and deployed a Python-based Telegram chatbot integrated with the Google Sheets API to enable real-time reporting of machinery issues across 30+ production lines. Reduced reporting latency by 40% by architecting a streamlined, automated issue-tracking workflow",
        "Engineered high-fidelity 3D digital twins of factory machinery using Unity & C#, integrating real-time IoT sensor data to support predictive maintenance strategies. Automated intelligent error logging, improving the engineering team's fault diagnosis and resolution speed by 30%"
      ]
    },
    {
      title: "MEDAD - QA Analyst",
      date: "July 2025 – Aug 2025",
      link: "https://www.albatha.com/medad-printing.htm",
      bullets: [
        <span className="tech-stack">Adobe Photoshop</span>,
        "Analyzed packaging workflow across design, printing, and quality teams to understand production pipeline",
        "Conducted print quality inspections, evaluating color accuracy, alignment, and packaging output using verification tools",
        "Prepared print-ready artwork in Adobe Illustrator, ensuring files met production specifications and formatting standards"
      ]
    },
    {
      title: "AGMC - IT Intern",
      date: "June 2024 – July 2024",
      link: "https://www.bmw-dubai.com/",
      bullets: [
        <span className="tech-stack">Microsoft Forms, SharePoint, Excel workflow, Microsoft 365 systems</span>,
        "Designed and implemented a Microsoft Forms, SharePoint, and Excel workflow replacing a paper-based process and centralizing internal data collection",
        "Led the transition of internal requests to Microsoft 365 systems, improving information accessibility and reducing manual administrative steps",
        "Supported IT operations by assisting staff with internal software tools, documentation, and troubleshooting, streamlining enterprise workflows"
      ]
    }
  ];

  return (
    <section
      className="experience"
      id="experience"
    >
      <h1>
        Experience
      </h1>

      <div className="timeline" ref={timelineRef}>
        {experiences.map((exp, index) => (
          <div
            className={`timeline-item ${index % 2 === 0 ? "left" : "right"}`}
            key={index}
          >
            <div
              className="timeline-dot"
            />
            <EnhancedCard
              title={exp.title}
              bullets={exp.bullets}
              date={exp.date}
              link={exp.link}
            />
          </div>
        ))}
      </div>
    </section>
  );
}