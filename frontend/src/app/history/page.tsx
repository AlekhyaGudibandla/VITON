"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import HistoryCard from "@/components/tryon/HistoryCard";
import { getTryOnHistory, TryOnResult } from "@/lib/api";
import { History, Sparkles } from "lucide-react";
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
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="page-transition max-w-6xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            Try-On <span className="gradient-text">History</span>
          </h1>
          <p className="text-muted">
            {history.length} generation{history.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/dashboard"
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-white bg-gradient-to-r from-primary to-secondary hover:from-primary-hover transition-all shadow-lg"
        >
          <Sparkles className="w-4 h-4" />
          New Try-On
        </Link>
      </div>

      {/* History grid */}
      {history.length === 0 ? (
        <div className="text-center py-24">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-card flex items-center justify-center mb-6">
            <History className="w-10 h-10 text-muted" />
          </div>
          <h2 className="text-xl font-semibold mb-2">No History Yet</h2>
          <p className="text-muted mb-8">
            Your virtual try-on results will appear here
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-white bg-gradient-to-r from-primary to-secondary transition-all"
          >
            <Sparkles className="w-4 h-4" />
            Create Your First Try-On
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {history.map((item) => (
            <HistoryCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
