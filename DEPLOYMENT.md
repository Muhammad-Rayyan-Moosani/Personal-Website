# Deployment Guide

## Architecture

Your app has two parts that need separate deployment:

```
Frontend (React)          Backend (Python FastAPI)
     ↓                            ↓
  Vercel                    Railway/Render
     ↓                            ↓
     └──────── API calls ────────┘
```

## Option 1: Vercel (Frontend) + Railway (Backend) ✅ RECOMMENDED

### Step 1: Deploy Backend to Railway

1. **Sign up at Railway.app**
   - Go to https://railway.app
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Select the `LLM-Integration/backend` folder

3. **Add Environment Variables**
   - In Railway dashboard, go to "Variables"
   - Add: `ANTHROPIC_API_KEY=your_key_here`
   - Railway will auto-detect Python and install dependencies

4. **Get Your Backend URL**
   - Railway will give you a URL like: `https://your-app.railway.app`
   - Copy this URL!

### Step 2: Deploy Frontend to Vercel

1. **Update Vercel Environment Variable**
   - Go to Vercel dashboard
   - Settings → Environment Variables
   - Add: `VITE_API_URL=https://your-app.railway.app`
   - (Use the URL from Railway)

2. **Update CORS in Backend**
   - Edit `LLM-Integration/backend/config.py`
   - Add your Vercel URL to `allowed_origins`:
   ```python
   allowed_origins: list[str] = [
       "http://localhost:3000",
       "http://localhost:5173",
       "http://localhost:5174",
       "http://localhost:5175",
       "https://your-vercel-app.vercel.app"  # Add this
   ]
   ```

3. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Add deployment configs"
   git push
   ```

4. **Vercel Auto-Deploys**
   - Vercel watches your GitHub repo
   - It will automatically rebuild and deploy

## Option 2: All-in-One on Render.com

### Backend Setup

1. **Sign up at Render.com**
   - Go to https://render.com
   - Sign up with GitHub

2. **Create Web Service**
   - New → Web Service
   - Connect your GitHub repo
   - Root Directory: `LLM-Integration/backend`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

3. **Environment Variables**
   - Add `ANTHROPIC_API_KEY`

4. **Note the URL**
   - Render gives you: `https://your-app.onrender.com`

### Frontend Setup

1. **Create Static Site**
   - New → Static Site
   - Connect same GitHub repo
   - Root Directory: `/` (root)
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`

2. **Environment Variable**
   - Add: `VITE_API_URL=https://your-app.onrender.com`

## Option 3: AWS/GCP (Advanced)

If you want full control, you can deploy to AWS:

**Backend:**
- EC2 instance or Elastic Beanstalk
- Run Docker container with FastAPI
- Use S3 for ChromaDB persistence

**Frontend:**
- S3 + CloudFront
- Or keep on Vercel

## Important Notes

### 🔒 Security
- Never commit `.env` file to GitHub
- Use environment variables on hosting platforms
- Update CORS settings for production domains

### 📊 Costs

**Free Tier Options:**
- **Vercel**: Free for personal projects
- **Railway**: $5/month starter (includes 500 hours)
- **Render**: Free tier available (with sleep after inactivity)

**Recommended for Production:**
- Railway ($5-20/month) - Best balance
- Render ($7-25/month) - More reliable

### 🔄 Auto-Deployment

Both Railway and Render support:
- ✅ Auto-deploy on git push
- ✅ Environment variables
- ✅ Custom domains
- ✅ SSL certificates (free)

## Testing Deployment

After deployment:

1. **Test Backend**
   ```bash
   curl https://your-backend-url.railway.app/health
   ```

2. **Test Frontend**
   - Visit your Vercel URL
   - Ask a question in the prompt box
   - Check browser console for any CORS errors

## Updating After Deployment

### Update Knowledge Base
1. Edit markdown files locally
2. Commit and push to GitHub
3. Railway/Render will auto-redeploy
4. Backend will auto-reindex on startup

### Update Frontend
1. Make changes to React code
2. Push to GitHub
3. Vercel auto-deploys

## Troubleshooting

### "CORS Error"
- Update `allowed_origins` in `config.py` with your production URL
- Redeploy backend

### "500 Internal Server Error"
- Check Railway/Render logs
- Verify `ANTHROPIC_API_KEY` is set
- Check ChromaDB persistence settings

### "Collection doesn't exist"
- Restart backend service
- Check logs for indexing errors

## Current Setup Summary

✅ **What Works Now:**
- Local development on localhost
- Frontend: http://localhost:5175
- Backend: http://localhost:8000

🚀 **What You Need for Production:**
1. Deploy backend to Railway/Render
2. Get backend URL
3. Add `VITE_API_URL` to Vercel
4. Update CORS settings
5. Push to GitHub

**Total Time:** ~30 minutes
**Monthly Cost:** $0-5 (Railway free tier or $5 starter)
