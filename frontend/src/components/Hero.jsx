import "./StyleSheet.css";
import waterlooLogo from "./waterloo logo.png";
import resumePdf from "./Rayyan_Moosani_Resume_EX.pdf";
import PromptBox from "./PromptBox";
import HoloPortrait from "./HoloPortrait";
import { LINKS } from "./socialLinks";
import FloatingAsk from "./FloatingAsk";

// The résumé icon from the old navbar (Lucide "file-text"), opening the PDF.
const RESUME_LINK = {
  label: "Resume (PDF)",
  href: resumePdf,
  newTab: true,
  icon: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  ),
};

export default function Hero() {
  return (
    <section className="hero" id="home">
      <HoloPortrait />
      <h1 className="hero-title">Rayyan Moosani</h1>

      <p className="hero-role">
        Software Engineer @ XORBIX &nbsp;·&nbsp; CS @{" "}
        <span className="hero-waterloo-wrap">
          UWaterloo
          {/* Decorative: "Waterloo" is already in the text, so it isn't read twice */}
          <img src={waterlooLogo} alt="" aria-hidden="true" className="hero-waterloo-logo" />
        </span>{" "}
        &rsquo;29
      </p>

      <p className="hero-subtitle">
        I build validation engines, LLM pipelines and sandboxed test infrastructure.
      </p>

      {/* Contact icon row plus the résumé, in place of the big CTA buttons */}
      <div className="contact-icons hero-icons">
        {[...LINKS, RESUME_LINK].map(({ label, href, icon, newTab }) => (
          <a
            key={label}
            href={href}
            aria-label={label}
            title={label}
            {...((newTab || href.startsWith("http")) && { target: "_blank", rel: "noopener noreferrer" })}
          >
            {icon}
          </a>
        ))}
      </div>

      <div className="hero-assistant">
        <p className="hero-assistant-caption">Ask the RAG assistant I built for this site</p>
        <PromptBox />
      </div>

      <FloatingAsk />
    </section>
  );
}
