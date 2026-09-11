# ====================
# filename: indexer.py
# ====================

"""
Indexing pipeline for converting markdown files into an in-memory vector index.
Handles document loading and heading-aware chunking; embedding + storage live in
the lightweight VectorStore (no external vector database).
"""

from pathlib import Path
from typing import List, Dict, Any

from config import settings
from vectorstore import VectorStore


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
        Split text into chunks, keeping each markdown section together.

        The knowledge base is structured with markdown headings, so we chunk by
        section: a full FAQ question-and-answer or a single role/project stays as
        one coherent unit, which makes semantic retrieval far more accurate.
        Sections longer than the chunk size fall back to character splitting.

        Args:
            text: The text to chunk
            metadata: Metadata to attach to each chunk

        Returns:
            List of dictionaries containing chunk text and metadata
        """
        chunks: List[Dict[str, Any]] = []
        for section in self._split_by_headings(text):
            section = section.strip()
            if not section:
                continue
            if len(section) <= int(self.chunk_size * 1.6):
                self._add_chunk(chunks, section, metadata)
            else:
                for sub in self._split_by_chars(section):
                    self._add_chunk(chunks, sub, metadata)

        if not chunks:  # headingless text: fall back to character splitting
            for sub in self._split_by_chars(text):
                self._add_chunk(chunks, sub, metadata)

        return chunks

    def _split_by_headings(self, text: str) -> List[str]:
        """Group text into sections that each begin at a level-2+ heading.

        A run of headings with no body text yet (e.g. a category heading
        immediately followed by a question) is kept with the section that
        follows, so each chunk carries its heading context.
        """
        def has_body(lines: List[str]) -> bool:
            return any(l.strip() and not l.strip().startswith("#") for l in lines)

        sections: List[str] = []
        current: List[str] = []
        for line in text.split("\n"):
            stripped = line.strip()
            hashes = len(stripped) - len(stripped.lstrip("#"))
            is_section_heading = hashes >= 2 and stripped[hashes:hashes + 1] == " "
            if is_section_heading and has_body(current):
                sections.append("\n".join(current))
                current = [line]
            else:
                current.append(line)
        if current:
            sections.append("\n".join(current))
        return sections

    def _split_by_chars(self, text: str) -> List[str]:
        """Character-based splitting with overlap, breaking on nearby boundaries."""
        parts: List[str] = []
        start = 0
        while start < len(text):
            end = start + self.chunk_size
            chunk = text[start:end]
            if end < len(text):
                break_point = max(chunk.rfind("."), chunk.rfind("\n"), chunk.rfind(" "))
                if break_point > self.chunk_size // 2:
                    chunk = chunk[:break_point + 1]
                    end = start + break_point + 1
            parts.append(chunk.strip())
            start = end - self.overlap
        return parts

    def _add_chunk(
        self, chunks: List[Dict[str, Any]], text: str, metadata: Dict[str, Any]
    ) -> None:
        chunk_metadata = metadata.copy()
        chunk_metadata["chunk_index"] = len(chunks)
        chunks.append({"text": text.strip(), "metadata": chunk_metadata})


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


def build_vector_store() -> VectorStore:
    """
    Build the in-memory vector index from the knowledge base.

    Loads all markdown documents, splits them into heading-aware chunks, embeds
    them (in small batches to keep memory low), and returns a ready VectorStore.
    The store also carries `num_documents` for reporting.

    Returns:
        A populated VectorStore.
    """
    loader = MarkdownLoader(settings.knowledge_dir)
    documents = loader.load_documents()

    chunker = DocumentChunker(
        chunk_size=settings.chunk_size,
        overlap=settings.chunk_overlap,
    )

    all_chunks: List[Dict[str, Any]] = []
    for doc in documents:
        all_chunks.extend(chunker.chunk_text(doc["text"], doc["metadata"]))

    store = VectorStore()
    store.build(all_chunks)
    store.num_documents = len(documents)
    return store


def main() -> None:
    """Build the index once and print stats (useful for local checks)."""
    print("Building in-memory vector index...")
    print(f"Knowledge directory: {settings.knowledge_dir}")
    store = build_vector_store()
    print("\nIndex built!")
    print(f"Documents processed: {store.num_documents}")
    print(f"Chunks created: {store.size}")


if __name__ == "__main__":
    main()
