"use client";

import React, { useState } from 'react';
import ImageUploader from './ImageUploader';
import { Link, Globe, X, ArrowRight } from 'lucide-react';

type ClothingInputProps = {
  onFileSelect: (file: File) => void;
  onUrlSubmit: (url: string) => void;
  preview?: string | null;
  onClear?: () => void;
  loading?: boolean;
};

export default function ClothingInput({
  onFileSelect,
  onUrlSubmit,
  preview,
  onClear,
  loading,
}: ClothingInputProps) {
  const [inputMode, setInputMode] = useState<'upload' | 'url'>('upload');
  const [url, setUrl] = useState('');
  const [urlLoading, setUrlLoading] = useState(false);

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    setUrlLoading(true);
    try {
      await onUrlSubmit(url.trim());
    } finally {
      setUrlLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Mode toggle - Segmented Control style */}
      <div className="flex p-1.5 rounded-2xl-soft bg-secondary/50 border border-primary/5">
        <button
          onClick={() => setInputMode('upload')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl-soft text-sm font-bold transition-all duration-300 ${
            inputMode === 'upload'
              ? 'bg-white text-primary shadow-soft'
              : 'text-muted hover:text-foreground hover:bg-white/40'
          }`}
        >
          <Link className="w-4 h-4" />
          File Upload
        </button>
        <button
          onClick={() => setInputMode('url')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl-soft text-sm font-bold transition-all duration-300 ${
            inputMode === 'url'
              ? 'bg-white text-primary shadow-soft'
              : 'text-muted hover:text-foreground hover:bg-white/40'
          }`}
        >
          <Globe className="w-4 h-4" />
          Product URL
        </button>
      </div>

      {/* Content */}
      <div className="page-transition">
        {inputMode === 'upload' ? (
          <ImageUploader
            id="clothing-uploader"
            label="Clothing Image"
            description="Upload a shirt, jacket, or top with a clear background"
            onFileSelect={onFileSelect}
            preview={preview}
            onClear={onClear}
            loading={loading}
          />
        ) : (
          <div className="space-y-4">
            {preview ? (
              <div className="relative group rounded-2xl-soft overflow-hidden bg-white shadow-soft border border-border/50">
                <img src={preview} alt="Clothing" className="w-full h-80 object-cover" />
                <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                  {onClear && (
                    <button
                      onClick={onClear}
                      className="w-12 h-12 rounded-full bg-white text-danger flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white p-8 rounded-2xl-soft shadow-soft border border-border/50">
                <div className="w-16 h-16 rounded-2xl bg-secondary text-primary flex items-center justify-center mb-6 shadow-sm">
                   <Globe className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Import from URL</h3>
                <p className="text-sm text-muted mb-8 font-medium">Paste a direct link to a clothing item from any online store.</p>
                
                <form onSubmit={handleUrlSubmit} className="space-y-4">
                  <div className="relative">
                    <input
                      id="clothing-url"
                      type="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://store.com/product/image.jpg"
                      className="w-full pl-6 pr-6 py-4 bg-secondary/30 border border-transparent rounded-xl-soft text-foreground placeholder:text-muted/60 focus:outline-none focus:bg-white focus:border-primary/30 focus:ring-4 focus:ring-primary/5 transition-all font-medium"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!url.trim() || urlLoading}
                    className="w-full py-4 rounded-xl-soft font-bold text-white bg-primary hover:bg-primary-hover disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-glow flex items-center justify-center gap-2 group"
                  >
                    {urlLoading ? (
                       <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                       <>
                        Fetch Item
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                       </>
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
