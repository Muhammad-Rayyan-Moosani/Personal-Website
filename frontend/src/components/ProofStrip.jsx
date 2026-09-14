import "./StyleSheet.css";

export default function ProofStrip() {
  const facts = [
    ["Software Engineer", "XORBIX · since May 2026"],
    ["CS @ Waterloo", "Class of 2029"],
    ["11 public repos", "on GitHub"],
    ["TestGuard", "sandboxed test runner"],
  ];

  return (
    <section className="proof-strip" aria-label="Quick facts">
      {facts.map(([a, b], i) => (
        <div className="proof-item" key={i}>
          <span className="proof-a">{a}</span>
          <span className="proof-b">{b}</span>
        </div>
      ))}
    </section>
  );
}
