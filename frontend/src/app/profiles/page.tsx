"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { Profile, getProfiles, deleteProfile } from "@/lib/api";
import ProfileCard from "@/components/profiles/ProfileCard";
import { User, Plus, Loader2 } from "lucide-react";
import Link from "next/link";
import ProfileSelector from "@/components/profiles/ProfileSelector";

export default function ProfilesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);
  if (authLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="page-transition max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-primary text-[10px] font-bold uppercase tracking-widest mb-4">
              Management
           </div>
           <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
             Identity <span className="text-primary italic">Manager</span>
           </h1>
           <p className="text-muted mt-2 font-medium">
             Manage your saved models for quick try-ons.
           </p>
        </div>
      </div>

      <div className="bg-white/30 rounded-3xl-soft border border-border/50 p-8 md:p-12">
        <ProfileSelector 
          selectedProfileId={null} 
          onSelect={() => {}} 
          mode="management"
        />
      </div>
    </div>
  );
}
