"use client";

import React, { useState, useCallback } from 'react';
import { Upload, Link as LinkIcon, X, Loader2, Shirt, Image as ImageIcon } from 'lucide-react';

type ClothingInputProps = {
  onFileSelect: (file: File) => void;
  onUrlSubmit: (url: string) => void;
  preview: string | null;
  onClear: () => void;
  loading?: boolean;
};

export default function ClothingInput({ 
  onFileSelect, 
  onUrlSubmit, 
  preview, 
  onClear,
  loading 
}: ClothingInputProps) {
  const [url, setUrl] = useState('');
  const [activeTab, setActiveTab] = useState<'upload' | 'url'>('upload');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url) {
      onUrlSubmit(url);
    }
  };

  if (preview) {
    return (
      <div className="relative group animate-fadeIn">
        <div className="bg-white p-4 rounded-3xl-soft shadow-glow border-2 border-primary/20 overflow-hidden">
          <div className="flex items-center justify-between mb-4 px-2">
             <div className="flex items-center gap-2">
                <Shirt className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold uppercase tracking-widest text-primary">Clothing Item Selected</span>
             </div>
             <button 
              onClick={onClear}
              className="p-1.5 rounded-full hover:bg-danger/10 text-muted hover:text-danger transition-colors"
             >
                <X className="w-4 h-4" />
             </button>
          </div>
          <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-secondary/20 relative">
            <img 
              src={preview} 
              alt="Clothing preview" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
            />
            {loading && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl-soft border border-border/50 shadow-soft overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-border/50">
        <button
          onClick={() => setActiveTab('upload')}
          className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'upload' 
              ? 'text-primary bg-primary/5 border-b-2 border-primary' 
              : 'text-muted hover:text-foreground'
          }`}
        >
          <Upload className="w-4 h-4" />
          Upload Image
        </button>
        <button
          onClick={() => setActiveTab('url')}
          className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'url' 
              ? 'text-primary bg-primary/5 border-b-2 border-primary' 
              : 'text-muted hover:text-foreground'
          }`}
        >
          <LinkIcon className="w-4 h-4" />
          Paste URL
        </button>
      </div>

      <div className="p-8">
        {activeTab === 'upload' ? (
          <label className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-border/60 rounded-2xl hover:border-primary/40 hover:bg-primary/5 cursor-pointer transition-all group">
            <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <ImageIcon className="w-8 h-8 text-primary" />
            </div>
            <p className="text-lg font-bold mb-2">Drop clothing image here</p>
            <p className="text-sm text-muted font-medium mb-6">PNG, JPG or WebP up to 5MB</p>
            <span className="px-6 py-2.5 rounded-xl bg-white border border-border text-xs font-bold text-foreground shadow-sm group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all">
              Choose File
            </span>
            <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
          </label>
        ) : (
          <form onSubmit={handleUrlSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted ml-1">Clothing Image URL</label>
              <div className="relative">
                <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted/40" />
                <input
                  type="url"
                  placeholder="https://example.com/item.jpg"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-secondary/30 border border-transparent rounded-xl-soft text-foreground focus:outline-none focus:bg-white focus:border-primary/30 transition-all font-medium"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading || !url}
              className="w-full py-4 rounded-xl font-bold text-white bg-primary hover:bg-primary-hover shadow-glow disabled:opacity-40 transition-all"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Fetch Clothing Item'}
            </button>
            <p className="text-[10px] text-center text-muted font-bold uppercase tracking-widest">
              Supports Direct Image Links
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
