import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import "./PromptBox.css";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function PromptBox() {
  const [prompt, setPrompt] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [response, setResponse] = useState("");
  const [showResponse, setShowResponse] = useState(false);
  const [waking, setWaking] = useState(false);

  // Warm up the free-tier backend on load so the first question isn't a cold start.
  useEffect(() => {
    fetch(`${apiUrl}/health`).catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsSubmitting(true);
    setShowResponse(false);

    // The backend runs on a free tier that can cold-start; hint if it's slow.
    const wakingTimer = setTimeout(() => setWaking(true), 3000);

    try {
      const res = await fetch(`${apiUrl}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: prompt }),
      });

      const data = await res.json();
      setResponse(data.answer || "Got your message! Thanks for reaching out.");
      setShowResponse(true);
      setPrompt("");
    } catch (error) {
      console.error("Error submitting prompt:", error);
      setResponse("Oops! Something went wrong. Please try again.");
      setShowResponse(true);
    } finally {
      clearTimeout(wakingTimer);
      setWaking(false);
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

      {waking && !showResponse && (
        <div
          className="waking-note"
          style={{ marginTop: "10px", fontSize: "0.85rem", opacity: 0.75, textAlign: "center" }}
        >
          Waking the assistant… first request after idle can take ~30s.
        </div>
      )}

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
