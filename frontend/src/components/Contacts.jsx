import "./StyleSheet.css";

import { EMAIL, LINKS } from "./socialLinks";
import MessageBubble from "./MessageBubble";

export default function Contacts() {
  // Opens a Gmail compose window addressed to me (new tab).
  const gmailCompose = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(EMAIL)}`;

  return (
    <section className="contacts" id="contacts">
      <p className="contact-eyebrow">Say hello</p>
      <h2>Get in touch</h2>
      <p className="contact-sub">Looking for a Summer 2027 (May–Aug) software engineering co-op.</p>

      <a className="contact-email" href={gmailCompose} target="_blank" rel="noopener noreferrer">
        {EMAIL}
      </a>

      <MessageBubble />

      <div className="contact-icons">
        {LINKS.map(({ label, href, icon }) => (
          <a
            key={label}
            href={href}
            aria-label={label}
            title={label}
            {...(href.startsWith("http") && {
              target: "_blank",
              rel: "noopener noreferrer",
            })}
          >
            {icon}
          </a>
        ))}
      </div>

      {/* University of Waterloo CS webring */}
      <div className="webring-container">
        <a
          href="https://cs.uwatering.com/#https://www.rayyanmoosani.com/?nav=prev"
          className="webring-arrow"
          aria-label="Previous site in the CS webring"
        >
          ⤆
        </a>
        <a
          href="https://cs.uwatering.com/#https://www.rayyanmoosani.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="https://cs.uwatering.com/icon.white.svg"
            alt="CS Webring"
            className="webring-icon"
          />
        </a>
        <a
          href="https://cs.uwatering.com/#https://www.rayyanmoosani.com/?nav=next"
          className="webring-arrow"
          aria-label="Next site in the CS webring"
        >
          ⤇
        </a>
      </div>
    </section>
  );
}
