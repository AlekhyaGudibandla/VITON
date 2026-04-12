"use client";

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import ImageUploader from "@/components/upload/ImageUploader";
import ClothingInput from "@/components/upload/ClothingInput";
import ProcessingOverlay from "@/components/tryon/ProcessingOverlay";
import TryOnResult from "@/components/tryon/TryOnResult";
import {
  uploadUserImage,
  uploadClothingImage,
  uploadClothingUrl,
  generateTryOn,
  ImageRecord,
  TryOnResult as TryOnResultType,
} from "@/lib/api";
import { Sparkles, ArrowRight, AlertCircle } from "lucide-react";

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  // Image states
  const [userImagePreview, setUserImagePreview] = useState<string | null>(null);
  const [clothingImagePreview, setClothingImagePreview] = useState<string | null>(null);
  const [userImageRecord, setUserImageRecord] = useState<ImageRecord | null>(null);
  const [clothingImageRecord, setClothingImageRecord] = useState<ImageRecord | null>(null);

  // Loading and result states
  const [uploadingUser, setUploadingUser] = useState(false);
  const [uploadingClothing, setUploadingClothing] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<TryOnResultType | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  const handleUserImageSelect = useCallback(async (file: File) => {
    setError(null);
    // Show preview immediately
    const preview = URL.createObjectURL(file);
    setUserImagePreview(preview);
    setUploadingUser(true);

    try {
      const response = await uploadUserImage(file);
      setUserImageRecord(response.image);
    } catch (err: any) {
      setError(err.message);
      setUserImagePreview(null);
    } finally {
      setUploadingUser(false);
    }
  }, []);

  const handleClothingImageSelect = useCallback(async (file: File) => {
    setError(null);
    const preview = URL.createObjectURL(file);
    setClothingImagePreview(preview);
    setUploadingClothing(true);

    try {
      const response = await uploadClothingImage(file);
      setClothingImageRecord(response.image);
    } catch (err: any) {
      setError(err.message);
      setClothingImagePreview(null);
    } finally {
      setUploadingClothing(false);
    }
  }, []);

  const handleClothingUrlSubmit = useCallback(async (url: string) => {
    setError(null);
    setUploadingClothing(true);

    try {
      const response = await uploadClothingUrl(url);
      setClothingImageRecord(response.image);
      setClothingImagePreview(response.image.url);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploadingClothing(false);
    }
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!userImageRecord || !clothingImageRecord) return;

    setError(null);
    setGenerating(true);

    try {
      const response = await generateTryOn(userImageRecord.id, clothingImageRecord.id);
      setResult(response.result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  }, [userImageRecord, clothingImageRecord]);

  const handleTryAnother = useCallback(() => {
    setResult(null);
    setUserImagePreview(null);
    setClothingImagePreview(null);
    setUserImageRecord(null);
    setClothingImageRecord(null);
    setError(null);
  }, []);

  if (authLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Show result view
  if (result) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <TryOnResult result={result} onTryAnother={handleTryAnother} />
      </div>
    );
  }

  // Show processing overlay
  if (generating) {
    return <ProcessingOverlay />;
  }

  return (
    <div className="page-transition max-w-6xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-3">
          Virtual <span className="gradient-text">Try-On Studio</span>
        </h1>
        <p className="text-muted text-lg max-w-xl mx-auto">
          Upload your photo and a clothing item to see how it looks on you
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className={`max-w-2xl mx-auto mb-8 p-4 rounded-xl border flex items-start gap-3 ${
          error.includes("Quota") 
            ? "bg-amber-500/10 border-amber-500/20" 
            : "bg-danger/10 border-danger/20"
        }`}>
          <AlertCircle className={`w-5 h-5 shrink-0 mt-0.5 ${
            error.includes("Quota") ? "text-amber-500" : "text-danger"
          }`} />
          <div>
            <p className={`font-medium ${
              error.includes("Quota") ? "text-amber-500" : "text-danger"
            }`}>
              {error.includes("Quota") ? "Free Quota Limit Reached" : "Something went wrong"}
            </p>
            <p className={`text-sm mt-1 ${
              error.includes("Quota") ? "text-amber-500/80" : "text-danger/80"
            }`}>
              {error.replace("AI Service error: ", "").replace('{"error":"', '').replace('"}', '')}
            </p>
          </div>
        </div>
      )}

      {/* Upload grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* User photo */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <span className="text-sm font-bold text-primary-light">1</span>
            </div>
            <h2 className="text-xl font-semibold">Your Photo</h2>
          </div>
          <ImageUploader
            id="user-photo-uploader"
            label="Upload Your Photo"
            description="Front-facing, upper body visible, single person"
            onFileSelect={handleUserImageSelect}
            preview={userImagePreview}
            onClear={() => {
              setUserImagePreview(null);
              setUserImageRecord(null);
            }}
            loading={uploadingUser}
          />
        </div>

        {/* Clothing */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-secondary/20 flex items-center justify-center">
              <span className="text-sm font-bold text-secondary">2</span>
            </div>
            <h2 className="text-xl font-semibold">Clothing Item</h2>
          </div>
          <ClothingInput
            onFileSelect={handleClothingImageSelect}
            onUrlSubmit={handleClothingUrlSubmit}
            preview={clothingImagePreview}
            onClear={() => {
              setClothingImagePreview(null);
              setClothingImageRecord(null);
            }}
            loading={uploadingClothing}
          />
        </div>
      </div>

      {/* Generate Button */}
      <div className="text-center">
        <button
          id="generate-tryon-btn"
          onClick={handleGenerate}
          disabled={!userImageRecord || !clothingImageRecord || generating}
          className="group inline-flex items-center gap-3 px-10 py-4 rounded-2xl font-semibold text-lg text-white bg-gradient-to-r from-primary to-secondary hover:from-primary-hover hover:to-secondary/90 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none transition-all duration-300 glow-hover shadow-2xl"
        >
          <Sparkles className="w-6 h-6" />
          Generate Try-On
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>

        {(!userImageRecord || !clothingImageRecord) && (
          <p className="text-sm text-muted mt-4">
            Upload both images to enable generation
          </p>
        )}
      </div>
    </div>
  );
}
