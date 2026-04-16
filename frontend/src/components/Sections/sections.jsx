import "./sections.css";

export default function Section({ title, text }) {
  return (
    <div className="section">
      <h2>{title}</h2>
      <p>{text}</p>
    </div>
  );
}