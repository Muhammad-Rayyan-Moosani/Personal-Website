import React, { useState } from "react";
import { motion } from "framer-motion";
import "./PromptBox.css";

export default function PromptBox() {
  const [prompt, setPrompt] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [response, setResponse] = useState("");
  const [showResponse, setShowResponse] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsSubmitting(true);
    setShowResponse(false);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
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
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  return (
    <motion.div
      className="prompt-box-container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
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
        <motion.div
          className="prompt-response"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <p>{response}</p>
          <button
            className="close-response-btn"
            onClick={() => setShowResponse(false)}
          >
            ✕
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}
