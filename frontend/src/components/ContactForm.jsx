import { useState } from "react";
import { API_URL, fetchWaking } from "../api";
import { EMAIL } from "./socialLinks";

// "Send me a message" form (shown in the MessageBubble dialog): name, optional
// reply email, message. The backend
// (/contact) emails it to me; if that's unavailable the visitor gets my
// address instead, so a message is never silently lost.
export default function ContactForm({ title = "Send me a message" }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState(""); // honeypot, hidden from people
  const [state, setState] = useState("idle"); // idle | sending | sent | error
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (state === "sending") return;
    setState("sending");
    setError("");
    try {
      const res = await fetchWaking(
        `${API_URL}/contact`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email: email || null, message, website: website || null }),
        },
        20,
      );
      if (res.ok) {
        setState("sent");
        setName("");
        setEmail("");
        setMessage("");
        return;
      }
      setError(
        res.status === 429
          ? "You've sent a few messages already. Please try again in a little while, or email me directly."
          : res.status === 422
            ? "Please check your name, email and message, then try again."
            : "The form couldn't send your message right now. Please email me directly instead.",
      );
      setState("error");
    } catch {
      setError("The form couldn't send your message right now. Please email me directly instead.");
      setState("error");
    }
  };

  if (state === "sent") {
    return (
      <div className="contact-form contact-form-sent" role="status">
        <p className="contact-form-title">Message sent ✓</p>
        <p>Thanks for reaching out. I&apos;ll get back to you soon.</p>
        <button type="button" className="contact-form-again" onClick={() => setState("idle")}>
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={submit}>
      <p className="contact-form-title">{title}</p>

      <div className="contact-form-row">
        <label className="contact-field">
          <span>Name</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            maxLength={100}
            autoComplete="name"
            placeholder="Your name"
          />
        </label>
        <label className="contact-field">
          <span>
            Email <em>(optional, so I can reply)</em>
          </span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            maxLength={200}
            autoComplete="email"
            placeholder="you@company.com"
          />
        </label>
      </div>

      <label className="contact-field">
        <span>Message</span>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          maxLength={4000}
          rows={5}
          placeholder="Hi Rayyan, …"
        />
      </label>

      {/* Honeypot: invisible to people and skipped by keyboard; bots fill it in. */}
      <label className="contact-hp" aria-hidden="true">
        Website
        <input type="text" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
      </label>

      {state === "error" && (
        <p className="contact-form-error" role="alert">
          {error} <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
        </p>
      )}

      <button type="submit" className="contact-form-send" disabled={state === "sending"}>
        {state === "sending" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
