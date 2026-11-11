# ====================
# filename: main.py
# ====================

"""
FastAPI application for Rayyan's personal AI assistant.
Provides REST API endpoints for querying the knowledge base.
"""

import json
import logging
from contextlib import asynccontextmanager
from typing import Any, AsyncIterator, Dict

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field

from config import settings
from rag import create_rag_system, ClaudeRAG
from contact import router as contact_router

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

    # Load the knowledge base (just reading a few markdown files: instant)
    try:
        rag_system = create_rag_system()
        logger.info(
            f"RAG system ready: {rag_system.num_documents} documents, "
            f"model {settings.claude_model}"
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
    description="API for querying Rayyan Moosani's personal knowledge base with Claude",
    version="2.0.0",
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


# Contact form endpoint (POST /contact)
app.include_router(contact_router)


# Request/Response Models
class ChatRequest(BaseModel):
    """Request model for chat endpoints."""

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


class ChatResponse(BaseModel):
    """Response model for chat endpoint."""

    answer: str = Field(..., description="Claude's answer to the question")
    context_used: bool = Field(
        ...,
        description="Whether the knowledge base was used"
    )


class HealthResponse(BaseModel):
    """Response model for health check endpoint."""

    status: str
    rag_initialized: bool


class IndexingResponse(BaseModel):
    """Response model for indexing endpoint."""

    status: str
    message: str
    total_documents: int


def _require_rag() -> ClaudeRAG:
    """Return the RAG system, or raise 503 if it failed to start."""
    if not rag_system:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="RAG system not initialized. Please check logs and ensure the knowledge base exists."
        )
    return rag_system


def _sse(event: str, data: Dict[str, Any]) -> str:
    """Format one server-sent event."""
    return f"event: {event}\ndata: {json.dumps(data)}\n\n"


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
        "version": "2.0.0",
        "endpoints": {
            "health": "/health",
            "chat": "/chat",
            "chat_stream": "/chat/stream",
            "reindex": "/reindex"
        }
    }


# HEAD too, so uptime monitors that ping with HEAD keep the server awake.
@app.api_route(
    "/health",
    methods=["GET", "HEAD"],
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
        rag_initialized=rag_system is not None
    )


@app.post(
    "/chat",
    summary="Ask a question",
    response_model=ChatResponse,
    status_code=status.HTTP_200_OK
)
async def chat(request: ChatRequest) -> ChatResponse:
    """
    Answer a question about Rayyan in one JSON response.

    Prefer /chat/stream for the website: it shows the answer as it is written.

    Raises:
        HTTPException: If RAG system not initialized or query fails
    """
    rag = _require_rag()

    try:
        result = await rag.query(
            question=request.question,
            max_tokens=request.max_tokens
        )
        return ChatResponse(**result)

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Query failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Query processing failed"
        )


@app.post(
    "/chat/stream",
    summary="Ask a question (streamed)",
    status_code=status.HTTP_200_OK
)
async def chat_stream(request: ChatRequest) -> StreamingResponse:
    """
    Answer a question about Rayyan as a stream of server-sent events.

    Events: `text` ({"text": "..."}) for each piece of the answer, then `done`,
    or `error` if the answer fails partway through.

    Raises:
        HTTPException: If RAG system not initialized or the answer can't start
    """
    rag = _require_rag()
    chunks = rag.stream_answer(
        question=request.question,
        max_tokens=request.max_tokens
    )

    # Wait for the first piece before sending headers, so a request that fails
    # outright (bad key, API down) gets a real error status, not an empty 200.
    try:
        first = await chunks.__anext__()
    except StopAsyncIteration:
        first = ""
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Query failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Query processing failed"
        )

    async def events() -> AsyncIterator[str]:
        try:
            if first:
                yield _sse("text", {"text": first})
            async for text in chunks:
                yield _sse("text", {"text": text})
            yield _sse("done", {})
        except Exception as e:
            logger.error(f"Stream failed: {e}")
            yield _sse("error", {"detail": "Query processing failed"})

    return StreamingResponse(
        events(),
        media_type="text/event-stream",
        # Stop proxies from buffering the stream into one late chunk.
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"}
    )


@app.post(
    "/reindex",
    summary="Reload the knowledge base",
    response_model=IndexingResponse,
    status_code=status.HTTP_200_OK
)
async def reindex() -> IndexingResponse:
    """
    Reload the knowledge base from disk.

    Returns:
        IndexingResponse with the number of documents loaded

    Raises:
        HTTPException: If loading fails
    """
    global rag_system

    try:
        logger.info("Manual reindexing triggered")

        rag_system = create_rag_system()
        logger.info("RAG system reinitialized after reindexing")

        return IndexingResponse(
            status="success",
            message="Knowledge base reloaded successfully",
            total_documents=rag_system.num_documents
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
