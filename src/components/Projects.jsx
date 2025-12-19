import "./StyleSheet.css";
import Card from "./Card.jsx";

export default function Projects() {
  const projects = [
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
    <section className="projects" id="projects">
      <h1>Projects</h1>
      
      {/* Container for cards */}
      <div className="projects-grid">
        {projects.map((project, index) => (
          <Card
            key={index}
            title={project.title}
            description={project.description}
            date={project.date}
            link={project.link}
          />
        ))}
      </div>
    </section>
  );
}