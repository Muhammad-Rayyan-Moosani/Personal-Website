import "./StyleSheet.css";

export default function Contacts() {
  return (
    <section className="contacts" id="contacts">
      <h1>Contact</h1>
      <p>Let’s connect</p>

      <div className="social-links">
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
    </section>
  );
}