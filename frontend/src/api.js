// Backend base URL, shared by the chat and the contact form. Prefer an explicit
// build-time URL; otherwise use localhost in dev and the deployed backend in
// production (so prod never falls back to localhost:8000).
export const API_URL =
  import.meta.env.VITE_API_URL ||
  (typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:8000"
    : "https://rayyan-ai.onrender.com");

// Render's free tier sleeps; while it wakes, requests fail at the network level
// or get 502/503/504. Retry those (every 2s, up to `tries`) and nothing else.
export async function fetchWaking(url, options, tries = 40) {
  for (let attempt = 0; ; attempt++) {
    let res;
    try {
      res = await fetch(url, options);
    } catch (err) {
      if (attempt >= tries) throw err;
      await new Promise((r) => setTimeout(r, 2000));
      continue;
    }
    if ([502, 503, 504].includes(res.status) && attempt < tries) {
      await new Promise((r) => setTimeout(r, 2000));
      continue;
    }
    return res;
  }
}
