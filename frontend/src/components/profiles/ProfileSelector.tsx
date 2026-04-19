"use client";

import React, { useState, useEffect } from 'react';
import { Plus, User, Loader2, X, Upload } from 'lucide-react';
import { Profile, getProfiles, createProfile, deleteProfile } from '@/lib/api';
import ProfileCard from './ProfileCard';

type ProfileSelectorProps = {
  selectedProfileId: string | null;
  onSelect: (profile: Profile | null) => void;
  mode?: 'selection' | 'management';
};

export default function ProfileSelector({ 
  selectedProfileId, 
  onSelect, 
  mode = 'selection' 
}: ProfileSelectorProps) {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [newProfileFile, setNewProfileFile] = useState<File | null>(null);
  const [newProfilePreview, setNewProfilePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      const response = await getProfiles();
      setProfiles(response.profiles);
      // Auto-select first profile if none selected
      if (response.profiles.length > 0 && !selectedProfileId) {
        onSelect(response.profiles[0]);
      }
    } catch (err) {
      console.error('Failed to fetch profiles:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewProfileFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProfilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setNewProfileName('');
    setNewProfileFile(null);
    setNewProfilePreview(null);
  };

  const handleAddProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProfileName || !newProfileFile) return;

    // Check for duplicates
    if (profiles.some(p => p.name.toLowerCase() === newProfileName.toLowerCase())) {
      alert('A profile with this name already exists. Please choose a unique name.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await createProfile(newProfileName, newProfileFile);
      setProfiles([response.profile, ...profiles]);
      onSelect(response.profile);
      setIsAdding(false);
      resetForm();
    } catch (err) {
      console.error('Failed to create profile:', err);
      alert('Failed to create profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProfile(id);
      setProfiles(profiles.filter(p => p.id !== id));
      if (selectedProfileId === id) {
        onSelect(null);
      }
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  if (loading) {
    return (
      <div className="h-40 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {profiles.map((profile) => (
          <ProfileCard
            key={profile.id}
            profile={profile}
            isSelected={selectedProfileId === profile.id}
            onSelect={onSelect}
            mode={mode}
            onDelete={handleDelete}
          />
        ))}
        
        {/* Add New Profile Trigger */}
        <button
          onClick={() => setIsAdding(true)}
          className="aspect-square rounded-2xl-soft border-2 border-dashed border-primary/20 hover:border-primary/50 hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-2 group"
        >
          <div className="w-10 h-10 rounded-full bg-secondary text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
            <Plus className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold text-muted group-hover:text-primary transition-colors">Add Profile</span>
        </button>
      </div>

      {/* Add Profile Modal-ish Overlay */}
      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-3xl-soft shadow-2xl border border-border/50 p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">New Identity</h3>
              <button onClick={() => setIsAdding(false)} className="p-2 hover:bg-secondary rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddProfile} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted ml-1">Profile Name</label>
                <input
                  type="text"
                  placeholder="e.g. Alekhya, My Style"
                  value={newProfileName}
                  onChange={(e) => setNewProfileName(e.target.value)}
                  className="w-full px-4 py-3.5 bg-secondary/30 border border-transparent rounded-xl-soft text-foreground focus:outline-none focus:bg-white focus:border-primary/30 transition-all font-medium"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted ml-1">Profile Image</label>
                {newProfilePreview ? (
                  <div className="relative aspect-square rounded-2xl-soft overflow-hidden group">
                    <img src={newProfilePreview} className="w-full h-full object-cover" />
                    <button 
                      type="button"
                      onClick={() => { setNewProfileFile(null); setNewProfilePreview(null); }}
                      className="absolute top-2 right-2 p-1.5 bg-white shadow-lg rounded-full text-danger opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center aspect-square rounded-2xl-soft border-2 border-dashed border-primary/20 hover:border-primary/40 bg-secondary/10 cursor-pointer transition-all">
                    <Upload className="w-8 h-8 text-primary/40 mb-2" />
                    <span className="text-xs font-bold text-muted">Click to upload photo</span>
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                  </label>
                )}
              </div>

              <button
                type="submit"
                disabled={!newProfileName || !newProfileFile || isSubmitting}
                className="w-full py-4 rounded-xl-soft font-bold text-white bg-primary hover:bg-primary-hover disabled:opacity-40 transition-all shadow-glow"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Create Profile'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
