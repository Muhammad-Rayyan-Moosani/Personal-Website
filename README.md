# Personal Website

A modern personal portfolio website with an AI chatbot powered by Claude AI.

## Project Structure

```
.
├── frontend/              # React + Vite frontend application
│   ├── src/              # React components and app code
│   ├── public/           # Static assets
│   └── package.json      # Frontend dependencies
│
└── LLM-Integration/
    └── backend/          # Python Flask backend with RAG chatbot
        ├── app.py        # Main Flask application
        └── requirements.txt
```

## Deployment

This project is split into two separate deployments:

### Frontend (Static Site)

**Deploy to Render:**
1. Create a new **Static Site** on Render
2. Connect your GitHub repository
3. Configure:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

### Backend (Web Service)

**Deploy to Render:**
1. Create a new **Web Service** on Render
2. Connect your GitHub repository
3. Configure:
   - **Root Directory**: `LLM-Integration/backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python app.py`
   - **Environment Variables**: Add your `ANTHROPIC_API_KEY`

## Local Development

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd LLM-Integration/backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

## Tech Stack

- **Frontend**: React, Vite, Three.js, Tailwind CSS, Framer Motion
- **Backend**: Python, Flask, LangChain, Anthropic Claude API
- **AI Features**: RAG (Retrieval Augmented Generation) with ChromaDB
