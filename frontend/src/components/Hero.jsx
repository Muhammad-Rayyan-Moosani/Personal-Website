import "./StyleSheet.css";
import waterlooLogo from "./waterloo logo.png";
import resumePdf from "./Rayyan_Moosani_Resume_EX.pdf";
import PromptBox from "./PromptBox";

export default function Hero() {
  return (
    <section className="hero" id="home">
      <h1 className="hero-title">Rayyan Moosani</h1>

      <p className="hero-role">
        Software Engineer @ XORBIX &nbsp;·&nbsp; CS @{" "}
        <span className="hero-waterloo-wrap">
          Waterloo
          <img
            src={waterlooLogo}
            alt="University of Waterloo"
            className="hero-waterloo-logo"
          />
        </span>{" "}
        &rsquo;29
      </p>

      <p className="hero-subtitle">
        I build validation engines, LLM pipelines and sandboxed test infrastructure.
      </p>

      <div className="hero-cta">
        <a
          className="btn btn-primary"
          href="#projects"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById("projects")?.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
        >
          View projects
        </a>
        <a className="btn" href={resumePdf} target="_blank" rel="noreferrer">
          Resume (PDF)
        </a>
        <a
          className="btn"
          href="https://github.com/Muhammad-Rayyan-Moosani"
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </a>
      </div>

      <div className="hero-assistant">
        <p className="hero-assistant-caption">Ask the RAG assistant I built for this site</p>
        <PromptBox />
      </div>
    </section>
  );
}
