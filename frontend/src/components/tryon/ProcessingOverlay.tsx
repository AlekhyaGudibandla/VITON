"use client";

import React from 'react';
import { Sparkles } from 'lucide-react';

export default function ProcessingOverlay() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-md">
      <div className="flex flex-col items-center gap-8 max-w-md text-center px-6">
        {/* Animated spinner */}
        <div className="relative">
          {/* Outer ring */}
          <div className="w-32 h-32 rounded-full border-4 border-border animate-spin-slow" />
          {/* Inner ring */}
          <div className="absolute inset-2 rounded-full border-4 border-t-primary border-r-primary/50 border-b-transparent border-l-transparent animate-spin" />
          {/* Center icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center animate-pulse-glow">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-bold gradient-text mb-3">
            Generating Your Virtual Try-On
          </h3>
          <p className="text-muted leading-relaxed">
            Our AI is analyzing your photo, detecting body pose, and virtually fitting the clothing...
          </p>
        </div>

        {/* Progress steps */}
        <div className="w-full space-y-3">
          {[
            { label: 'Analyzing body pose', delay: '0s' },
            { label: 'Segmenting body regions', delay: '2s' },
            { label: 'Warping clothing to fit', delay: '4s' },
            { label: 'Generating final image', delay: '6s' },
          ].map((step, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-card border border-border"
              style={{ animation: `fadeIn 0.5s ease-out ${step.delay} both` }}
            >
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm text-muted">{step.label}</span>
            </div>
          ))}
        </div>

        <p className="text-xs text-muted">
          This usually takes 5–20 seconds
        </p>
      </div>
    </div>
  );
}
