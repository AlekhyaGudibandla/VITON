# System Architecture

## Overview

The Virtual Try-On system uses a microservices architecture with four main components:

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Client Browser                              │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                   Next.js 14 Frontend                         │  │
│  │                                                               │  │
│  │  Landing ── Login ── Dashboard ── Result ── History           │  │
│  │     │                    │                                    │  │
│  │     │               ┌───┴────┐                                │  │
│  │     │          Upload     Generate                            │  │
│  └─────┼───────────┼─────────┼──────────────────────────────────┘  │
│         │           │         │                                     │
└─────────┼───────────┼─────────┼─────────────────────────────────────┘
          │           │         │
    Supabase Auth   REST API  REST API
          │           │         │
          ▼           ▼         ▼
┌──────────────┐ ┌─────────────────┐ ┌────────────────────┐
│   Supabase   │ │    Express.js   │ │ Python Flask       │
│   Auth       │ │    Backend      │ │ AI Service         │
│              │ │    Port 3001    │ │ Port 5000          │
│   - signup   │ │                 │ │                    │
│   - login    │ │ - Upload routes │ │ - Pose detection   │
│   - session  │ │ - TryOn routes  │ │ - Segmentation     │
└──────┬───────┘ │ - Auth verify   │ │ - Clothing warp    │
       │         └────────┬────────┘ │ - Image synthesis   │
       │                  │          └─────────────────────┘
       │                  │
       ▼                  ▼
┌──────────────────────────────┐
│        Supabase              │
│  ┌──────────┐ ┌───────────┐  │
│  │PostgreSQL│ │  Storage   │  │
│  │          │ │            │  │
│  │profiles  │ │user-photos │  │
│  │images    │ │clothing-img│  │
│  │tryon_req │ │tryon-result│  │
│  └──────────┘ └───────────┘  │
└──────────────────────────────┘
```

## Request Flow: Generate Try-On

```
1. User uploads photo & clothing in Dashboard
   │
2. Frontend → POST /api/upload/user-image        → Supabase Storage
   Frontend → POST /api/upload/clothing-image     → Supabase Storage
   │
3. Frontend → POST /api/tryon/generate
   │           { userImageId, clothingImageId }
   │
4. Backend downloads both images from Supabase Storage
   │
5. Backend → POST AI-service/api/tryon
   │           (sends images as multipart form)
   │
6. AI Service processes:
   │  a) Detect pose keypoints
   │  b) Parse human body segments
   │  c) Extract clothing mask
   │  d) Warp clothing to body pose
   │  e) Synthesize final image
   │
7. AI Service returns generated image (JPEG)
   │
8. Backend stores result in Supabase Storage
   Backend updates tryon_requests record → status: "completed"
   │
9. Backend returns result URL to Frontend
   │
10. Frontend displays result with download option
```

## AI Pipeline Detail

```
                User Image
                    │
            ┌───────┴───────┐
            ▼               ▼
     Pose Detector    Human Parser
     (18 keypoints)   (20 segments)
            │               │
            └───────┬───────┘
                    │
    Clothing Image  │
         │          │
         ▼          │
  Clothing Mask     │
   Extractor        │
         │          │
         ▼          ▼
    TPS Clothing Warper
    (matches pose)
         │
         ▼
    VITON-HD Generator
    (encoder-decoder + skip connections)
         │
         ▼
    Result Image
```

## Database Schema

```
profiles
├── id (UUID, PK, FK → auth.users)
├── email
├── full_name
├── avatar_url
├── created_at
└── updated_at

images
├── id (UUID, PK)
├── user_id (FK → profiles)
├── image_type (ENUM: user, clothing)
├── storage_path
├── original_filename
├── file_size_bytes
├── mime_type
└── created_at

tryon_requests
├── id (UUID, PK)
├── user_id (FK → profiles)
├── user_image_id (FK → images)
├── clothing_image_id (FK → images)
├── result_storage_path
├── status (ENUM: pending, processing, completed, failed)
├── processing_time_ms
├── error_message
├── created_at
└── updated_at
```

## Security

- **Auth**: Supabase JWT tokens verified on every API request
- **RLS**: Row-Level Security ensures users can only access their own data
- **Storage**: Bucket policies enforce authenticated access
- **CORS**: Backend only accepts requests from the frontend origin
