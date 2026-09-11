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

from typing import List, Dict, Any

import numpy as np

from embeddings import embed_texts, embed_query


class VectorStore:
    """Holds L2-normalized chunk embeddings and answers similarity queries."""

    def __init__(self) -> None:
        self._matrix: np.ndarray | None = None  # (n, d), L2-normalized float32
        self._chunks: List[Dict[str, Any]] = []
        self.num_documents: int = 0

    def build(self, chunks: List[Dict[str, Any]]) -> int:
        """Embed and store chunks. Returns the number of chunks indexed."""
        self._chunks = list(chunks)
        if not self._chunks:
            self._matrix = None
            return 0

        vectors = np.asarray(
            embed_texts([c["text"] for c in self._chunks]), dtype=np.float32
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

        k = min(top_k, len(self._chunks))
        # Partial top-k, then sort those k by similarity (descending)
        top_idx = np.argpartition(-sims, k - 1)[:k]
        top_idx = top_idx[np.argsort(-sims[top_idx])]

        results: List[Dict[str, Any]] = []
        for i in top_idx:
            chunk = self._chunks[int(i)]
            results.append({
                "text": chunk["text"],
                "metadata": chunk["metadata"],
                "distance": float(1.0 - sims[int(i)]),  # cosine distance
            })
        return results

    @property
    def size(self) -> int:
        return len(self._chunks)
