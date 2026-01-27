import { useEffect, useRef } from "react";
import "./StyleSheet.css";
import Card from "./Card.jsx";

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
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    if (timelineRef.current) {
      const items = timelineRef.current.querySelectorAll(".timeline-item");
      items.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.15}s`;
        observer.observe(item);
      });
    }

    return () => observer.disconnect();
  }, []);

  const experiences = [
    {
      title: "IICUW - Web Developer",
      date: "Sep 2025 – Dec 2025",
      link: "https://www.iicuwaterloo.com/",
      bullets: [
        "Optimized frontend interfaces to improve load times by 20%",
        "Designed and deployed Discord bots automating 3–5 routine tasks",
        "Reduced manual workload by up to 40% through automation",
        "Built interactive bot features supporting 100+ active users",
        "Contributed to 6 production feature updates using clean, maintainable code"
      ]
    },
    {
      title: "Scitra - Software Optimisation Engineer",
      date: "July 2024 – Aug 2024",
      link: "https://www.albatha.com/scitra.htm",
      bullets: [
        "Built a Python Telegram bot with Google Sheets API for real-time issue reporting across 30+ production lines",
        "Reduced reporting latency by 40% through automated workflows",
        "Developed Unity/C# 3D digital twins with live IoT data for predictive maintenance",
        "Automated error logging, improving root-cause analysis speed by 30%"
      ]
    },
    {
      title: "Medad - Operations Optimiser",
      date: "July 2025 – Aug 2025",
      link: "https://www.albatha.com/medad-printing.htm",
      bullets: [
        "Gained hands-on experience across the full packaging production workflow",
        "Performed quality inspections using microscopes for print accuracy",
        "Assisted design team with print-ready artwork preparation",
        "Developed practical understanding of graphic design principles"
      ]
    },
    {
      title: "AGMC",
      date: "June 2024 – July 2024",
      link: "https://www.bmw-dubai.com/",
      bullets: [
        "Observed end-to-end automotive service and operations workflow",
        "Assisted technical teams with inspection and diagnostics processes",
        "Developed understanding of quality control in automotive systems"
      ]
    }
  ];

  return (
    <section className="experience" id="experience">
      <h1>Experience</h1>

      <div className="timeline" ref={timelineRef}>
        {experiences.map((exp, index) => (
          <div
            className={`timeline-item ${index % 2 === 0 ? "left" : "right"}`}
            key={index}
          >
            <div className="timeline-dot" />
            <Card
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