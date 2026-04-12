"use client";

import React, { useCallback, useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, CheckCircle } from 'lucide-react';

type ImageUploaderProps = {
  label: string;
  description: string;
  accept?: string;
  onFileSelect: (file: File) => void;
  preview?: string | null;
  onClear?: () => void;
  loading?: boolean;
  id?: string;
};

export default function ImageUploader({
  label,
  description,
  accept = 'image/jpeg,image/png,image/webp',
  onFileSelect,
  preview,
  onClear,
  loading,
  id = 'image-uploader',
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) {
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  if (preview) {
    return (
      <div className="relative group rounded-2xl overflow-hidden border border-border bg-card">
        <img
          src={preview}
          alt={label}
          className="w-full h-64 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-white">
              <CheckCircle className="w-4 h-4 text-success" />
              <span className="text-sm font-medium">{label}</span>
            </div>
            {onClear && (
              <button
                onClick={onClear}
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
                aria-label="Remove image"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
        {loading && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <svg className="w-8 h-8 animate-spin text-primary" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              <span className="text-sm text-muted">Uploading...</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      id={id}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
      className={`
        relative cursor-pointer rounded-2xl border-2 border-dashed p-8
        flex flex-col items-center justify-center min-h-[256px]
        transition-all duration-300
        ${isDragging
          ? 'border-primary bg-primary/5 scale-[1.02]'
          : 'border-border hover:border-primary/50 hover:bg-card/50'
        }
      `}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />

      <div className={`
        w-16 h-16 rounded-2xl flex items-center justify-center mb-4
        ${isDragging ? 'bg-primary/20' : 'bg-card'}
        transition-colors
      `}>
        {isDragging ? (
          <Upload className="w-8 h-8 text-primary animate-bounce" />
        ) : (
          <ImageIcon className="w-8 h-8 text-muted" />
        )}
      </div>

      <h3 className="text-lg font-semibold text-foreground mb-1">{label}</h3>
      <p className="text-sm text-muted text-center mb-4">{description}</p>

      <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 text-primary-light text-sm font-medium">
        <Upload className="w-4 h-4" />
        <span>Click or drag to upload</span>
      </div>

      <p className="text-xs text-muted mt-3">JPEG, PNG, WebP • Max 10MB</p>
    </div>
  );
}
