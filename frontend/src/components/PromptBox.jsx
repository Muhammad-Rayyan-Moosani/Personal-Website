import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import "./PromptBox.css";

import { API_URL as apiUrl, fetchWaking } from "../api";

// Send-button loading state: a comet looping a faint track around a breathing
// core. Until the first words arrive the core breathes; once the answer is
// streaming (`writing`) it settles and the track brightens.
function OrbitLoader({ writing }) {
  return (
    <svg
      className={`orbit-loader${writing ? " is-writing" : ""}`}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle className="orbit-track" cx="12" cy="12" r="8.5" />
      <g className="orbit-comet">
        <circle className="orbit-tail orbit-tail-2" cx="12" cy="12" r="8.5" />
        <circle className="orbit-tail orbit-tail-1" cx="12" cy="12" r="8.5" />
        <circle className="orbit-head" cx="12" cy="12" r="8.5" />
      </g>
      <circle className="orbit-core" cx="12" cy="12" r="2.6" />
    </svg>
  );
}

// One tap asks a full question. Short labels for the chips, but the question
// sent is worded the way the knowledge base answers best, and the set covers
// my strongest areas, the hiring timeline recruiters need, and one playful
// chip that leads into the easter eggs. The assistant answers as me in the
// first person, so the questions address me directly ("you").
const SUGGESTIONS = [
  {
    label: "Hackathon win",
    question: "Tell me about Circuit Guard and how your team won FormulaTechHacks.",
  },
  {
    label: "Work at XORBIX",
    question: "What have you built at XORBIX, and what impact did it have?",
  },
  {
    label: "LLM & infra projects",
    question: "What LLM pipelines and validation engines have you built, and how did you engineer them?",
  },
  {
    label: "Next co-op term?",
    question: "When is your next co-op term, and what kind of role are you looking for?",
  },
  {
    label: "Tell me a joke",
    question: "Tell me a joke about your work.",
  },
];

export default function PromptBox() {
  const [prompt, setPrompt] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [response, setResponse] = useState("");
  const [showResponse, setShowResponse] = useState(false);

  // Warm up the free-tier backend on load so the first question isn't a cold start.
  useEffect(() => {
    fetch(`${apiUrl}/health`).catch(() => {});
  }, []);

  const ask = async (question) => {
    if (!question.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setShowResponse(false);
    setResponse("");

    try {
      // A sleeping backend can take a while to wake; retry before giving up so it
      // answers instead of erroring. Short waits mean we reconnect within ~2s of
      // it coming up. Only network failures and 502/503/504 (Render's "waking up"
      // responses) are retried; any other error (e.g. a 500 from the API) fails
      // fast instead of spinning for ~80s.
      const res = await fetchWaking(`${apiUrl}/chat/stream`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      // Show the answer as it is written. The server sends server-sent events:
      // `text` for each piece of the answer, then `done` (or `error`).
      const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
      let buffer = "";
      let answer = "";
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += value;
        const events = buffer.split("\n\n");
        buffer = events.pop(); // keep a partial event for the next read
        for (const raw of events) {
          const event = raw.match(/^event: (.*)$/m)?.[1];
          const data = raw.match(/^data: (.*)$/m)?.[1];
          if (event === "error") throw new Error("Answer stream failed");
          if (event === "text" && data) {
            answer += JSON.parse(data).text;
            setResponse(answer);
            setShowResponse(true);
          }
        }
      }
      if (!answer) {
        setResponse("Got your message! Thanks for reaching out.");
        setShowResponse(true);
      }
      setPrompt("");
    } catch (error) {
      console.error("Error submitting prompt:", error);
      setResponse("Oops! Something went wrong. Please try again.");
      setShowResponse(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    ask(prompt);
  };

  const askSuggestion = (question) => {
    setPrompt(question); // show what was asked while it answers
    ask(question);
  };

  return (
    <div
      className="prompt-box-container"
    >
      <form onSubmit={handleSubmit} className="prompt-form">
        <div className="prompt-input-wrapper">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask me anything..."
            className="prompt-input"
            disabled={isSubmitting}
            maxLength={500}
          />
          <button
            type="submit"
            className={`prompt-submit-btn${isSubmitting ? " is-loading" : ""}`}
            disabled={isSubmitting || !prompt.trim()}
            aria-busy={isSubmitting}
            aria-label={
              !isSubmitting ? "Send" : showResponse ? "Writing answer" : "Thinking"
            }
          >
            {isSubmitting ? (
              <OrbitLoader writing={showResponse} />
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="send-icon"
              >
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            )}
          </button>
        </div>
      </form>

      <div className="prompt-suggestions" role="group" aria-label="Suggested questions">
        {SUGGESTIONS.map(({ label, question }) => (
          <button
            key={label}
            type="button"
            className="prompt-suggestion"
            onClick={() => askSuggestion(question)}
            disabled={isSubmitting}
            title={question}
          >
            {label}
          </button>
        ))}
      </div>

      {showResponse && (
        <div
          className="prompt-response"
        >
          <div className="response-content">
            <ReactMarkdown>{response}</ReactMarkdown>
          </div>
          <button
            className="close-response-btn"
            onClick={() => setShowResponse(false)}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
