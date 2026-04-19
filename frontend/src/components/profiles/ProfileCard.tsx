"use client";

import React from 'react';
import { User, Trash2, Check } from 'lucide-react';
import { Profile } from '@/lib/api';

type ProfileCardProps = {
  profile: Profile;
  isSelected?: boolean;
  onSelect?: (profile: Profile) => void;
  onDelete?: (id: string) => void;
  mode?: 'selection' | 'management';
};

export default function ProfileCard({ 
  profile, 
  isSelected, 
  onSelect, 
  onDelete,
  mode = 'selection'
}: ProfileCardProps) {
  return (
    <div 
      onClick={() => onSelect?.(profile)}
      className={`relative group cursor-pointer transition-all duration-500 ${
        isSelected 
          ? 'ring-4 ring-primary ring-offset-4 ring-offset-background' 
          : 'hover:-translate-y-1'
      }`}
    >
      <div className={`bg-white rounded-2xl-soft overflow-hidden shadow-soft border ${
        isSelected ? 'border-primary' : 'border-border/50'
      }`}>
        {/* Profile Image */}
        <div className="aspect-square relative overflow-hidden bg-secondary/20">
          <img 
            src={profile.url} 
            alt={profile.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          
          {/* Selected Overlay */}
          {isSelected && (
            <div className="absolute inset-0 bg-primary/10 flex items-center justify-center backdrop-blur-[2px]">
              <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-glow animate-fadeIn">
                <Check className="w-6 h-6" />
              </div>
            </div>
          )}
        </div>

        {/* Profile Info */}
        <div className="p-4 flex items-center justify-between bg-white">
          <div className="flex flex-col">
            <span className={`text-sm font-bold tracking-tight ${isSelected ? 'text-primary' : 'text-foreground'}`}>
              {profile.name}
            </span>
            <span className="text-[10px] text-muted uppercase tracking-widest font-bold">
              Profile
            </span>
          </div>

          {mode === 'management' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (confirm('Are you sure you want to delete this profile?')) {
                  onDelete?.(profile.id);
                }
              }}
              className="p-2 rounded-xl text-muted hover:text-danger hover:bg-danger/5 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
