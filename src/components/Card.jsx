// src/components/Card.jsx
import React from "react";
import "./StyleSheet.css";

export default function Card({ title, role, description, date, link }) {
  return (
    <div className="card">
      {link ? (
        <h2 className="card-title">
          <a href={link} target="_blank" rel="noopener noreferrer">
            {title}
          </a>
        </h2>
      ) : (
        <h2 className="card-title">{title}</h2>
      )}
      <h3 className="card-role">{role}</h3>
      {date && <p className="card-date">{date}</p>}
      <p className="card-description">{description}</p>
    </div>
  );
}