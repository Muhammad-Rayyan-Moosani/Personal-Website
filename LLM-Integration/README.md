# ====================
# filename: README.md
# ====================

# Rayyan's Personal AI Assistant

A production-ready personal website AI assistant built with Python, FastAPI, ChromaDB, and Claude AI. This system allows website visitors to ask questions about Rayyan Moosani using retrieval-augmented generation (RAG) powered by Claude.

## Features

- **Retrieval-Augmented Generation (RAG)**: Combines vector search with Claude's reasoning
- **Automatic Indexing**: Detects knowledge base changes and reindexes automatically
- **Production-Ready**: Type hints, error handling, logging, and CORS support
- **RESTful API**: Clean FastAPI endpoints with OpenAPI documentation
- **Persistent Vector Storage**: ChromaDB for efficient similarity search
- **Semantic Search**: Sentence transformers for high-quality embeddings

## Architecture

```
LLM-Integration/
├── backend/
│   ├── main.py           # FastAPI application
│   ├── indexer.py        # Document indexing pipeline
│   ├── rag.py            # RAG and Claude integration
│   ├── config.py         # Configuration management
│   ├── requirements.txt  # Python dependencies
│   └── .env              # Environment variables (create from .env.example)
│
├── knowledge/            # Markdown knowledge base
│   ├── bio.md
│   ├── projects.md
│   ├── skills.md
│   └── ...
│
└── chroma_db/           # Vector database (auto-created)
```

## Requirements

- Python 3.11 or higher
- Anthropic API key
- 2GB RAM minimum (for embedding model)
- macOS or Linux

## Installation

### 1. Clone and Navigate

```bash
cd LLM-Integration
```

### 2. Create Virtual Environment

```bash
python3 -m venv venv
source venv/bin/activate  # On Linux/macOS
```

### 3. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

This will install:
- `fastapi` - Web framework
- `uvicorn` - ASGI server
- `anthropic` - Claude API client
- `chromadb` - Vector database
- `sentence-transformers` - Embedding generation
- `python-dotenv` - Environment management

### 4. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and add your Anthropic API key:

```env
ANTHROPIC_API_KEY=sk-ant-api03-...
```

Get your API key from: https://console.anthropic.com/

### 5. Create Knowledge Base

Create markdown files in the `knowledge/` directory:

```bash
cd ../knowledge
```

Add files like:
- `bio.md` - Biography and background
- `projects.md` - Project portfolio
- `skills.md` - Technical skills
- `education.md` - Educational background
- `experience.md` - Work experience
- `achievements.md` - Awards and recognition
- `goals.md` - Career goals and interests
- `faq.md` - Frequently asked questions

Each file should contain relevant information about Rayyan in markdown format.

## Usage

### Running the Indexer (Manual)

Index your knowledge base before starting the API:

```bash
cd backend
python indexer.py
```

Output:
```
Starting indexing pipeline...
Knowledge directory: /path/to/knowledge
Database directory: /path/to/chroma_db

Indexing complete!
Status: success
Documents processed: 10
Chunks created: 127
Collection name: rayyan_knowledge
```

### Starting the API Server

```bash
python main.py
```

Or using uvicorn directly:

```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

The API will:
1. Check if indexing is needed on startup
2. Auto-index if knowledge base changed
3. Initialize the RAG system
4. Start serving requests

Server will be available at: `http://localhost:8000`

### API Endpoints

#### 1. Health Check

```bash
curl http://localhost:8000/health
```

Response:
```json
{
  "status": "healthy",
  "rag_initialized": true,
  "collection_name": "rayyan_knowledge"
}
```

#### 2. Ask Question

```bash
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{
    "question": "What projects has Rayyan built?"
  }'
```

Response:
```json
{
  "answer": "Rayyan has built several notable projects including...",
  "sources": [
    {
      "title": "Projects",
      "filename": "projects.md"
    }
  ],
  "context_used": true,
  "num_chunks_retrieved": 3
}
```

#### 3. Trigger Reindexing

```bash
curl -X POST http://localhost:8000/reindex
```

Response:
```json
{
  "status": "success",
  "message": "Knowledge base reindexed successfully",
  "total_documents": 10,
  "total_chunks": 127
}
```

#### 4. API Documentation

Visit `http://localhost:8000/docs` for interactive Swagger UI documentation.

### Testing with Advanced Parameters

```bash
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{
    "question": "What are Rayyan'\''s main technical skills?",
    "max_tokens": 512,
    "temperature": 0.5
  }'
```

## Configuration

Edit `backend/config.py` or use environment variables:

| Variable | Default | Description |
|----------|---------|-------------|
| `ANTHROPIC_API_KEY` | Required | Your Anthropic API key |
| `EMBEDDING_MODEL` | `all-MiniLM-L6-v2` | Sentence transformer model |
| `CLAUDE_MODEL` | `claude-3-5-sonnet-20241022` | Claude model version |
| `CHUNK_SIZE` | `700` | Characters per chunk |
| `CHUNK_OVERLAP` | `100` | Overlap between chunks |
| `TOP_K_RESULTS` | `3` | Number of chunks to retrieve |

## Development

### Project Structure Explained

**`config.py`**: Centralized configuration using Pydantic Settings
- Loads environment variables
- Defines model parameters
- Sets file paths

**`indexer.py`**: Document processing pipeline
- `MarkdownLoader`: Reads markdown files
- `DocumentChunker`: Splits text into chunks
- `VectorIndexer`: Generates embeddings and stores in ChromaDB
- Hash-based change detection for efficient reindexing

**`rag.py`**: Retrieval and generation logic
- `ContextRetriever`: Queries vector database
- `ClaudeRAG`: Orchestrates RAG pipeline
- Prompt engineering for Claude
- Source attribution

**`main.py`**: FastAPI application
- REST endpoints
- Request/response validation
- Error handling
- CORS configuration
- Lifecycle management (auto-indexing on startup)

### Adding New Knowledge

1. Add or edit markdown files in `knowledge/`
2. Restart the API (it will auto-reindex)
3. Or call the `/reindex` endpoint

### Extending the System

**Custom Chunking Strategy**:
Edit `DocumentChunker` in `indexer.py`

**Different Embedding Model**:
Change `EMBEDDING_MODEL` in config

**Modified Claude Prompts**:
Edit `_build_system_prompt()` in `rag.py`

**Additional Metadata**:
Extend metadata in `MarkdownLoader.load_documents()`

## Deployment

### Production Checklist

- [ ] Set strong API authentication
- [ ] Configure rate limiting
- [ ] Set up monitoring and logging
- [ ] Use production ASGI server (Gunicorn + Uvicorn)
- [ ] Configure CORS for your domain
- [ ] Use environment-specific configs
- [ ] Set up health check monitoring
- [ ] Enable HTTPS

### Running with Gunicorn

```bash
pip install gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

### Docker Deployment

Create `Dockerfile`:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ ./backend/
COPY knowledge/ ./knowledge/

WORKDIR /app/backend

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

Build and run:

```bash
docker build -t rayyan-ai .
docker run -p 8000:8000 -e ANTHROPIC_API_KEY=your_key rayyan-ai
```

## Troubleshooting

### "Collection not found" Error

Run the indexer first:
```bash
python indexer.py
```

### "Knowledge directory not found"

Ensure `knowledge/` directory exists and contains `.md` files.

### Embedding Model Download Issues

First run downloads the model (~80MB). Requires internet connection.

### ChromaDB Errors

Delete `chroma_db/` directory and reindex:
```bash
rm -rf ../chroma_db
python indexer.py
```

### Claude API Errors

- Check API key is valid
- Verify API key has sufficient credits
- Check rate limits

## Performance

- **Indexing**: ~10 documents in 5-10 seconds
- **Query**: 1-2 seconds (including embedding + retrieval + Claude)
- **Memory**: ~500MB (embedding model)
- **Storage**: ~10MB per 1000 documents

## Security

- API keys stored in `.env` (never commit)
- Prompt injection protection via structured prompts
- Input validation on all endpoints
- CORS configured for specific origins
- Off-topic query filtering

## License

Private use for Rayyan Moosani's personal website.

## Support

For issues or questions about this implementation:
1. Check logs for detailed error messages
2. Verify API key and configuration
3. Ensure knowledge base is properly formatted
4. Test with `/health` endpoint

## Credits

- Built with [FastAPI](https://fastapi.tiangolo.com/)
- Powered by [Claude](https://www.anthropic.com/claude) by Anthropic
- Vector storage by [ChromaDB](https://www.trychroma.com/)
- Embeddings by [Sentence Transformers](https://www.sbert.net/)
