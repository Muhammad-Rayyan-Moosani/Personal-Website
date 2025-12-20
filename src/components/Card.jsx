import { useEffect, useRef, useState } from "react";

export default function Card({ title, bullets = [], description, date, link }) {
  const ref = useRef(null);
  const [visibleCount, setVisibleCount] = useState(0);

  const hasBullets = bullets && bullets.length > 0;

  useEffect(() => {
    if (!hasBullets) return;

    let timeout;
    let index = 0;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const reveal = () => {
            setVisibleCount(v => Math.min(v + 1, bullets.length));
            index++;
            if (index < bullets.length) {
              timeout = setTimeout(reveal, 140);
            }
          };
          reveal();
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);

    return () => {
      observer.disconnect();
      clearTimeout(timeout);
    };
  }, [bullets, hasBullets]);

  return (
    <div className="card" ref={ref}>
      <h3 className="card-title">
        <a href={link} target="_blank" rel="noreferrer">{title}</a>
      </h3>

      <p className="card-date">{date}</p>

      {hasBullets ? (
        <ul className="card-bullets">
          {bullets.slice(0, visibleCount).map((b, i) => (
            <li key={i} className="bullet">{b}</li>
          ))}
        </ul>
      ) : (
        <p className="card-description">{description}</p>
      )}
    </div>
  );
}