# Deployment Guide - Rayyan's Personal AI Assistant

## Quick Start

### 1. Set Your API Key

Edit `backend/.env` and add your Anthropic API key:

```bash
cd LLM-Integration/backend
nano .env  # or use any text editor
```

Replace `your_anthropic_api_key_here` with your actual key from https://console.anthropic.com/

### 2. Run the Indexer

```bash
cd LLM-Integration/backend
python indexer.py
```

Expected output:
```
Starting indexing pipeline...
Knowledge directory: /path/to/knowledge
Database directory: /path/to/chroma_db

Indexing complete!
Status: success
Documents processed: 10
Chunks created: ~100+
Collection name: rayyan_knowledge
```

### 3. Start the API Server

```bash
python main.py
```

Or with uvicorn:
```bash
uvicorn main:app --reload
```

Server runs at: http://localhost:8000

### 4. Test the API

```bash
# Health check
curl http://localhost:8000/health

# Ask a question
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"question": "What are Rayyan'\''s technical skills?"}'
```

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     User's Question                          │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    FastAPI Backend                           │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  1. Generate question embedding                       │   │
│  │     (sentence-transformers)                          │   │
│  └──────────────────┬───────────────────────────────────┘   │
│                     │                                         │
│                     ▼                                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  2. Query ChromaDB vector database                   │   │
│  │     (retrieve top 3 relevant chunks)                 │   │
│  └──────────────────┬───────────────────────────────────┘   │
│                     │                                         │
│                     ▼                                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  3. Build context from retrieved chunks              │   │
│  └──────────────────┬───────────────────────────────────┘   │
│                     │                                         │
│                     ▼                                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  4. Send to Claude with structured prompt            │   │
│  │     (System: You are Rayyan's assistant...)          │   │
│  │     (User: Context + Question)                       │   │
│  └──────────────────┬───────────────────────────────────┘   │
│                     │                                         │
│                     ▼                                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  5. Return answer with sources                       │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## File Structure

```
LLM-Integration/
│
├── backend/
│   ├── main.py              ✅ FastAPI application & endpoints
│   ├── indexer.py           ✅ Document processing & embedding
│   ├── rag.py               ✅ RAG pipeline & Claude integration
│   ├── config.py            ✅ Configuration management
│   ├── requirements.txt     ✅ Python dependencies
│   ├── .env.example         ✅ Environment template
│   └── .env                 🔑 Your API key (REQUIRED)
│
├── knowledge/               ✅ 10 markdown files with Rayyan's info
│   ├── bio.md
│   ├── education.md
│   ├── skills.md
│   ├── projects.md
│   ├── experience.md
│   ├── achievements.md
│   ├── goals.md
│   ├── contact.md
│   ├── faq.md
│   └── timeline.md
│
├── chroma_db/              🗄️ Vector database (auto-created)
│
└── README.md               📚 Complete documentation
```

## API Endpoints

### GET /health
Check if system is ready

**Response:**
```json
{
  "status": "healthy",
  "rag_initialized": true,
  "collection_name": "rayyan_knowledge"
}
```

### POST /chat
Ask questions about Rayyan

**Request:**
```json
{
  "question": "What projects has Rayyan built?",
  "max_tokens": 1024,
  "temperature": 0.7
}
```

**Response:**
```json
{
  "answer": "Rayyan has built several notable projects...",
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

### POST /reindex
Force rebuild of vector database

**Response:**
```json
{
  "status": "success",
  "message": "Knowledge base reindexed successfully",
  "total_documents": 10,
  "total_chunks": 127
}
```

## Frontend Integration

### React Example

```javascript
const askQuestion = async (question) => {
  const response = await fetch('http://localhost:8000/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ question }),
  });

  const data = await response.json();
  return data.answer;
};

// Usage
const answer = await askQuestion("What are Rayyan's skills?");
```

### Fetch API Example

```javascript
fetch('http://localhost:8000/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    question: "Tell me about Rayyan's education"
  })
})
  .then(res => res.json())
  .then(data => console.log(data.answer));
```

## Production Deployment

### Option 1: Docker

Create `Dockerfile` in `backend/`:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Copy requirements and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY . .

# Download embedding model during build
RUN python -c "from sentence_transformers import SentenceTransformer; SentenceTransformer('all-MiniLM-L6-v2')"

# Expose port
EXPOSE 8000

# Run application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

Build and run:
```bash
docker build -t rayyan-ai ./backend
docker run -p 8000:8000 -e ANTHROPIC_API_KEY=your_key rayyan-ai
```

### Option 2: Cloud Platforms

#### Railway.app
1. Connect GitHub repository
2. Set environment variable: `ANTHROPIC_API_KEY`
3. Set start command: `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`

#### Render.com
1. New Web Service
2. Build command: `cd backend && pip install -r requirements.txt`
3. Start command: `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Add environment variable: `ANTHROPIC_API_KEY`

#### AWS EC2
```bash
# SSH into instance
ssh -i key.pem ubuntu@your-instance

# Install dependencies
sudo apt update
sudo apt install python3-pip
pip3 install -r requirements.txt

# Run with PM2 or systemd
uvicorn main:app --host 0.0.0.0 --port 8000
```

## Configuration Options

Edit `backend/config.py` or set environment variables:

| Variable | Default | Purpose |
|----------|---------|---------|
| `ANTHROPIC_API_KEY` | - | **Required**: Claude API key |
| `EMBEDDING_MODEL` | `all-MiniLM-L6-v2` | Sentence transformer model |
| `CLAUDE_MODEL` | `claude-3-5-sonnet-20241022` | Claude version |
| `CHUNK_SIZE` | 700 | Max characters per chunk |
| `CHUNK_OVERLAP` | 100 | Overlap between chunks |
| `TOP_K_RESULTS` | 3 | Chunks to retrieve per query |

## Troubleshooting

### Issue: "Collection not found"
**Solution:** Run the indexer first
```bash
cd backend
python indexer.py
```

### Issue: "Knowledge directory not found"
**Solution:** Ensure knowledge/ folder exists with .md files
```bash
ls ../knowledge/*.md
```

### Issue: Claude API errors
**Solution:** Check your API key
```bash
# Test API key
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "content-type: application/json" \
  -d '{"model":"claude-3-5-sonnet-20241022","max_tokens":10,"messages":[{"role":"user","content":"Hi"}]}'
```

### Issue: Slow first query
**Cause:** Embedding model downloads on first run (~80MB)
**Solution:** Wait for model download to complete

### Issue: CORS errors from frontend
**Solution:** Add your frontend URL to `allowed_origins` in `config.py`

## Performance Metrics

- **Indexing**: ~5-10 seconds for 10 documents
- **Query Latency**: 1-2 seconds (embedding + retrieval + Claude)
- **Memory Usage**: ~500MB (embedding model loaded)
- **Storage**: ~10MB per 1000 documents

## Security Best Practices

1. **Never commit .env file**
   ```bash
   echo ".env" >> .gitignore
   ```

2. **Use environment variables in production**
   ```bash
   export ANTHROPIC_API_KEY=your_key
   ```

3. **Enable CORS only for your domains**
   ```python
   allowed_origins = ["https://yourdomain.com"]
   ```

4. **Add rate limiting** (using slowapi)
   ```bash
   pip install slowapi
   ```

5. **Use HTTPS in production**

## Monitoring

### Health Check Endpoint
```bash
# Add to uptime monitor
curl http://localhost:8000/health
```

### Logging
Logs appear in console. For production:
```python
# In main.py
import logging
logging.basicConfig(
    filename='app.log',
    level=logging.INFO
)
```

## Updating Knowledge Base

1. Edit markdown files in `knowledge/`
2. Restart API (auto-reindexes on startup)
3. Or call `/reindex` endpoint:
   ```bash
   curl -X POST http://localhost:8000/reindex
   ```

## Next Steps

1. ✅ Set your Anthropic API key in `.env`
2. ✅ Run `python indexer.py`
3. ✅ Start server with `python main.py`
4. ✅ Test with curl or browser at http://localhost:8000/docs
5. 🔄 Integrate with your React frontend
6. 🚀 Deploy to production

## Support

Check logs for errors:
- FastAPI logs appear in console
- Use `/health` endpoint to verify system status
- Test with Swagger UI at http://localhost:8000/docs

## Credits

Built using:
- **FastAPI** - Modern Python web framework
- **Claude** - Anthropic's AI assistant
- **ChromaDB** - Vector database
- **Sentence Transformers** - Embedding generation
- **Python 3.11+** - Programming language
