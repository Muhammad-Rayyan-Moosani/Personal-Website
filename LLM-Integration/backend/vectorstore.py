# ====================
# filename: vectorstore.py
# ====================

"""
Lightweight in-memory vector store.

The knowledge base is tiny (dozens of short chunks), so a full vector database
is unnecessary. We embed chunks with the ONNX embedder and do exact cosine
search with a single NumPy matrix multiply. This keeps the memory footprint
small enough for constrained free-tier hosts (no chromadb / grpc / onnxruntime
arena overhead beyond the embedder itself).
"""

import re
from typing import List, Dict, Any

import numpy as np

from embeddings import embed_texts, embed_query

# Filler words ignored when lexically matching a query to chunks, so the keyword
# boost keys off distinctive terms (project names, tech) rather than common words.
_STOPWORDS = {
    "the", "and", "for", "what", "did", "does", "do", "is", "are", "was", "were",
    "in", "at", "on", "of", "to", "an", "his", "him", "with", "how", "why", "you",
    "your", "me", "tell", "about", "can", "could", "would", "give", "show", "has",
    "have", "built", "build", "work", "worked", "working", "rayyan", "moosani",
    "project", "projects", "experience", "that", "this", "it", "any",
}


class VectorStore:
    """Holds L2-normalized chunk embeddings and answers similarity queries."""

    def __init__(self) -> None:
        self._matrix: np.ndarray | None = None  # (n, d), L2-normalized float32
        self._chunks: List[Dict[str, Any]] = []
        self.num_documents: int = 0

    def build(self, chunks: List[Dict[str, Any]]) -> int:
        """Embed and store chunks. Returns the number of chunks indexed."""
        # Drop empty/whitespace chunks: they embed to a zero-length vector, which
        # makes the stacked matrix ragged and crashes the whole index build.
        self._chunks = [c for c in chunks if c.get("text", "").strip()]
        if not self._chunks:
            self._matrix = None
            return 0

        raw = embed_texts([c["text"] for c in self._chunks])
        vectors = np.vstack(
            [np.asarray(v, dtype=np.float32).reshape(-1) for v in raw]
        )
        norms = np.linalg.norm(vectors, axis=1, keepdims=True)
        norms[norms == 0] = 1.0
        self._matrix = vectors / norms
        return len(self._chunks)

    def search(self, query: str, top_k: int) -> List[Dict[str, Any]]:
        """Return the top_k most similar chunks (with a cosine `distance`)."""
        if self._matrix is None or not self._chunks or top_k <= 0:
            return []

        q = np.asarray(embed_query(query), dtype=np.float32)
        q_norm = float(np.linalg.norm(q)) or 1.0
        sims = self._matrix @ (q / q_norm)

        # Hybrid retrieval: add a lexical boost so chunks that literally contain the
        # query's distinctive terms (e.g. a project name like "WorkAssist") surface
        # even when the small embedding model ranks them low semantically.
        scores = sims + self._keyword_boost(query)

        k = min(top_k, len(self._chunks))
        # Partial top-k, then sort those k by combined score (descending)
        top_idx = np.argpartition(-scores, k - 1)[:k]
        top_idx = top_idx[np.argsort(-scores[top_idx])]

        results: List[Dict[str, Any]] = []
        for i in top_idx:
            chunk = self._chunks[int(i)]
            results.append({
                "text": chunk["text"],
                "metadata": chunk["metadata"],
                # distance reflects the combined score so the downstream diversity
                # step respects the keyword match, not just cosine similarity.
                "distance": float(1.0 - scores[int(i)]),
            })
        return results

    def _keyword_boost(self, query: str) -> np.ndarray:
        """Fraction of the query's distinctive terms present in each chunk, scaled.

        Up to +0.4 when a chunk contains every distinctive query term — enough to
        pull a named project's chunk into the results even on a weak embedding match.
        """
        terms = {
            t for t in re.findall(r"[a-z0-9]+", query.lower())
            if len(t) > 2 and t not in _STOPWORDS
        }
        if not terms:
            return np.zeros(len(self._chunks), dtype=np.float32)
        frac = np.array(
            [
                sum(1 for t in terms if t in c["text"].lower()) / len(terms)
                for c in self._chunks
            ],
            dtype=np.float32,
        )
        return 0.4 * frac

    @property
    def size(self) -> int:
        return len(self._chunks)
