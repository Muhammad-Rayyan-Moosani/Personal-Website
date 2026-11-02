# ====================
# filename: knowledge.py
# ====================

"""
Loads the whole knowledge base as one block of text for the system prompt.

The knowledge base is small (~45 KB, ~11k tokens), so instead of embedding and
retrieving chunks we give Claude every file on every request and let prompt
caching make the repeated prefix cheap and fast. This removes the embedding
model entirely, so the server starts in about a second and every answer can
see every role and project.
"""

from pathlib import Path
from typing import List

from config import settings


def load_knowledge(knowledge_dir: Path = None) -> str:
    """
    Read every markdown file in the knowledge directory into one string.

    Files are sorted by name so the text is byte-identical across restarts,
    which keeps the prompt cache valid.

    Returns:
        The knowledge base, each file wrapped in a <document> tag.

    Raises:
        FileNotFoundError: If the knowledge directory doesn't exist
        ValueError: If it contains no markdown files
    """
    knowledge_dir = knowledge_dir or settings.knowledge_dir
    if not knowledge_dir.exists():
        raise FileNotFoundError(f"Knowledge directory not found: {knowledge_dir}")

    files = sorted(knowledge_dir.glob("*.md"))
    if not files:
        raise ValueError(f"No markdown files found in {knowledge_dir}")

    documents: List[str] = []
    for file_path in files:
        content = file_path.read_text(encoding="utf-8").strip()
        if content:
            documents.append(f'<document source="{file_path.name}">\n{content}\n</document>')

    return "\n\n".join(documents)


def main() -> None:
    """Print knowledge base stats (useful for local checks)."""
    text = load_knowledge()
    print(f"Knowledge directory: {settings.knowledge_dir}")
    print(f"Documents: {text.count('<document ')}")
    print(f"Characters: {len(text)} (~{len(text) // 4} tokens)")


if __name__ == "__main__":
    main()
