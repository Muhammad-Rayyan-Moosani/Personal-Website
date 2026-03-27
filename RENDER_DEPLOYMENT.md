# Render Deployment Guide

## Overview

Since you're using Render for your website, here's how to deploy the AI backend to Render.

## What Changed

✅ **Added MMR-like retrieval** for better answer quality:
- Fetches **18 candidates** (6 × 3 multiplier)
- Selects **6 diverse chunks** to avoid redundancy
- Prefers chunks from different source files for broader coverage

## Architecture on Render

```
Frontend (Render Static Site)
         ↓
Backend API (Render Web Service)
         ↓
ChromaDB (Persistent Disk)
```

## Step-by-Step Deployment

### Step 1: Prepare Your Repository

1. **Commit and push all changes:**
   ```bash
   cd /Users/rayyan/Desktop/PP/Personal-Website
   git add .
   git commit -m "Add AI backend with MMR retrieval"
   git push origin main
   ```

### Step 2: Deploy Backend to Render

1. **Go to Render Dashboard**
   - Visit: https://dashboard.render.com
   - Click "New +" → "Web Service"

2. **Connect Repository**
   - Select "Build and deploy from a Git repository"
   - Connect your GitHub account
   - Choose your `Personal-Website` repository

3. **Configure Service**
   ```
   Name: rayyan-ai-backend
   Region: Oregon (or closest to you)
   Branch: main
   Root Directory: LLM-Integration/backend
   Runtime: Python 3
   Build Command: pip install -r requirements.txt
   Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT
   Plan: Starter ($7/month) or Free (with sleep)
   ```

4. **Add Environment Variables**
   - Click "Advanced" → "Add Environment Variable"
   - Add:
     ```
     ANTHROPIC_API_KEY = your_key_here
     ```

5. **Add Persistent Disk** (Important!)
   - Scroll to "Disk"
   - Click "Add Disk"
   - Name: `chroma-db`
   - Mount Path: `/opt/render/project/src/chroma_db`
   - Size: 1 GB
   - This ensures your vector database persists across deploys

6. **Deploy**
   - Click "Create Web Service"
   - Wait 5-10 minutes for build

### Step 3: Get Your Backend URL

After deployment:
- Render will show you a URL like: `https://rayyan-ai-backend.onrender.com`
- Copy this URL!

### Step 4: Update Frontend

1. **Add Environment Variable in Render (Frontend)**
   - Go to your frontend static site settings
   - Environment → Add
   - `VITE_API_URL = https://rayyan-ai-backend.onrender.com`

2. **Update CORS in Backend**

   Edit `LLM-Integration/backend/config.py`:
   ```python
   allowed_origins: list[str] = [
       "http://localhost:3000",
       "http://localhost:5173",
       "http://localhost:5174",
       "http://localhost:5175",
       "https://your-site.onrender.com",  # Add your Render frontend URL
       "https://rayyanmoosani.com"  # Add your custom domain if you have one
   ]
   ```

3. **Commit and Push**
   ```bash
   git add .
   git commit -m "Update CORS for production"
   git push
   ```

4. **Render Auto-Deploys**
   - Both frontend and backend will redeploy automatically

### Step 5: Test

1. **Test Backend Health**
   ```bash
   curl https://rayyan-ai-backend.onrender.com/health
   ```

2. **Test Chat Endpoint**
   ```bash
   curl -X POST https://rayyan-ai-backend.onrender.com/chat \
     -H "Content-Type: application/json" \
     -d '{"question": "What projects has Rayyan built?"}'
   ```

3. **Test Frontend**
   - Visit your Render site
   - Ask a question in the prompt box
   - Should get AI responses!

## New MMR Retrieval Features

### What It Does

**Before:** Retrieved 3 most similar chunks (might be redundant)

**Now:**
1. Fetches 18 candidate chunks
2. Selects 6 diverse chunks using MMR-like algorithm
3. Prefers chunks from different source files
4. Balances relevance vs. diversity

### Configuration

You can adjust in `.env` or environment variables:

```bash
TOP_K_RESULTS=6           # Final number of chunks to use
FETCH_K_MULTIPLIER=3      # Fetch this many times top_k
```

**Examples:**
- `TOP_K_RESULTS=6` + `FETCH_K_MULTIPLIER=3` = Fetch 18, select 6
- `TOP_K_RESULTS=4` + `FETCH_K_MULTIPLIER=5` = Fetch 20, select 4

### How It Improves Answers

1. **Reduces Redundancy**: Won't return 3 chunks from same file
2. **Better Coverage**: Pulls from multiple sources
3. **More Context**: 6 chunks vs 3 = richer context for Claude
4. **Diverse Perspectives**: Different aspects of Rayyan's background

## Monitoring

### Check Backend Logs
- Render Dashboard → Your service → Logs
- Watch for errors during startup or queries

### Common Issues

**"Collection doesn't exist"**
- Backend needs to run indexer on first startup
- Check logs for "Indexing complete!"
- May take 2-3 minutes on first deploy

**"Out of Memory"**
- Upgrade to Starter plan ($7/month)
- Free tier may struggle with sentence-transformers model

**"Slow responses"**
- Free tier sleeps after 15 min inactivity
- Takes ~30s to wake up
- Starter plan = always awake

## Costs

**Free Tier:**
- ✅ Frontend: Free
- ⚠️ Backend: Free but sleeps after inactivity
- ⚠️ 750 hours/month free (then usage charges)

**Starter Plan ($7/month):**
- ✅ Always awake (no cold starts)
- ✅ 1 GB disk included
- ✅ Better performance

## Updating After Deployment

### Update Knowledge Base

1. Edit markdown files locally
2. Commit and push to GitHub
3. Render redeploys automatically
4. Backend reindexes on startup

### Update Code

1. Make changes to Python/React code
2. Push to GitHub
3. Render auto-deploys both services

## Production Checklist

Before going live:

- [ ] Backend deployed and responding to /health
- [ ] ANTHROPIC_API_KEY set in Render
- [ ] Persistent disk attached to backend
- [ ] Frontend environment variable VITE_API_URL set
- [ ] CORS updated with production URLs
- [ ] Test chat endpoint works
- [ ] Test frontend asks questions successfully
- [ ] Check Render logs for errors
- [ ] Verify indexer ran on first startup

## Performance Tips

1. **Use Starter Plan** - Free tier sleeps, causing delays
2. **Enable HTTP/2** - Render does this automatically
3. **Monitor Usage** - Check Render dashboard regularly
4. **Optimize Chunks** - Current 23 chunks is good, don't over-chunk
5. **Cache** - ChromaDB stays in memory after first load

## Support

If deployment fails:

1. Check Render build logs
2. Verify `requirements.txt` is correct
3. Ensure Python 3.11+ is specified
4. Check all environment variables are set
5. Verify disk is mounted to correct path

## Summary

✅ **What works now:**
- MMR-like retrieval with diversity
- Fetches 18 candidates, selects 6 best
- Configurable via environment variables
- Ready for Render deployment
- Persistent storage for ChromaDB
- Auto-reindexing on startup

🚀 **Deploy time:** ~15-20 minutes total
💰 **Cost:** $7/month (recommended) or Free with limitations
