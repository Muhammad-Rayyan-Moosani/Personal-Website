# Backend API for Rayyan's Personal Website

FastAPI-based backend service providing AI-powered chat functionality using Claude and RAG (Retrieval-Augmented Generation).

## Features

- AI chatbot with Claude integration
- RAG system for context-aware responses
- Markdown content processing
- CORS support for web integration

## Deployment

### Render Deployment

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Configure the service:
   - **Build Command**: `./build.sh`
   - **Start Command**: `./start.sh`
   - **Environment**: Python 3

4. Add environment variables:
   - `ANTHROPIC_API_KEY`: Your Anthropic API key
   - `ALLOWED_ORIGINS`: Your frontend domain (e.g., https://rayyanmoosani.com)

### Local Development

1. Copy `.env.example` to `.env` and fill in your values:
   ```bash
   cp .env.example .env
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Run the application:
   ```bash
   uvicorn main:app --reload
   ```

## API Endpoints

- `GET /health` - Health check endpoint
- `POST /chat` - Main chat endpoint for AI interactions

## File Structure

```
backend/
├── main.py              # FastAPI application
├── config.py            # Configuration settings
├── rag.py               # RAG system implementation
├── indexer.py           # Vector indexing logic
├── requirements.txt     # Full dependencies (for local dev)
├── requirements-render.txt # Optimized dependencies for deployment
├── .env.example         # Environment variables template
├── build.sh             # Build script for Render
└── start.sh             # Start script for Render
```

## Notes

- The `requirements-render.txt` file contains optimized dependencies for deployment to reduce memory usage
- Ensure all environment variables are properly set before deployment
- The application uses in-memory storage for better performance on limited resources