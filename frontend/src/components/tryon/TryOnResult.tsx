"use client";

import React from 'react';
import { Download, RefreshCw, Clock, CheckCircle } from 'lucide-react';
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
    <div className="page-transition space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 border border-success/20 mb-4">
          <CheckCircle className="w-4 h-4 text-success" />
          <span className="text-sm text-success font-medium">Try-On Complete</span>
        </div>
        <h2 className="text-3xl font-bold gradient-text mb-2">Your Virtual Try-On</h2>
        {result.processing_time_ms && (
          <div className="flex items-center justify-center gap-1 text-sm text-muted">
            <Clock className="w-3.5 h-3.5" />
            <span>Generated in {(result.processing_time_ms / 1000).toFixed(1)}s</span>
          </div>
        )}
      </div>

      {/* Image comparison */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User image */}
        <div className="glass rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-border">
            <h3 className="text-sm font-semibold text-muted uppercase tracking-wider">Your Photo</h3>
          </div>
          <div className="aspect-[3/4] bg-card">
            <img
              src={result.user_image_url}
              alt="Your photo"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Clothing */}
        <div className="glass rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-border">
            <h3 className="text-sm font-semibold text-muted uppercase tracking-wider">Clothing</h3>
          </div>
          <div className="aspect-[3/4] bg-card">
            <img
              src={result.clothing_image_url}
              alt="Clothing"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Result */}
        <div className="gradient-border rounded-2xl overflow-hidden">
          <div className="glass rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-border bg-gradient-to-r from-primary/10 to-secondary/10">
              <h3 className="text-sm font-semibold gradient-text uppercase tracking-wider">Try-On Result</h3>
            </div>
            <div className="aspect-[3/4] bg-card">
              {result.result_url ? (
                <img
                  src={result.result_url}
                  alt="Try-on result"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted">
                  No result available
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          id="download-result"
          onClick={handleDownload}
          disabled={!result.result_url}
          className="flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-primary to-secondary hover:from-primary-hover hover:to-secondary/90 disabled:opacity-50 transition-all glow-hover shadow-lg"
        >
          <Download className="w-5 h-5" />
          Download Result
        </button>

        {onTryAnother && (
          <button
            id="try-another"
            onClick={onTryAnother}
            className="flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-foreground border border-border hover:border-primary/50 hover:bg-card transition-all"
          >
            <RefreshCw className="w-5 h-5" />
            Try Another Outfit
          </button>
        )}
      </div>
    </div>
  );
}
