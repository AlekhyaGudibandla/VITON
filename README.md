# AI-Powered Virtual Try-On System

> A full-stack, microservices-based AI system for virtual clothing try-on.
> Upload a photo, select a garment, and generate a realistic try-on using a multi-stage computer vision pipeline.

![VirtualFit](https://img.shields.io/badge/VirtualFit-AI%20Fashion-7c3aed?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square\&logo=next.js)
![Express](https://img.shields.io/badge/Express-4.x-green?style=flat-square\&logo=express)
![Python](https://img.shields.io/badge/Python-3.10+-blue?style=flat-square\&logo=python)
![Supabase](https://img.shields.io/badge/Supabase-Auth%20%7C%20DB%20%7C%20Storage-3ECF8E?style=flat-square\&logo=supabase)

---

## 🚀 Overview

This project implements an **end-to-end virtual try-on system** combining:

* Modern full-stack architecture
* A modular AI inference pipeline
* Cloud-based storage and authentication

The system is designed to be **extensible, modular, and production-oriented**, with clear separation between frontend, API, and ML inference services.

---

## 🏗️ Architecture

```text
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

### Key Design Decisions

* **Service separation**

  * Frontend (UI)
  * Backend (API orchestration)
  * AI service (compute-heavy inference)

* **Language specialization**

  * Node.js → API handling & integrations
  * Python → ML inference pipeline

* **Externalized state**

  * Supabase handles auth, DB, and storage

---

## 🤖 AI Pipeline

```text
User Photo ─┐
             ├──▶ Pose Detection ──▶ Human Parsing ──┐
Clothing ────┤                                        ├──▶ Image Synthesis ──▶ Result
             └──▶ Clothing Mask ──▶ TPS Warping ─────┘
```

### Pipeline Stages

1. Pose Detection
2. Human Parsing
3. Clothing Mask Extraction
4. TPS Warping
5. Image Synthesis

### Engineering Notes

* Modular pipeline (`models/`, `utils/`, `inference.py`)
* Supports:

  * **Mock mode (CPU)** → fast development
  * **Full mode (GPU-ready)** → realistic inference

---

## ⚙️ System Design Considerations

### Current Design

* Synchronous request-response pipeline
* Stateless backend API
* External storage (Supabase)

### Scalability Considerations

* Async job queue (Redis / workers)
* Request batching for GPU efficiency
* Caching repeated results
* Horizontal scaling of AI service

### Tradeoffs

| Decision              | Benefit              | Tradeoff            |
| --------------------- | -------------------- | ------------------- |
| Separate AI service   | Isolation of compute | Network latency     |
| Supabase              | Faster development   | Less infra control  |
| Synchronous inference | Simplicity           | Limited scalability |

---

## 📊 Observability

Currently supports:

* API-level logging
* Basic error handling
* Inference timing hooks

Future improvements:

* Metrics dashboard (latency, success rate)
* Centralized logging (ELK / OpenTelemetry)
* Health monitoring

---

## ⚡ Features

* User Authentication (Supabase)
* Image Upload (user + clothing)
* URL-based clothing input
* AI Try-On Generation
* Result comparison & download
* History tracking
* Modern UI (glassmorphism + dark mode)

---

## 🔌 API Endpoints

| Method | Endpoint                     | Description       |
| ------ | ---------------------------- | ----------------- |
| POST   | `/api/auth/signup`           | Create account    |
| POST   | `/api/auth/profile`          | Get profile       |
| POST   | `/api/upload/user-image`     | Upload user image |
| POST   | `/api/upload/clothing-image` | Upload clothing   |
| POST   | `/api/upload/clothing-url`   | Fetch clothing    |
| POST   | `/api/tryon/generate`        | Generate try-on   |
| GET    | `/api/tryon/result/:id`      | Get result        |
| GET    | `/api/tryon/history`         | Get history       |

---

## 📂 Project Structure

```text
virtual-tryon-system/
├── frontend/       # Next.js app
├── backend/        # Express API
├── ai-service/     # Python ML service
├── database/       # PostgreSQL schema
└── docs/           # Documentation
```

---

## 🛠️ Tech Stack

| Layer      | Technology                           |
| ---------- | ------------------------------------ |
| Frontend   | Next.js 14, TypeScript, Tailwind CSS |
| Backend    | Node.js, Express.js                  |
| AI Service | Python, Flask, PyTorch, OpenCV       |
| Database   | Supabase PostgreSQL                  |
| Auth       | Supabase Auth                        |
| Storage    | Supabase Storage                     |

---

## 🚀 Deployment

| Service    | Platform         |
| ---------- | ---------------- |
| Frontend   | Vercel           |
| Backend    | Railway / Render |
| AI Service | RunPod (GPU)     |
| Database   | Supabase         |

### Notes

* AI service runs on GPU-enabled infrastructure
* Backend is stateless → horizontally scalable
* Frontend served via CDN (Vercel)

---

## 🧪 Local Development

### Prerequisites

* Node.js 18+
* Python 3.10+
* Supabase project

### Setup

```bash
# Frontend
cd frontend && npm install

# Backend
cd ../backend && npm install

# AI Service
cd ../ai-service && pip install -r requirements.txt
```

### Run

```bash
# AI Service
python app.py

# Backend
npm run dev

# Frontend
npm run dev
```

---

## 🔮 Future Improvements

* Async inference queue (Redis / Celery)
* Model optimization (ONNX / TensorRT)
* Multi-garment try-on
* Real-time try-on (video)
* Recommendation system

---

## 📌 Summary

This project demonstrates:

* Microservices-based system design
* End-to-end ML pipeline integration
* Full-stack engineering
* Practical system tradeoffs

Designed as a **foundation for scalable AI-powered fashion systems**.
