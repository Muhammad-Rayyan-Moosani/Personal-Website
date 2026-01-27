import "./StyleSheet.css";

export default function Contacts() {
  return (
    <section className="contacts" id="contacts">
      <h1>Contact</h1>
      <p>Let’s connect</p>

      <div className="contact-box">
        {/* Top row: Links */}
        <div className="contact-links">
          <a
            href="https://www.linkedin.com/in/rayyan-moosani-64b4971aa/"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
          <a
            href="https://github.com/Muhammad-Rayyan-Moosani"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          <a href="mailto:mrayyanm411@gmail.com">
            Gmail
          </a>
        </div>

        {/* Bottom row: Webring logo with arrows */}
        <div className="webring-container">
          <a
            href="https://cs.uwatering.com/#https://www.rayyanmoosani.com/?nav=prev"
            className="webring-arrow"
          >
            ⤆
          </a>
          <a href="https://cs.uwatering.com/#https://www.rayyanmoosani.com/" target="_blank">
            <img
              src="https://cs.uwatering.com/icon.white.svg"
              alt="CS Webring"
              className="webring-icon"
            />
          </a>
          <a
            href="https://cs.uwatering.com/#https://www.rayyanmoosani.com/?nav=next"
            className="webring-arrow"
          >
            ⤇
          </a>
        </div>
      </div>
      

    </section>
    
  );
}