# ====================
# filename: config.py
# ====================

"""
Configuration module for the personal AI assistant.
Loads environment variables and defines system constants.
"""

import os
from pathlib import Path
from typing import List
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    anthropic_api_key: str

    # Model configurations
    embedding_model: str = "all-MiniLM-L6-v2"
    claude_model: str = "claude-sonnet-4-5-20250929"

    # Chunking parameters
    chunk_size: int = 700
    chunk_overlap: int = 100

    # RAG parameters
    top_k_results: int = 6  # Number of final chunks to use
    fetch_k_multiplier: int = 3  # Fetch this many times top_k for diversity

    # Paths
    knowledge_dir: Path = Path(__file__).parent.parent / "knowledge"
    chroma_db_dir: Path = Path(__file__).parent.parent / "chroma_db"

    # Collection name
    collection_name: str = "rayyan_knowledge"

    # CORS settings
    allowed_origins: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "https://www.rayyanmoosani.com",
        "https://rayyanmoosani.com",
        "https://rayyanmoosani.onrender.com"
    ]

    @field_validator('allowed_origins', mode='before')
    @classmethod
    def parse_allowed_origins(cls, v):
        """Parse allowed origins from comma-separated string if needed."""
        if isinstance(v, str):
            return [origin.strip() for origin in v.split(',')]
        return v

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )


def get_settings() -> Settings:
    """Factory function to create settings instance."""
    return Settings()


# Global settings instance
settings = get_settings()
