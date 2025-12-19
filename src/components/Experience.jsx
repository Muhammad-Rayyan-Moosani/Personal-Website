import "./StyleSheet.css";
import Card from "./Card.jsx";

export default function Experience() {
  const experiences = [
    {
      title: "IICUW",
      description: "Optimized frontend interfaces, resulting in a 20% improvement...",
      date: "Sep 2025 – Dec 2025",
      link: "https://www.iicuwaterloo.com/"
    },
    {
      title: "Scitra",
      description: "Software Developer\nBuilt automation tools and improved system performance...",
      date: "Aug 2024 – Sep 2024",
      link: "https://www.iicuwaterloo.com/"
    },
    {
      title: "Medad",
      description: "Built automation tools and improved system performance...",
      date: "Aug 2024 – Sep 2025",
      link: "https://www.iicuwaterloo.com/"
    },
    {
      title: "Medad",
      description: "Built automation tools and improved system performance...",
      date: "Aug 2024 – Sep 2025",
      link: "https://www.iicuwaterloo.com/"
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