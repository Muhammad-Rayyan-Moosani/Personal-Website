# ====================
# filename: embeddings.py
# ====================

"""
Lightweight text embeddings — no PyTorch.

Uses ChromaDB's built-in ONNX embedder (all-MiniLM-L6-v2 via onnxruntime,
which ChromaDB already installs). Same model as the old sentence-transformers
setup, but far smaller to install and to run.

The embedder is loaded once, lazily, and cached for the whole process so the
model is never loaded more than once.
"""

from functools import lru_cache
from typing import List

from chromadb.utils import embedding_functions


@lru_cache(maxsize=1)
def _embedder():
    """Load the ONNX MiniLM embedder once, then reuse it for every call."""
    return embedding_functions.DefaultEmbeddingFunction()


def embed_texts(texts: List[str]) -> List[List[float]]:
    """Embed a batch of documents -> a list of float vectors."""
    return [[float(x) for x in vec] for vec in _embedder()(texts)]


def embed_query(text: str) -> List[float]:
    """Embed a single query string -> one float vector."""
    return embed_texts([text])[0]
