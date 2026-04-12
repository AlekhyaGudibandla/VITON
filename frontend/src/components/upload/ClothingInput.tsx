"use client";

import React, { useState } from 'react';
import ImageUploader from './ImageUploader';
import { Link, Globe } from 'lucide-react';

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
    <div className="space-y-4">
      {/* Mode toggle */}
      <div className="flex rounded-xl overflow-hidden border border-border bg-card">
        <button
          onClick={() => setInputMode('upload')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-all ${
            inputMode === 'upload'
              ? 'bg-primary/20 text-primary-light border-r border-primary/30'
              : 'text-muted hover:text-foreground hover:bg-card-hover border-r border-border'
          }`}
        >
          <Link className="w-4 h-4" />
          Upload Image
        </button>
        <button
          onClick={() => setInputMode('url')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-all ${
            inputMode === 'url'
              ? 'bg-primary/20 text-primary-light'
              : 'text-muted hover:text-foreground hover:bg-card-hover'
          }`}
        >
          <Globe className="w-4 h-4" />
          Paste URL
        </button>
      </div>

      {/* Content */}
      {inputMode === 'upload' ? (
        <ImageUploader
          id="clothing-uploader"
          label="Clothing Image"
          description="Upload a shirt, jacket, or top image with clear background"
          onFileSelect={onFileSelect}
          preview={preview}
          onClear={onClear}
          loading={loading}
        />
      ) : (
        <div className="space-y-3">
          {preview ? (
            <div className="relative group rounded-2xl overflow-hidden border border-border bg-card">
              <img src={preview} alt="Clothing" className="w-full h-64 object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-4 right-4">
                  {onClear && (
                    <button
                      onClick={onClear}
                      className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleUrlSubmit} className="space-y-3">
              <div className="relative">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                <input
                  id="clothing-url"
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Paste clothing product URL..."
                  className="w-full pl-12 pr-4 py-3.5 bg-background border border-border rounded-xl text-foreground placeholder-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={!url.trim() || urlLoading}
                className="w-full py-3 rounded-xl font-medium text-white bg-gradient-to-r from-primary to-secondary hover:from-primary-hover hover:to-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {urlLoading ? 'Fetching Image...' : 'Fetch Clothing Image'}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
