# ====================
# filename: rag.py
# ====================

"""
Retrieval-Augmented Generation (RAG) pipeline.
Handles query processing, context retrieval, and Claude API integration.
"""

from typing import List, Dict, Any, Optional

import chromadb
from chromadb.config import Settings as ChromaSettings
from sentence_transformers import SentenceTransformer
from anthropic import Anthropic

from config import settings


class ContextRetriever:
    """Retrieves relevant context from the vector database."""

    def __init__(self):
        """Initialize the retriever with embedding model and database connection."""
        self.embedding_model = SentenceTransformer(settings.embedding_model)

        # Connect to ChromaDB
        self.client = chromadb.PersistentClient(
            path=str(settings.chroma_db_dir),
            settings=ChromaSettings(anonymized_telemetry=False)
        )

        # Get collection
        try:
            self.collection = self.client.get_collection(name=settings.collection_name)
        except Exception as e:
            raise RuntimeError(
                f"Collection '{settings.collection_name}' not found. "
                f"Please run indexer first. Error: {e}"
            )

    def retrieve(self, query: str, top_k: int = None) -> List[Dict[str, Any]]:
        """
        Retrieve most relevant chunks for a query using MMR-like approach.

        Retrieves more candidates (fetch_k) then selects top_k diverse results
        to avoid redundancy and improve coverage.

        Args:
            query: User's question
            top_k: Number of final results to return (defaults to settings.top_k_results)

        Returns:
            List of dictionaries containing retrieved chunks and metadata
        """
        if top_k is None:
            top_k = settings.top_k_results

        # Fetch more candidates for diversity (similar to fetch_k in MMR)
        fetch_k = top_k * settings.fetch_k_multiplier

        # Generate query embedding
        query_embedding = self.embedding_model.encode(
            query,
            convert_to_numpy=True
        ).tolist()

        # Query ChromaDB for more results
        results = self.collection.query(
            query_embeddings=[query_embedding],
            n_results=fetch_k,
            include=["documents", "metadatas", "distances"]
        )

        # Format all candidates
        all_chunks = []
        for i in range(len(results["ids"][0])):
            all_chunks.append({
                "text": results["documents"][0][i],
                "metadata": results["metadatas"][0][i],
                "distance": results["distances"][0][i]
            })

        # Apply diversity selection (MMR-like)
        selected_chunks = self._select_diverse_chunks(all_chunks, top_k)

        return selected_chunks

    def _select_diverse_chunks(
        self,
        chunks: List[Dict[str, Any]],
        k: int
    ) -> List[Dict[str, Any]]:
        """
        Select diverse chunks to avoid redundancy (MMR-like approach).

        Args:
            chunks: All candidate chunks sorted by relevance
            k: Number of chunks to select

        Returns:
            List of k diverse chunks
        """
        if len(chunks) <= k:
            return chunks

        # Always include the top result (most relevant)
        selected = [chunks[0]]
        remaining = chunks[1:]

        # Select k-1 more chunks that are diverse
        while len(selected) < k and remaining:
            # Find chunk that is least similar to already selected ones
            best_idx = 0
            best_score = -float('inf')

            for idx, candidate in enumerate(remaining):
                # Simple diversity: prefer chunks from different sources
                is_different_source = all(
                    candidate["metadata"].get("filename") != s["metadata"].get("filename")
                    for s in selected
                )

                # Calculate diversity score
                # Higher distance = more relevant, prefer different sources
                diversity_bonus = 0.3 if is_different_source else 0
                score = -candidate["distance"] + diversity_bonus

                if score > best_score:
                    best_score = score
                    best_idx = idx

            selected.append(remaining.pop(best_idx))

        return selected


class ClaudeRAG:
    """Orchestrates RAG pipeline with Claude."""

    def __init__(self):
        """Initialize the RAG system with retriever and Claude client."""
        self.retriever = ContextRetriever()
        self.anthropic_client = Anthropic(api_key=settings.anthropic_api_key)

    def _build_system_prompt(self) -> str:
        """
        Build the system prompt for Claude.

        Returns:
            System prompt string
        """
        return """You are an AI assistant representing Rayyan Moosani, a University of Waterloo Computer Science student.

Your role is to answer questions about Rayyan based ONLY on the provided context from his personal knowledge base.

Guidelines:
- Always respond in third person when referring to Rayyan
- Only use information from the provided context
- If the answer is not in the context, politely say you don't have that information
- Be professional, friendly, and concise
- Do not make up or infer information not present in the context
- If asked about topics unrelated to Rayyan, politely redirect to relevant topics"""

    def _build_user_prompt(self, query: str, context_chunks: List[Dict[str, Any]]) -> str:
        """
        Build the user prompt with context and question.

        Args:
            query: User's question
            context_chunks: Retrieved context chunks

        Returns:
            Formatted user prompt
        """
        # Format context
        context_parts = []
        for i, chunk in enumerate(context_chunks, 1):
            source = chunk["metadata"].get("title", chunk["metadata"].get("filename", "Unknown"))
            context_parts.append(f"[Context {i} - Source: {source}]\n{chunk['text']}\n")

        context_block = "\n".join(context_parts)

        return f"""Context:
{context_block}

Question:
{query}

Please provide a helpful answer based on the context above."""

    def _is_off_topic(self, query: str) -> bool:
        """
        Basic check for obviously off-topic queries.

        Args:
            query: User's question

        Returns:
            True if query is clearly off-topic
        """
        off_topic_keywords = [
            "weather", "stock market", "recipe", "movie",
            "sports score", "news", "latest", "current events"
        ]
        query_lower = query.lower()
        return any(keyword in query_lower for keyword in off_topic_keywords)

    def query(
        self,
        question: str,
        max_tokens: int = 1024,
        temperature: float = 0.7
    ) -> Dict[str, Any]:
        """
        Process a user question through the RAG pipeline.

        Args:
            question: User's question
            max_tokens: Maximum tokens in response
            temperature: Claude temperature parameter

        Returns:
            Dictionary containing answer and metadata

        Raises:
            ValueError: If question is empty or invalid
            RuntimeError: If Claude API call fails
        """
        if not question or not question.strip():
            raise ValueError("Question cannot be empty")

        # Basic off-topic filtering
        if self._is_off_topic(question):
            return {
                "answer": "I'm here to answer questions about Rayyan Moosani. Please ask about his education, projects, skills, experience, or achievements.",
                "sources": [],
                "context_used": False
            }

        # Retrieve context
        try:
            context_chunks = self.retriever.retrieve(question)
        except Exception as e:
            raise RuntimeError(f"Failed to retrieve context: {e}")

        if not context_chunks:
            return {
                "answer": "I don't have enough information to answer that question about Rayyan.",
                "sources": [],
                "context_used": False
            }

        # Build prompts
        system_prompt = self._build_system_prompt()
        user_prompt = self._build_user_prompt(question, context_chunks)

        # Call Claude API
        try:
            response = self.anthropic_client.messages.create(
                model=settings.claude_model,
                max_tokens=max_tokens,
                temperature=temperature,
                system=system_prompt,
                messages=[
                    {
                        "role": "user",
                        "content": user_prompt
                    }
                ]
            )

            answer = response.content[0].text

            # Extract sources
            sources = []
            seen_sources = set()
            for chunk in context_chunks:
                source_info = {
                    "title": chunk["metadata"].get("title", ""),
                    "filename": chunk["metadata"].get("filename", "")
                }
                source_key = f"{source_info['filename']}-{source_info['title']}"
                if source_key not in seen_sources:
                    sources.append(source_info)
                    seen_sources.add(source_key)

            return {
                "answer": answer,
                "sources": sources,
                "context_used": True,
                "num_chunks_retrieved": len(context_chunks)
            }

        except Exception as e:
            raise RuntimeError(f"Claude API call failed: {e}")


def create_rag_system() -> ClaudeRAG:
    """
    Factory function to create a RAG system instance.

    Returns:
        Initialized ClaudeRAG instance
    """
    return ClaudeRAG()
