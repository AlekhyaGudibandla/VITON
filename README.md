# 👗 AI-Powered Virtual Try-On System (VirtualFit)

> A microservices-based AI system that enables users to virtually try on clothing using computer vision.
> Built with a modular ML pipeline, scalable backend architecture, and production-oriented full-stack design.

![VirtualFit](https://img.shields.io/badge/VirtualFit-AI%20Fashion-7c3aed?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square\&logo=next.js)
![Express](https://img.shields.io/badge/Express-4.x-green?style=flat-square\&logo=express)
![Python](https://img.shields.io/badge/Python-3.10+-blue?style=flat-square\&logo=python)
![Supabase](https://img.shields.io/badge/Supabase-Auth%20%7C%20DB%20%7C%20Storage-3ECF8E?style=flat-square\&logo=supabase)

---

## 🚀 Vision

VirtualFit is built to bridge the gap between **online shopping and real-world fitting**.

It addresses a key problem in fashion e-commerce:

> ❝ Users cannot visualize how clothing will look on them before purchase ❞

This system uses **AI-powered image synthesis** to simulate realistic try-on experiences while maintaining a scalable and modular architecture.

---

## 🧠 Core Capabilities

* 👤 Multi-profile management (save and reuse user models)
* 👕 Input clothing (image or URL)
* 🤖 Generate AI-based try-on result
* 📊 Store and retrieve past generations
* 🔐 Secure user authentication

---

## 🏗️ System Architecture

```text
┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│   Next.js 14     │    │   Express API    │    │   Python AI      │
│   Frontend       │───▶│   Backend        │───▶│   Service        │
│   (Port 3000)    │    │   (Port 3001)    │    │   (Port 5000)    │
└──────────────────┘    └──────────────────┘    └──────────────────┘
        │                       │
        ▼                       ▼
┌──────────────────────────────────────────┐
│              Supabase                     │
│   Auth  │  PostgreSQL  │  Storage        │
└──────────────────────────────────────────┘
```

### 🔑 Design Principles

* **Separation of concerns**

  * UI → Next.js
  * API → Express
  * ML → Python service

* **Stateless backend**

  * All persistence handled via Supabase

* **Modular ML pipeline**

  * Independent stages → easier debugging & upgrades

---

## 🤖 AI Pipeline

```text
User Image ─┐
             ├──▶ Pose Detection ──▶ Human Parsing ──┐
Clothing ────┤                                        ├──▶ Image Synthesis ──▶ Output
             └──▶ Clothing Mask ──▶ TPS Warping ─────┘
```

### 🧩 Pipeline Breakdown

1. **Pose Detection**
   Extracts body keypoints

2. **Human Parsing**
   Segments body regions

3. **Clothing Mask Extraction**
   Isolates garment from input

4. **TPS Warping**
   Aligns clothing to user body

5. **Image Synthesis**
   Generates final realistic output

---

## ⚙️ System Design

### Current Flow

```text
User → Upload → Backend → AI Service → Storage → Response
```

### Key Engineering Decisions

* **Dedicated AI microservice**

  * isolates heavy computation
  * allows independent scaling

* **Supabase integration**

  * handles auth, DB, storage
  * reduces backend complexity

* **Mock vs Full Mode**

  * mock mode → fast local development
  * full mode → GPU-ready inference

---

## 📊 Performance Considerations

* Inference is **compute-intensive** (GPU recommended)
* Mock mode enables **sub-second development testing**
* Designed for future:

  * batching
  * async processing
  * GPU scaling

---

## ⚖️ Tradeoffs

| Decision            | Benefit            | Tradeoff                   |
| ------------------- | ------------------ | -------------------------- |
| Separate AI service | Clean architecture | Network overhead           |
| Sync inference      | Simpler pipeline   | Not scalable for high load |
| Supabase            | Fast dev           | Less infra control         |

---

## 📊 Observability (Extendable)

* API-level logging
* Error handling across services
* Hooks for inference timing

Future scope:

* metrics dashboard
* centralized logging
* health monitoring

---

## ⚡ Features

* Authentication (Supabase)
* Identity Manager (save and reuse user models)
* Image upload (user + clothing)
* URL-based clothing input
* AI try-on generation
* Result comparison & download
* History tracking
* Modern UI (dark theme + glassmorphism)

---

## 🔌 API Endpoints

| Method | Endpoint                     | Description        |
| ------ | ---------------------------- | ------------------ |
| POST   | `/api/auth/signup`           | Create account     |
| POST   | `/api/auth/profile`          | Get profile        |
| GET    | `/api/profiles`              | List user profiles |
| POST   | `/api/profiles`              | Create new profile |
| DELETE | `/api/profiles/:id`          | Delete profile     |
| POST   | `/api/upload/user-image`     | Upload user image  |
| POST   | `/api/upload/clothing-image` | Upload clothing    |
| POST   | `/api/upload/clothing-url`   | Fetch clothing     |
| POST   | `/api/tryon/generate`        | Generate try-on    |
| GET    | `/api/tryon/result/:id`      | Get result         |
| GET    | `/api/tryon/history`         | Get history        |

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

| Layer      | Technology                       |
| ---------- | -------------------------------- |
| Frontend   | Next.js 14, TypeScript, Tailwind |
| Backend    | Node.js, Express                 |
| AI Service | Python, Flask, PyTorch, OpenCV   |
| Database   | Supabase PostgreSQL              |
| Auth       | Supabase Auth                    |
| Storage    | Supabase Storage                 |

---

## 🚀 Deployment

| Service    | Platform         |
| ---------- | ---------------- |
| Frontend   | Vercel           |
| Backend    | Railway / Render |
| AI Service | RunPod (GPU)     |
| Database   | Supabase         |

---

## 🧪 Local Setup

### Prerequisites

* Node.js 18+
* Python 3.10+
* Supabase project

### Install

```bash
cd frontend && npm install
cd ../backend && npm install
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

## ⚠️ Limitations

* Sensitive to complex poses
* Output quality depends on input image
* Not real-time (yet)
* Limited garment types

---

## 🔮 Roadmap

* Async inference queue (Redis / Celery)
* Model optimization (ONNX / TensorRT)
* Multi-garment try-on
* Real-time try-on (video)
* Recommendation system

---

## 📌 Summary

This project demonstrates:

* Microservices-based architecture
* AI pipeline integration
* Full-stack engineering
* System design tradeoffs

Designed as a **foundation for scalable AI-driven fashion applications**.
