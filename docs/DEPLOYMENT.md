# Deployment Guide

## 1. Supabase Setup

1. Create a project at [supabase.com](https://supabase.com)
2. Navigate to **SQL Editor** → paste `database/schema.sql` → **Run**
3. Navigate to **Storage** → Create these buckets:
   - `user-photos`
   - `clothing-images`
   - `tryon-results`
4. For each bucket, add a policy:
   - **SELECT**: Allow authenticated users to read files where `auth.uid()::text = (storage.foldername(name))[1]`
   - **INSERT**: Same condition
5. Copy **Project URL** and **Anon Key** from Settings → API

---

## 2. Frontend — Vercel

1. Push repo to GitHub
2. Import into [Vercel](https://vercel.com)
3. Set **Root Directory** to `frontend`
4. Add environment variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   NEXT_PUBLIC_API_URL=https://your-backend-url.com/api
   ```
5. Deploy

---

## 3. Backend — Railway

1. Create a new project on [Railway](https://railway.app)
2. Connect your GitHub repo
3. Set **Root Directory** to `backend`
4. Add environment variables:
   ```
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_KEY=your-service-role-key
   AI_SERVICE_URL=https://your-ai-service-url.com
   FRONTEND_URL=https://your-frontend.vercel.app
   PORT=3001
   NODE_ENV=production
   ```
5. Deploy

### Alternative: Render

1. Create a new **Web Service** on [Render](https://render.com)
2. Connect repo, set root to `backend`
3. Build command: `npm install`
4. Start command: `node server.js`
5. Add environment variables as above

---

## 4. AI Service — GPU Server

### Option A: RunPod

1. Create a RunPod account at [runpod.io](https://runpod.io)
2. Launch a GPU pod (RTX 3090 or better recommended)
3. Clone repo and install dependencies:
   ```bash
   cd ai-service
   pip install -r requirements.txt
   ```
4. Download model weights to `ai-service/weights/`:
   - `pose_detector.pth`
   - `human_parser.pth`
   - `clothing_extractor.pth`
   - `tps_warper.pth`
   - `tryon_generator.pth`
5. Set environment variable:
   ```
   AI_MODE=full
   ```
6. Run:
   ```bash
   gunicorn app:app --bind 0.0.0.0:5000 --timeout 120
   ```

### Option B: Docker

```dockerfile
FROM nvidia/cuda:12.1.0-runtime-ubuntu22.04

RUN apt-get update && apt-get install -y python3 python3-pip
WORKDIR /app
COPY requirements.txt .
RUN pip3 install -r requirements.txt
COPY . .

ENV AI_MODE=full
EXPOSE 5000
CMD ["gunicorn", "app:app", "--bind", "0.0.0.0:5000", "--timeout", "120"]
```

---

## 5. Environment Variables Summary

### Frontend (`.env.local`)
| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `NEXT_PUBLIC_API_URL` | Backend API URL |

### Backend (`.env`)
| Variable | Description |
|----------|-------------|
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SERVICE_KEY` | Supabase service role key |
| `AI_SERVICE_URL` | AI service URL |
| `FRONTEND_URL` | Frontend URL (for CORS) |
| `PORT` | Server port (default: 3001) |

### AI Service
| Variable | Description |
|----------|-------------|
| `AI_MODE` | `mock` or `full` |
| `PORT` | Server port (default: 5000) |
