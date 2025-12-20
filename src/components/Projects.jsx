import "./StyleSheet.css";
import Card from "./Card.jsx";

export default function Projects() {
  const projects = [
    {
      title: "Games.Random",
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
      title: "Youtube Playlist Downloader",
      description: (
  <ul className="project-bullets">
    <li>
      <span className="tech-stack">
        Tech-Stack: Python, React, Flask, yt-dlp, FFmpeg, SQLite
      </span>
    </li>
    <li>
      Built a full-stack app for fast, high-resolution YouTube playlist downloads
    </li>
    <li>
      Integrated yt-dlp and FFmpeg for batching and format conversion
    </li>
    <li>
      Used multiprocessing and SQLite for concurrent downloads
      and persistent history
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
          />
        ))}
      </div>
    </section>
  );
}