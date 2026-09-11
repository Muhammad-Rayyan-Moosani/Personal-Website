# ====================
# filename: main.py
# ====================

"""
FastAPI application for Rayyan's personal AI assistant.
Provides REST API endpoints for querying the knowledge base.
"""

import logging
from contextlib import asynccontextmanager
from typing import Any, Dict

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from config import settings
from rag import create_rag_system, ClaudeRAG

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


# Global RAG system instance
rag_system: ClaudeRAG = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifecycle manager for FastAPI application.
    Handles startup and shutdown logic.
    """
    global rag_system

    logger.info("Starting up Personal AI Assistant API...")

    # Build the in-memory index and initialize the RAG system
    try:
        logger.info("Building knowledge index...")
        rag_system = create_rag_system()
        logger.info(
            f"RAG system ready: {rag_system.num_chunks} chunks "
            f"from {rag_system.num_documents} documents"
        )
    except Exception as e:
        logger.error(f"Failed to initialize RAG system: {e}")
        rag_system = None

    logger.info("API startup complete")

    yield

    # Shutdown
    logger.info("Shutting down Personal AI Assistant API...")


# Initialize FastAPI app
app = FastAPI(
    title="Rayyan's Personal AI Assistant",
    description="API for querying Rayyan Moosani's personal knowledge base using RAG and Claude",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Request/Response Models
class ChatRequest(BaseModel):
    """Request model for chat endpoint."""

    question: str = Field(
        ...,
        min_length=1,
        max_length=1000,
        description="Question to ask about Rayyan",
        examples=["What projects has Rayyan built?"]
    )
    max_tokens: int = Field(
        default=1024,
        ge=100,
        le=4096,
        description="Maximum tokens in response"
    )
    temperature: float = Field(
        default=0.7,
        ge=0.0,
        le=1.0,
        description="Response temperature"
    )


class SourceInfo(BaseModel):
    """Information about a source document."""

    title: str
    filename: str


class ChatResponse(BaseModel):
    """Response model for chat endpoint."""

    answer: str = Field(..., description="Claude's answer to the question")
    sources: list[SourceInfo] = Field(
        default=[],
        description="List of source documents used"
    )
    context_used: bool = Field(
        ...,
        description="Whether context from knowledge base was used"
    )
    num_chunks_retrieved: int = Field(
        default=0,
        description="Number of context chunks retrieved"
    )


class HealthResponse(BaseModel):
    """Response model for health check endpoint."""

    status: str
    rag_initialized: bool
    collection_name: str


class IndexingResponse(BaseModel):
    """Response model for indexing endpoint."""

    status: str
    message: str
    total_documents: int
    total_chunks: int


# API Endpoints
@app.get(
    "/",
    summary="Root endpoint",
    response_model=Dict[str, Any]
)
async def root() -> Dict[str, Any]:
    """Root endpoint returning basic API information."""
    return {
        "message": "Welcome to Rayyan's Personal AI Assistant API",
        "version": "1.0.0",
        "endpoints": {
            "health": "/health",
            "chat": "/chat",
            "reindex": "/reindex"
        }
    }


@app.get(
    "/health",
    summary="Health check",
    response_model=HealthResponse,
    status_code=status.HTTP_200_OK
)
async def health_check() -> HealthResponse:
    """
    Health check endpoint.
    Returns API status and RAG system initialization state.
    """
    return HealthResponse(
        status="healthy" if rag_system else "unhealthy",
        rag_initialized=rag_system is not None,
        collection_name=settings.collection_name
    )


@app.post(
    "/chat",
    summary="Ask a question",
    response_model=ChatResponse,
    status_code=status.HTTP_200_OK
)
async def chat(request: ChatRequest) -> ChatResponse:
    """
    Main chat endpoint for asking questions about Rayyan.

    Args:
        request: ChatRequest containing the question and parameters

    Returns:
        ChatResponse with answer and source information

    Raises:
        HTTPException: If RAG system not initialized or query fails
    """
    if not rag_system:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="RAG system not initialized. Please check logs and ensure knowledge base is indexed."
        )

    try:
        result = rag_system.query(
            question=request.question,
            max_tokens=request.max_tokens,
            temperature=request.temperature
        )

        return ChatResponse(**result)

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except RuntimeError as e:
        logger.error(f"Query failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Query processing failed: {e}"
        )
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred"
        )


@app.post(
    "/reindex",
    summary="Trigger reindexing",
    response_model=IndexingResponse,
    status_code=status.HTTP_200_OK
)
async def reindex() -> IndexingResponse:
    """
    Trigger manual reindexing of the knowledge base.
    Forces a complete rebuild of the vector database.

    Returns:
        IndexingResponse with indexing statistics

    Raises:
        HTTPException: If indexing fails
    """
    global rag_system

    try:
        logger.info("Manual reindexing triggered")

        # Rebuild the in-memory index and reinitialize the RAG system
        rag_system = create_rag_system()
        logger.info("RAG system reinitialized after reindexing")

        return IndexingResponse(
            status="success",
            message="Knowledge base reindexed successfully",
            total_documents=rag_system.num_documents,
            total_chunks=rag_system.num_chunks
        )

    except FileNotFoundError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Reindexing failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Reindexing failed: {e}"
        )


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
