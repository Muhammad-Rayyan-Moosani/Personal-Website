# ====================
# filename: config.py
# ====================

"""
Configuration module for the personal AI assistant.
Loads environment variables and defines system constants.
"""

import os
from pathlib import Path
from typing import List, Optional
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    anthropic_api_key: str

    # Model configuration. Haiku starts streaming its answer in well under a
    # second, which keeps the chat feeling instant.
    claude_model: str = "claude-haiku-5-5"

    # Contact form (contact.py). Messages are emailed through Resend's API; the
    # form stays switched off until RESEND_API_KEY is set. Resend's shared
    # onboarding sender can only deliver to the email on the Resend account.
    resend_api_key: Optional[str] = None
    contact_to_email: str = "mrayyanm411@gmail.com"
    contact_from: str = "Portfolio Contact Form <onboarding@resend.dev>"

    # Paths
    knowledge_dir: Path = Path(__file__).parent.parent / "knowledge"

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
