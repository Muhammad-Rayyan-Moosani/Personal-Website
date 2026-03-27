# ====================
# filename: indexer.py
# ====================

"""
Indexing pipeline for converting markdown files into vector embeddings.
Handles document loading, chunking, embedding generation, and storage in ChromaDB.
"""

import hashlib
import json
from pathlib import Path
from typing import List, Dict, Any

import chromadb
from chromadb.config import Settings as ChromaSettings
from sentence_transformers import SentenceTransformer

from config import settings


class DocumentChunker:
    """Handles splitting documents into manageable chunks."""

    def __init__(self, chunk_size: int = 700, overlap: int = 100):
        """
        Initialize the chunker.

        Args:
            chunk_size: Maximum number of characters per chunk
            overlap: Number of characters to overlap between chunks
        """
        self.chunk_size = chunk_size
        self.overlap = overlap

    def chunk_text(self, text: str, metadata: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        Split text into overlapping chunks.

        Args:
            text: The text to chunk
            metadata: Metadata to attach to each chunk

        Returns:
            List of dictionaries containing chunk text and metadata
        """
        chunks = []
        start = 0

        while start < len(text):
            end = start + self.chunk_size
            chunk_text = text[start:end]

            # Try to break at a sentence or word boundary
            if end < len(text):
                last_period = chunk_text.rfind(".")
                last_newline = chunk_text.rfind("\n")
                last_space = chunk_text.rfind(" ")

                break_point = max(last_period, last_newline, last_space)
                if break_point > self.chunk_size // 2:
                    chunk_text = chunk_text[:break_point + 1]
                    end = start + break_point + 1

            chunk_metadata = metadata.copy()
            chunk_metadata["chunk_index"] = len(chunks)
            chunk_metadata["char_start"] = start
            chunk_metadata["char_end"] = end

            chunks.append({
                "text": chunk_text.strip(),
                "metadata": chunk_metadata
            })

            start = end - self.overlap

        return chunks


class MarkdownLoader:
    """Loads and parses markdown files from the knowledge directory."""

    def __init__(self, knowledge_dir: Path):
        """
        Initialize the loader.

        Args:
            knowledge_dir: Path to directory containing markdown files
        """
        self.knowledge_dir = knowledge_dir

    def load_documents(self) -> List[Dict[str, Any]]:
        """
        Load all markdown files from the knowledge directory.

        Returns:
            List of dictionaries containing document text and metadata

        Raises:
            FileNotFoundError: If knowledge directory doesn't exist
        """
        if not self.knowledge_dir.exists():
            raise FileNotFoundError(f"Knowledge directory not found: {self.knowledge_dir}")

        documents = []
        markdown_files = list(self.knowledge_dir.glob("*.md"))

        if not markdown_files:
            raise ValueError(f"No markdown files found in {self.knowledge_dir}")

        for file_path in markdown_files:
            with open(file_path, "r", encoding="utf-8") as f:
                content = f.read()

            # Extract title from first heading if present
            title = file_path.stem.replace("_", " ").title()
            lines = content.split("\n")
            if lines and lines[0].startswith("#"):
                title = lines[0].lstrip("#").strip()

            documents.append({
                "text": content,
                "metadata": {
                    "filename": file_path.name,
                    "title": title,
                    "source": str(file_path)
                }
            })

        return documents


class VectorIndexer:
    """Manages vector embeddings and ChromaDB storage."""

    def __init__(self):
        """Initialize the indexer with embedding model and database."""
        self.embedding_model = SentenceTransformer(settings.embedding_model)
        self.chunker = DocumentChunker(
            chunk_size=settings.chunk_size,
            overlap=settings.chunk_overlap
        )

        # Initialize ChromaDB
        settings.chroma_db_dir.mkdir(parents=True, exist_ok=True)
        self.client = chromadb.PersistentClient(
            path=str(settings.chroma_db_dir),
            settings=ChromaSettings(anonymized_telemetry=False)
        )

    def _compute_corpus_hash(self, documents: List[Dict[str, Any]]) -> str:
        """
        Compute hash of all document contents to detect changes.

        Args:
            documents: List of documents

        Returns:
            SHA256 hash of concatenated document texts
        """
        combined = "".join([doc["text"] for doc in documents])
        return hashlib.sha256(combined.encode()).hexdigest()

    def _get_stored_hash(self) -> str:
        """
        Retrieve stored corpus hash from metadata file.

        Returns:
            Stored hash or empty string if not found
        """
        hash_file = settings.chroma_db_dir / "corpus_hash.json"
        if hash_file.exists():
            with open(hash_file, "r") as f:
                data = json.load(f)
                return data.get("hash", "")
        return ""

    def _save_hash(self, corpus_hash: str) -> None:
        """
        Save corpus hash to metadata file.

        Args:
            corpus_hash: Hash to save
        """
        hash_file = settings.chroma_db_dir / "corpus_hash.json"
        with open(hash_file, "w") as f:
            json.dump({"hash": corpus_hash}, f)

    def needs_reindexing(self, documents: List[Dict[str, Any]]) -> bool:
        """
        Check if documents have changed and reindexing is needed.

        Args:
            documents: Current documents

        Returns:
            True if reindexing needed, False otherwise
        """
        current_hash = self._compute_corpus_hash(documents)
        stored_hash = self._get_stored_hash()
        return current_hash != stored_hash

    def index_documents(self, force: bool = False) -> Dict[str, Any]:
        """
        Index all documents from the knowledge directory.

        Args:
            force: Force reindexing even if documents haven't changed

        Returns:
            Dictionary containing indexing statistics

        Raises:
            Exception: If indexing fails
        """
        loader = MarkdownLoader(settings.knowledge_dir)
        documents = loader.load_documents()

        if not force and not self.needs_reindexing(documents):
            return {
                "status": "skipped",
                "reason": "Documents unchanged",
                "total_documents": len(documents)
            }

        # Delete existing collection and recreate
        try:
            self.client.delete_collection(name=settings.collection_name)
        except Exception:
            pass

        collection = self.client.create_collection(
            name=settings.collection_name,
            metadata={"hnsw:space": "cosine"}
        )

        # Process documents
        all_chunks = []
        for doc in documents:
            chunks = self.chunker.chunk_text(doc["text"], doc["metadata"])
            all_chunks.extend(chunks)

        # Generate embeddings
        texts = [chunk["text"] for chunk in all_chunks]
        embeddings = self.embedding_model.encode(
            texts,
            show_progress_bar=True,
            convert_to_numpy=True
        ).tolist()

        # Prepare data for ChromaDB
        ids = [f"chunk_{i}" for i in range(len(all_chunks))]
        metadatas = [chunk["metadata"] for chunk in all_chunks]

        # Add to collection
        collection.add(
            ids=ids,
            embeddings=embeddings,
            documents=texts,
            metadatas=metadatas
        )

        # Save hash
        corpus_hash = self._compute_corpus_hash(documents)
        self._save_hash(corpus_hash)

        return {
            "status": "success",
            "total_documents": len(documents),
            "total_chunks": len(all_chunks),
            "collection_name": settings.collection_name
        }


def main() -> None:
    """Main entry point for running indexer as a script."""
    print("Starting indexing pipeline...")
    print(f"Knowledge directory: {settings.knowledge_dir}")
    print(f"Database directory: {settings.chroma_db_dir}")

    indexer = VectorIndexer()
    result = indexer.index_documents(force=True)

    print("\nIndexing complete!")
    print(f"Status: {result['status']}")
    print(f"Documents processed: {result['total_documents']}")
    print(f"Chunks created: {result['total_chunks']}")
    print(f"Collection name: {result['collection_name']}")


if __name__ == "__main__":
    main()
