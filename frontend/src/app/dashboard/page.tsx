"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import ProfileSelector from "@/components/profiles/ProfileSelector";
import ClothingInput from "@/components/tryon/ClothingInput";
import TryOnResult from "@/components/tryon/TryOnResult";
import ProcessingOverlay from "@/components/tryon/ProcessingOverlay";
import {
  uploadClothingImage,
  uploadClothingUrl,
  generateTryOn,
  ImageRecord,
  TryOnResult as TryOnResultType,
  Profile,
} from "@/lib/api";
import { Sparkles, ArrowRight, AlertCircle, Info, User } from "lucide-react";

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  // Selected Profile
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);

  // Clothing states
  const [clothingImagePreview, setClothingImagePreview] = useState<string | null>(null);
  const [clothingImageRecord, setClothingImageRecord] = useState<ImageRecord | null>(null);

  // Loading and result states
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
    if (!selectedProfile || !clothingImageRecord) return;

    setError(null);
    setGenerating(true);

    try {
      const response = await generateTryOn(null, clothingImageRecord.id, selectedProfile.id);
      setResult(response.result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  }, [selectedProfile, clothingImageRecord]);

  const handleTryAnother = useCallback(() => {
    setResult(null);
    setClothingImagePreview(null);
    setClothingImageRecord(null);
    setError(null);
  }, []);

  if (authLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
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
    <div className="page-transition max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest mb-4">
           Virtual Fitting Room
        </div>
        <h1 className="text-4xl sm:text-6xl font-bold mb-4 tracking-tight">
          AI <span className="text-primary italic">Style Studio</span>
        </h1>
        <p className="text-muted text-lg max-w-xl mx-auto font-medium">
          Pick an identity and upload an outfit to see the magic happen.
        </p>
      </div>

      {/* Error / Feedback */}
      {error && (
        <div className={`max-w-2xl mx-auto mb-10 p-5 rounded-2xl-soft border shadow-sm flex items-start gap-4 transition-all animate-fadeIn ${
          error.includes("Quota") 
            ? "bg-amber-50 border-amber-200" 
            : "bg-danger/5 border-danger/10"
        }`}>
          <div className={`p-2 rounded-xl ${error.includes("Quota") ? "bg-amber-100 text-amber-600" : "bg-danger/10 text-danger"}`}>
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <p className={`font-bold ${
              error.includes("Quota") ? "text-amber-800" : "text-danger"
            }`}>
              {error.includes("Quota") ? "Free Quota Limit Reached" : "Oops! Something went wrong"}
            </p>
            <p className={`text-sm mt-1 font-medium ${
              error.includes("Quota") ? "text-amber-700/80" : "text-danger/80"
            }`}>
              {error.replace("AI Service error: ", "").replace('{"error":"', '').replace('"}', '')}
            </p>
          </div>
        </div>
      )}

      {/* Workspace Area */}
      <div className="space-y-16 mb-24">
        {/* Step 1: Profile Selection */}
        <section className="space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-primary text-white flex items-center justify-center font-bold shadow-glow">
                1
              </div>
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Choose Identity</h2>
                <p className="text-sm text-muted font-medium">Select who is trying on the clothes</p>
              </div>
            </div>
            {selectedProfile && (
               <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 text-success text-[10px] font-bold uppercase">
                  <User className="w-3 h-3" /> {selectedProfile.name}
               </div>
            )}
          </div>
          
          <div className="bg-white/50 p-8 rounded-3xl-soft border border-border/50">
            <ProfileSelector 
              selectedProfileId={selectedProfile?.id || null} 
              onSelect={setSelectedProfile} 
            />
          </div>
        </section>

        {/* Step 2: Clothing Selection */}
        <section className="space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-primary-light text-primary flex items-center justify-center font-bold shadow-sm">
                2
              </div>
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Fashion Item</h2>
                <p className="text-sm text-muted font-medium">Upload or paste a URL for the clothing item</p>
              </div>
            </div>
            {clothingImageRecord && (
               <div className="flex items-center gap-1 text-success text-xs font-bold uppercase">
                  <Info className="w-3 h-3" /> Item Ready
               </div>
            )}
          </div>

          <div className="max-w-4xl">
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
        </section>
      </div>

      {/* Action Bar */}
      <div className="sticky bottom-8 z-30 flex justify-center">
        <div className="glass p-4 rounded-3xl-soft shadow-2xl flex flex-col items-center gap-4 border-white/50 min-w-[320px]">
          <button
            id="generate-tryon-btn"
            onClick={handleGenerate}
            disabled={!selectedProfile || !clothingImageRecord || generating}
            className="w-full group inline-flex items-center justify-center gap-3 px-10 py-5 rounded-2xl-soft font-bold text-xl text-white bg-primary hover:bg-primary-hover disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 shadow-glow"
          >
            <Sparkles className="w-6 h-6" />
            Generate Try-On
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          {!selectedProfile || !clothingImageRecord ? (
            <p className="text-[10px] font-bold text-muted uppercase tracking-widest">
              Pick a profile and clothing to continue
            </p>
          ) : (
            <p className="text-[10px] font-bold text-primary uppercase tracking-widest animate-pulse">
              Ready to create your look
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
