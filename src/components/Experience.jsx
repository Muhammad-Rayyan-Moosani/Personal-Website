import "./StyleSheet.css";
import Card from "./Card.jsx";

export default function Experience() {
  const experiences = [
    {
      title: "IICUW",
      description: "Optimized frontend interfaces to achieve a 20% improvement in load times, resulting in a smoother and more responsive user experience. Designed, built, and deployed Discord bots to automate 3–5 routine tasks, reducing the team’s manual workload by up to 40%. Developed interactive bot features that supported over 100 active users and significantly increased server engagement. Contributed to six successful feature updates by writing clean, maintainable code and collaborating effectively using modern web development tools.",
      date: "Sep 2025 – Dec 2025",
      link: "https://www.iicuwaterloo.com/"
    },
    {
      title: "Scitra",
      description: "Built a Python-based Telegram chatbot integrated with the Google Sheets API to enable real-time reporting of machinery issues across more than 30 production lines. Implemented a streamlined, automated reporting workflow that reduced reporting latency by 40% and improved data reliability. Designed and developed 3D digital twins of factory machinery using Unity and C#, integrating real-time IoT sensor streams to support predictive maintenance initiatives. Automated error logging and diagnostics, improving the engineering team’s root-cause identification speed by 30%.",
      date: "July 2024 – Aug 2024",
      link: "https://www.albatha.com/scitra.htm"
    },
    {
      title: "Medad",
      description: "Developed a strong understanding of the end-to-end packaging production workflow, spanning design, printing, and quality control. Gained hands-on experience with quality inspection processes, including the use of microscopes to evaluate print accuracy and packaging details. Assisted the design team with foundational tasks, building practical knowledge of graphic design principles and print-ready artwork preparation.",
      date: "July 2025 – Aug 2025",
      link: "https://www.albatha.com/medad-printing.htm"
    },
    {
      title: "AGMC",
      description: "Developed a strong understanding of the end-to-end packaging production workflow, spanning design, printing, and quality control. Gained hands-on experience with quality inspection processes, including the use of microscopes to evaluate print accuracy and packaging details. Assisted the design team with foundational tasks, building practical knowledge of graphic design principles and print-ready artwork preparation.",
      date: "June 2024 – July 2024",
      link: "https://www.bmw-dubai.com/"
    }
  ];

  return (
    <section className="experience" id="experience">
      <h1>Experience</h1>

      <div className="timeline">
        {experiences.map((exp, index) => (
          <div className="timeline-item" key={index}>
            <div className="timeline-dot" />
            <Card
              title={exp.title}
              description={exp.description}
              date={exp.date}
              link={exp.link}
            />
          </div>
        ))}
      </div>
    </section>
  );
}