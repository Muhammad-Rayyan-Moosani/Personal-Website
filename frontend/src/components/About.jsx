import "./StyleSheet.css";

export default function About() {
  return (
    <section
      className="about-section"
      id="about"
    >
      <h2
        className="about-heading"
      >
        About Me
      </h2>

      <div
        className="about-box"
      >
        <p className="about-intro">
          I build backend systems and AI pipelines that have to survive real
          users. At XORBIX I rebuilt a file-validation core into a chunked,
          vectorized pandas engine (~442K rows/s on multi-GB inputs, ~50× faster)
          and cut one REST endpoint from 3.1s to 0.56s by collapsing 301 N+1
          queries into three bulk reads. In the document pipeline, the LLM
          extracts fields against a strict JSON Schema and deterministic C# does
          every line of pricing math, so quotes stay auditable.
        </p>

        <p className="about-intro">
          On my own time I&apos;m building TestGuard, a regression engine that
          runs untrusted test suites inside a locked-down Docker sandbox (no root,
          no capabilities, read-only rootfs, network revoked before tests start)
          and diffs results against the last fully green baseline instead of the
          previous run. Before that: a Telegram + Google Sheets fault-reporting
          bot across 30+ production lines at SCITRA, and Unity/C# digital twins
          fed by live IoT data.
        </p>

        <p className="about-intro">
          Computer Science at Waterloo, class of 2029. Python, C#/.NET,
          TypeScript, React, PostgreSQL, Docker.
        </p>

        <p className="about-intro" style={{ marginBottom: 0, opacity: 0.7 }}>
          Outside code: cricket captain, table tennis.
        </p>
      </div>
    </section>
  );
}
