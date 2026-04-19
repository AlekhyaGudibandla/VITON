"use client";

import React from 'react';
import { Download, RefreshCw, Clock, CheckCircle, Sparkles } from 'lucide-react';
import { TryOnResult as TryOnResultType } from '@/lib/api';

type TryOnResultProps = {
  result: TryOnResultType;
  onTryAnother?: () => void;
};

export default function TryOnResult({ result, onTryAnother }: TryOnResultProps) {
  const handleDownload = async () => {
    if (!result.result_url) return;

    try {
      const response = await fetch(result.result_url);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tryon-result-${result.id}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      window.open(result.result_url, '_blank');
    }
  };

  return (
    <div className="page-transition space-y-12">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-success/10 text-success text-[10px] font-bold uppercase tracking-widest mb-4">
           Ready to Wear
        </div>
        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
          Your New <span className="text-primary italic">Style</span>
        </h2>
        {result.processing_time_ms && (
          <div className="flex items-center justify-center gap-2 text-sm text-muted font-medium">
            <Clock className="w-4 h-4" />
            <span>Generated in {(result.processing_time_ms / 1000).toFixed(1)} seconds</span>
          </div>
        )}
      </div>

      {/* Image comparison grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Source images column */}
        <div className="lg:col-span-4 space-y-6 order-2 lg:order-1">
          <div className="bg-white p-4 rounded-2xl-soft shadow-soft border border-border/50">
            <div className="flex items-center justify-between mb-3 px-2">
               <span className="text-xs font-bold uppercase tracking-widest text-muted">Original</span>
               <CheckCircle className="w-4 h-4 text-success" />
            </div>
            <div className="aspect-[3/4] rounded-xl overflow-hidden bg-secondary/30">
              <img
                src={result.user_image_url}
                alt="Your photo"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl-soft shadow-soft border border-border/50">
            <div className="flex items-center justify-between mb-3 px-2">
               <span className="text-xs font-bold uppercase tracking-widest text-muted">Clothing</span>
               <CheckCircle className="w-4 h-4 text-success" />
            </div>
            <div className="aspect-[3/4] rounded-xl overflow-hidden bg-secondary/30">
              <img
                src={result.clothing_image_url}
                alt="Clothing"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Arrow / Connector (only visible on desktop) */}
        <div className="hidden lg:flex lg:col-span-1 flex-col items-center justify-center gap-4 order-2">
           <div className="w-10 h-10 rounded-full bg-secondary text-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
           </div>
           <div className="h-24 w-px bg-gradient-to-b from-primary/30 to-transparent" />
        </div>

        {/* Result column */}
        <div className="lg:col-span-7 order-1 lg:order-3">
          <div className="bg-white p-6 rounded-3xl-soft shadow-glow border-2 border-primary/10 relative">
            <div className="flex items-center justify-between mb-4 px-2">
               <span className="text-sm font-bold uppercase tracking-widest text-primary">Final Result</span>
               <div className="flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <div className="w-2 h-2 rounded-full bg-primary/40" />
                  <div className="w-2 h-2 rounded-full bg-primary/20" />
               </div>
            </div>
            <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-secondary/10">
              {result.result_url ? (
                <img
                  src={result.result_url}
                  alt="Try-on result"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted italic font-medium">
                  Generation in progress or failed
                </div>
              )}
            </div>
            
            {/* Download Badge overlay */}
            {result.result_url && (
              <button 
                onClick={handleDownload}
                className="absolute bottom-10 right-10 w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center shadow-glow hover:scale-110 active:scale-95 transition-all"
                title="Download image"
              >
                <Download className="w-6 h-6" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
        <button
          id="try-another"
          onClick={onTryAnother}
          className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-5 rounded-2xl-soft font-bold text-lg text-foreground bg-white border border-border hover:border-primary/30 hover:bg-secondary transition-all shadow-soft"
        >
          <RefreshCw className="w-5 h-5" />
          Try Another Outfit
        </button>
        
        <button
          onClick={handleDownload}
          disabled={!result.result_url}
          className="w-full sm:w-auto flex items-center justify-center gap-3 px-12 py-5 rounded-2xl-soft font-bold text-lg text-white bg-primary hover:bg-primary-hover disabled:opacity-40 transition-all shadow-glow hover:scale-105 active:scale-95"
        >
          <Download className="w-5 h-5" />
          Save to Collection
        </button>
      </div>
    </div>
  );
}
