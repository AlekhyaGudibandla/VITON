# API Documentation

## Base URL

```
http://localhost:3001/api
```

## Authentication

All protected routes require a Bearer token in the `Authorization` header:

```
Authorization: Bearer <supabase_access_token>
```

---

## Health Check

### `GET /api/health`

Returns server status.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-03-08T10:00:00.000Z"
}
```

---

## Auth Endpoints

### `POST /api/auth/signup`

Create a new user account.

**Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "fullName": "John Doe"
}
```

**Response (201):**
```json
{
  "message": "User created successfully",
  "user": {
    "id": "uuid",
    "email": "user@example.com"
  }
}
```

### `POST /api/auth/profile`

Get the authenticated user's profile. Requires Bearer token.

**Response:**
```json
{
  "user": { "id": "uuid", "email": "user@example.com" },
  "profile": {
    "id": "uuid",
    "email": "user@example.com",
    "full_name": "John Doe",
    "created_at": "2026-03-08T10:00:00Z"
  }
}
```

---

## Upload Endpoints

### `POST /api/upload/user-image` 🔒

Upload a user photo. Requires auth.

**Body:** `multipart/form-data`
- `image` — JPEG, PNG, or WebP file (max 10MB)

**Response (201):**
```json
{
  "message": "User image uploaded successfully",
  "image": {
    "id": "uuid",
    "user_id": "uuid",
    "image_type": "user",
    "storage_path": "user-id/file.jpg",
    "url": "https://...supabase.co/storage/v1/object/public/user-photos/...",
    "created_at": "2026-03-08T10:00:00Z"
  }
}
```

### `POST /api/upload/clothing-image` 🔒

Upload a clothing image. Requires auth.

**Body:** `multipart/form-data`
- `image` — JPEG, PNG, or WebP file (max 10MB)

**Response (201):** Same format as user-image with `image_type: "clothing"`.

### `POST /api/upload/clothing-url` 🔒

Fetch a clothing image from a URL. Requires auth.

**Body:**
```json
{
  "url": "https://example.com/shirt.jpg"
}
```

**Response (201):** Same format as clothing-image upload.

---

## Try-On Endpoints

### `POST /api/tryon/generate` 🔒

Generate a virtual try-on image. Requires auth.

**Body:**
```json
{
  "userImageId": "uuid-of-user-image",
  "clothingImageId": "uuid-of-clothing-image"
}
```

**Response:**
```json
{
  "message": "Try-on generated successfully",
  "result": {
    "id": "uuid",
    "user_id": "uuid",
    "status": "completed",
    "processing_time_ms": 8500,
    "result_url": "https://...supabase.co/storage/v1/object/public/tryon-results/...",
    "user_image_url": "https://...",
    "clothing_image_url": "https://...",
    "created_at": "2026-03-08T10:00:00Z"
  }
}
```

### `GET /api/tryon/result/:id` 🔒

Get a specific try-on result.

**Response:**
```json
{
  "result": {
    "id": "uuid",
    "status": "completed",
    "result_url": "...",
    "user_image_url": "...",
    "clothing_image_url": "...",
    "processing_time_ms": 8500,
    "created_at": "2026-03-08T10:00:00Z"
  }
}
```

### `GET /api/tryon/history` 🔒

Get all try-on results for the authenticated user.

**Response:**
```json
{
  "history": [
    {
      "id": "uuid",
      "status": "completed",
      "result_url": "...",
      "user_image_url": "...",
      "clothing_image_url": "...",
      "created_at": "2026-03-08T10:00:00Z"
    }
  ]
}
```

### `GET /api/tryon/ai-health`

Check AI service health (no auth required).

**Response:**
```json
{
  "status": "ok",
  "mode": "mock",
  "gpu_available": false
}
```

---

## AI Service API

### Base URL: `http://localhost:5000`

### `POST /api/tryon`

Generate a try-on image (called internally by backend).

**Body:** `multipart/form-data`
- `user_image` — User photo
- `clothing_image` — Clothing image

**Response:** Raw JPEG image bytes.

### `GET /api/health`

```json
{
  "status": "ok",
  "mode": "mock",
  "gpu_available": false
}
```

---

## Error Responses

All errors return:
```json
{
  "error": "Description of what went wrong"
}
```

| Code | Meaning |
|------|---------|
| 400 | Bad request / missing fields |
| 401 | Unauthorized / invalid token |
| 404 | Resource not found |
| 500 | Server error |
