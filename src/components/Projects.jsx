import "./StyleSheet.css";
import Card from "./Card.jsx";
import gamesRandomImage from "./Games.Random.jpeg";
import barakahLinkImage from "./Barakah-link.jpeg";

export default function Projects() {
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
            image={project.image}
          />
        ))}
      </div>
    </section>
  );
}