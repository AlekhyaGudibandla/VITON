# AI-Powered Virtual Try-On System

> Try on clothes virtually using AI. Upload your photo, choose an outfit, and see how it looks on you before buying.

![VirtualFit](https://img.shields.io/badge/VirtualFit-AI%20Fashion-7c3aed?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![Express](https://img.shields.io/badge/Express-4.x-green?style=flat-square&logo=express)
![Python](https://img.shields.io/badge/Python-3.10+-blue?style=flat-square&logo=python)
![Supabase](https://img.shields.io/badge/Supabase-Auth%20%7C%20DB%20%7C%20Storage-3ECF8E?style=flat-square&logo=supabase)

## Architecture

```
┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│   Next.js 14     │    │   Express.js     │    │   Python Flask   │
│   Frontend       │───▶│   Backend API    │───▶│   AI Service     │
│   (Port 3000)    │    │   (Port 3001)    │    │   (Port 5000)    │
└──────────────────┘    └──────────────────┘    └──────────────────┘
        │                       │
        │                       │
        ▼                       ▼
┌──────────────────────────────────────────┐
│              Supabase                     │
│   Auth  │  PostgreSQL  │  Storage        │
└──────────────────────────────────────────┘
```

## AI Pipeline

```
User Photo ─┐
             ├──▶ Pose Detection ──▶ Human Parsing ──┐
Clothing ────┤                                        ├──▶ Image Synthesis ──▶ Result
             └──▶ Clothing Mask ──▶ TPS Warping ─────┘
```

## Quick Start

### Prerequisites

- Node.js 18+
- Python 3.10+
- A Supabase project (free tier works)

### 1. Clone & Install

```bash
# Frontend
cd frontend
npm install
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# Backend
cd ../backend
npm install
cp .env.example .env
# Edit .env with your Supabase credentials

# AI Service
cd ../ai-service
pip install -r requirements.txt
```

### 2. Set Up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Go to SQL Editor → paste contents of `database/schema.sql` → Run
3. Go to Storage → Create buckets: `user-photos`, `clothing-images`, `tryon-results`
4. Set bucket policies to allow authenticated uploads/reads
5. Copy your **Project URL** and **Anon Key** into `.env` files

### 3. Run All Services

```bash
# Terminal 1 — AI Service (mock mode for development)
cd ai-service
python app.py

# Terminal 2 — Backend
cd backend
npm run dev

# Terminal 3 — Frontend
cd frontend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
virtual-tryon-system/
├── frontend/               # Next.js 14 App Router
│   ├── src/app/            # Pages (landing, login, signup, dashboard, result, history)
│   ├── src/components/     # UI components (auth, upload, tryon, layout)
│   └── src/lib/            # Supabase client, API helpers, utils
├── backend/                # Express.js REST API
│   ├── server.js           # Entry point
│   ├── routes/             # Upload, try-on, auth routes
│   ├── middleware/         # JWT auth middleware
│   └── services/           # Supabase & AI service clients
├── ai-service/             # Python Flask AI microservice
│   ├── app.py              # Flask app (mock/full mode)
│   ├── inference.py        # Full AI pipeline orchestrator
│   ├── mock_service.py     # Mock pipeline (CPU, no GPU needed)
│   ├── models/             # Pose, parsing, extraction, warping, synthesis
│   └── utils/              # Image preprocessing utilities
├── database/
│   └── schema.sql          # Supabase PostgreSQL schema
└── docs/                   # API, architecture, deployment docs
```

## Features

- **User Auth** — Sign up, login, logout via Supabase Auth
- **Photo Upload** — Drag-and-drop with preview
- **Clothing Input** — Upload image or paste product URL
- **AI Try-On** — Pose detection → segmentation → warping → synthesis
- **Results** — Side-by-side comparison with download
- **History** — View all past try-on generations
- **Dark Theme** — Premium glassmorphism UI with gradients & animations

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Create new account |
| POST | `/api/auth/profile` | Get user profile |
| POST | `/api/upload/user-image` | Upload user photo |
| POST | `/api/upload/clothing-image` | Upload clothing image |
| POST | `/api/upload/clothing-url` | Fetch clothing from URL |
| POST | `/api/tryon/generate` | Generate virtual try-on |
| GET | `/api/tryon/result/:id` | Get specific result |
| GET | `/api/tryon/history` | Get user's history |

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, TypeScript, Tailwind CSS |
| Backend | Node.js, Express.js |
| AI Service | Python, Flask, PyTorch, OpenCV |
| Database | Supabase PostgreSQL |
| Auth | Supabase Auth |
| Storage | Supabase Storage |

## Deployment

| Service | Platform |
|---------|----------|
| Frontend | Vercel |
| Backend | Railway / Render |
| AI Service | RunPod / GPU server |
| Database | Supabase |


