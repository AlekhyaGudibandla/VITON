"use client";

import React, { useCallback, useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, CheckCircle, Plus } from 'lucide-react';

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
      <div className="relative group rounded-2xl-soft overflow-hidden bg-white shadow-soft transition-all duration-300 hover:shadow-glow border border-border/50">
        <img
          src={preview}
          alt={label}
          className="w-full h-80 object-cover"
        />
        <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
           <div className="flex gap-3">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="w-12 h-12 rounded-full bg-white text-primary flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                title="Change image"
              >
                 <Upload className="w-5 h-5" />
              </button>
              {onClear && (
                <button
                  onClick={onClear}
                  className="w-12 h-12 rounded-full bg-white text-danger flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                  title="Remove image"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
           </div>
        </div>
        
        <div className="absolute bottom-4 left-4 right-4 py-2 px-4 glass rounded-xl flex items-center justify-between">
           <span className="text-xs font-bold text-foreground truncate max-w-[150px]">{label}</span>
           <CheckCircle className="w-4 h-4 text-success" />
        </div>

        {loading && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center backdrop-blur-md">
            <div className="flex flex-col items-center gap-4">
              <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
              <span className="text-sm font-bold text-primary">Uploading...</span>
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
        relative cursor-pointer rounded-2xl-soft border-2 border-dashed p-10
        flex flex-col items-center justify-center min-h-[320px]
        transition-all duration-500
        ${isDragging
          ? 'border-primary bg-primary/5 scale-[1.02] shadow-glow'
          : 'border-border/60 bg-white hover:border-primary/40 hover:bg-secondary/20 hover:shadow-soft'
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
        w-20 h-20 rounded-2xl flex items-center justify-center mb-6
        ${isDragging ? 'bg-primary text-white' : 'bg-secondary text-primary'}
        transition-all duration-300 shadow-sm
      `}>
        {isDragging ? (
          <Plus className="w-10 h-10 animate-pulse" />
        ) : (
          <ImageIcon className="w-10 h-10" />
        )}
      </div>

      <h3 className="text-xl font-bold text-foreground mb-2">{label}</h3>
      <p className="text-sm text-muted text-center mb-8 max-w-[240px] font-medium leading-relaxed">
        {description}
      </p>

      <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-bold shadow-glow hover:bg-primary-hover transition-colors">
        <Upload className="w-4 h-4" />
        <span>Choose File</span>
      </div>

      <p className="text-[10px] text-muted font-bold uppercase tracking-widest mt-6">
        PNG, JPEG, WEBP • MAX 10MB
      </p>
    </div>
  );
}
