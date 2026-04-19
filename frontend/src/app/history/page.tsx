"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import HistoryCard from "@/components/tryon/HistoryCard";
import { getTryOnHistory, TryOnResult } from "@/lib/api";
import { History, Sparkles, Plus } from "lucide-react";
import Link from "next/link";

export default function HistoryPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [history, setHistory] = useState<TryOnResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }

    if (user) {
      fetchHistory();
    }
  }, [user, authLoading]);

  const fetchHistory = async () => {
    try {
      const response = await getTryOnHistory();
      setHistory(response.history);
    } catch (err) {
      console.error("Failed to fetch history:", err);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
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
              Your Collection
           </div>
           <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
             Fittings <span className="text-primary italic">Gallery</span>
           </h1>
           <p className="text-muted mt-2 font-medium">
             {history.length} virtual generation{history.length !== 1 ? "s" : ""} saved
           </p>
        </div>
        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl-soft font-bold text-white bg-primary hover:bg-primary-hover transition-all shadow-glow group hover:scale-105"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
          Create New Try-On
        </Link>
      </div>

      {/* History grid */}
      {history.length === 0 ? (
        <div className="bg-white rounded-3xl-soft border border-border/50 p-20 text-center shadow-soft relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />
          
          <div className="w-24 h-24 mx-auto rounded-3xl bg-secondary flex items-center justify-center mb-8 shadow-sm">
            <History className="w-12 h-12 text-primary" />
          </div>
          <h2 className="text-3xl font-bold mb-4 tracking-tight">Your gallery is empty</h2>
          <p className="text-muted mb-10 max-w-md mx-auto font-medium">
            Start your virtual fashion journey today. Upload your first photo and try on some clothes!
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl-soft font-bold text-lg text-white bg-primary shadow-glow hover:scale-105 active:scale-95 transition-all"
          >
            <Sparkles className="w-6 h-6" />
            Start First Fitting
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {history.map((item) => (
            <HistoryCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
