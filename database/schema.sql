-- ============================================
-- Virtual Try-On System — Supabase Schema
-- Run this in the Supabase SQL Editor
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. Profiles Table
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 2. Images Table
-- ============================================
CREATE TYPE image_type AS ENUM ('user', 'clothing');

CREATE TABLE IF NOT EXISTS images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  image_type image_type NOT NULL,
  storage_path TEXT NOT NULL,
  original_filename TEXT,
  file_size_bytes INTEGER,
  mime_type TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_images_user_id ON images(user_id);
CREATE INDEX idx_images_type ON images(image_type);

-- ============================================
-- 3. Try-On Requests Table
-- ============================================
CREATE TYPE tryon_status AS ENUM ('pending', 'processing', 'completed', 'failed');

CREATE TABLE IF NOT EXISTS tryon_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  user_image_id UUID NOT NULL REFERENCES images(id) ON DELETE CASCADE,
  clothing_image_id UUID NOT NULL REFERENCES images(id) ON DELETE CASCADE,
  result_storage_path TEXT,
  status tryon_status DEFAULT 'pending',
  processing_time_ms INTEGER,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_tryon_user_id ON tryon_requests(user_id);
CREATE INDEX idx_tryon_status ON tryon_requests(status);

-- ============================================
-- 4. Row-Level Security
-- ============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE images ENABLE ROW LEVEL SECURITY;
ALTER TABLE tryon_requests ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read/update their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

-- Images: users can CRUD their own images
CREATE POLICY "Users can view own images"
  ON images FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own images"
  ON images FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own images"
  ON images FOR DELETE USING (auth.uid() = user_id);

-- Try-on requests: users can CRUD their own
CREATE POLICY "Users can view own tryon requests"
  ON tryon_requests FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tryon requests"
  ON tryon_requests FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tryon requests"
  ON tryon_requests FOR UPDATE USING (auth.uid() = user_id);

-- ============================================
-- 5. Storage Buckets (run via Supabase Dashboard or API)
-- ============================================
-- Create these buckets in Supabase Dashboard > Storage:
--   1. "user-photos"    — for user uploaded photos
--   2. "clothing-images" — for clothing images
--   3. "tryon-results"   — for generated try-on images
--
-- Set each bucket policy to allow authenticated users to upload/read their own files.

-- ============================================
-- 6. Updated_at trigger
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tryon_requests_updated_at
  BEFORE UPDATE ON tryon_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
