import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import "./PromptBox.css";

// Prefer an explicit build-time URL; otherwise use localhost in dev and the
// deployed backend in production (so prod never falls back to localhost:8000).
const apiUrl =
  import.meta.env.VITE_API_URL ||
  (typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:8000"
    : "https://rayyan-ai.onrender.com");

export default function PromptBox() {
  const [prompt, setPrompt] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [response, setResponse] = useState("");
  const [showResponse, setShowResponse] = useState(false);

  // Warm up the free-tier backend on load so the first question isn't a cold start.
  useEffect(() => {
    fetch(`${apiUrl}/health`).catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsSubmitting(true);
    setShowResponse(false);

    try {
      // Free-tier backend can cold-start (~30-50s); retry a few times before giving up
      // so a sleeping server answers instead of erroring.
      // Only network failures and 502/503/504 (Render's "waking up" responses) are
      // retried; any other error (e.g. a 500 from the API) fails fast instead of
      // spinning for ~80s.
      let data;
      for (let attempt = 0; ; attempt++) {
        let res;
        try {
          res = await fetch(`${apiUrl}/chat`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ question: prompt }),
          });
        } catch (err) {
          if (attempt >= 12) throw err; // cover a full free-tier cold start (~80s)
          await new Promise((r) => setTimeout(r, 7000));
          continue;
        }
        if ([502, 503, 504].includes(res.status) && attempt < 12) {
          await new Promise((r) => setTimeout(r, 7000));
          continue;
        }
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        data = await res.json();
        break;
      }
      setResponse(data.answer || "Got your message! Thanks for reaching out.");
      setShowResponse(true);
      setPrompt("");
    } catch (error) {
      console.error("Error submitting prompt:", error);
      setResponse("Oops! Something went wrong. Please try again.");
      setShowResponse(true);
    } finally {
      setIsSubmitting(false);
    }
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
            className="prompt-submit-btn"
            disabled={isSubmitting || !prompt.trim()}
          >
            {isSubmitting ? (
              <span className="spinner"></span>
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
