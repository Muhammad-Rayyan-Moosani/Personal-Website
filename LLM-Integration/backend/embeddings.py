# ====================
# filename: embeddings.py
# ====================

"""
Lightweight text embeddings — no PyTorch, no chromadb.

Uses fastembed's ONNX all-MiniLM-L6-v2 model. Embedding is done in small
batches on a single thread to keep peak memory low enough for constrained
free-tier hosts. The model is loaded once, lazily, and cached per process.
"""

from functools import lru_cache
from typing import List

from fastembed import TextEmbedding

from config import settings

# Small batches + single thread keep the transient memory spike well under
# constrained memory limits (large batches are what push ONNX over the edge).
_BATCH_SIZE = 4


@lru_cache(maxsize=1)
def _model() -> TextEmbedding:
    """Load the ONNX embedder once, then reuse it for every call."""
    return TextEmbedding(model_name=settings.embedding_model, threads=1)


def embed_texts(texts: List[str]) -> List[List[float]]:
    """Embed a batch of documents -> a list of float vectors."""
    if not texts:
        return []
    return [vec.tolist() for vec in _model().embed(list(texts), batch_size=_BATCH_SIZE)]


def embed_query(text: str) -> List[float]:
    """Embed a single query string -> one float vector."""
    return next(iter(_model().embed([text]))).tolist()
