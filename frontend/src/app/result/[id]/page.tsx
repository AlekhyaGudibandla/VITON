"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import TryOnResult from "@/components/tryon/TryOnResult";
import { getTryOnResult, TryOnResult as TryOnResultType } from "@/lib/api";
import { AlertCircle } from "lucide-react";

export default function ResultPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [result, setResult] = useState<TryOnResultType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const resultId = params.id as string;

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }

    if (user && resultId) {
      fetchResult();
    }
  }, [user, authLoading, resultId]);

  const fetchResult = async () => {
    try {
      const response = await getTryOnResult(resultId);
      setResult(response.result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted">Loading result...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <div className="glass rounded-2xl p-8">
          <AlertCircle className="w-12 h-12 text-danger mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Error Loading Result</h2>
          <p className="text-muted mb-6">{error}</p>
          <button
            onClick={() => router.push("/dashboard")}
            className="px-6 py-3 rounded-xl font-medium text-white bg-gradient-to-r from-primary to-secondary transition-all"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!result) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <TryOnResult
        result={result}
        onTryAnother={() => router.push("/dashboard")}
      />
    </div>
  );
}
