import "./StyleSheet.css";
import Card from "./Card.jsx";

export default function Projects() {
  const projects = [
    {
      title: "Games.Random",
      description: (
        <>
          Tech Stack: <span className="highlight">React</span>, <span className="highlight">Node.js</span>, <span className="highlight">MongoDB</span>, <span className="highlight">Phaser 3</span>, <span className="highlight">p5.js</span><br />
          Built an AI-powered game platform that enables users to instantly design, play, and modify custom games in real time. Implemented live code highlighting for <span className="highlight">Phaser 3</span> and <span className="highlight">p5.js</span>, transforming gameplay into an interactive, hands-on programming learning experience. Integrated <span className="highlight">Google authentication</span> and <span className="highlight">MongoDB</span> for secure, scalable user management, alongside an in-platform <span className="highlight">AI chatbot</span> that provides real-time guidance and support. Developed the platform using <span className="highlight">React</span> and <span className="highlight">Node.js</span> to deliver a fast, polished, and deeply engaging user experience.
        </>
      ),
      link: "https://github.com/Shayan-Mazahir/games.random"
    },
    {
      title: "AI-TRACKER",
      description: (
  <>
    Tech Stack: <span className="highlight">Python (Flask API)</span>, <span className="highlight">Supabase</span>, <span className="highlight">Chrome Extensions (MV3)</span>, <span className="highlight">React.js</span><br />
    Built an AI-powered Chrome extension that instantly generates custom, dynamic trackers for any user workflow from simple natural-language prompts. Developed intelligent content scripts to extract live webpage data and designed a sleek, <span className="highlight">React</span>-based popup for effortless tracker management. Enabled seamless, reliable communication via <span className="highlight">REST APIs</span> using <span className="highlight">Flask</span>, while securely storing and managing user data in <span className="highlight">Supabase</span> for a fast, production-ready experience.
  </>
),
      link: "https://github.com/Muhammad-Rayyan-Moosani/AI-tracker"
    },
    {
      title: "Youtube Playlist Downloader",
      description: (
        <>
          Developed a full-stack web application featuring a <span className="highlight">React</span> frontend and <span className="highlight">Flask</span> backend to enable fast, high-resolution YouTube playlist downloads. Integrated <span className="highlight">yt-dlp</span> and <span className="highlight">FFmpeg</span> to support efficient video/audio downloading, batching, and format conversion. Leveraged <span className="highlight">multiprocessing</span> and <span className="highlight">SQLite</span> to ensure reliable performance, concurrent downloads, and persistent download history. Built using <span className="highlight">Python</span>, <span className="highlight">React.js</span>, <span className="highlight">yt-dlp</span>, <span className="highlight">FFmpeg</span>, and <span className="highlight">SQLite</span>.
        </>
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