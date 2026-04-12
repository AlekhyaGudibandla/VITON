"use client";

import React from 'react';
import Link from 'next/link';
import { useAuth } from '../auth/AuthProvider';
import { Sparkles, LogOut, History, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const { user, signOut } = useAuth();

  return (
    <nav className="sticky top-0 z-40 glass border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg group-hover:shadow-primary/30 transition-shadow">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold gradient-text">VirtualFit</span>
          </Link>

          {/* Navigation */}
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-muted hover:text-foreground hover:bg-card transition-all"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>
                <Link
                  href="/history"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-muted hover:text-foreground hover:bg-card transition-all"
                >
                  <History className="w-4 h-4" />
                  <span className="hidden sm:inline">History</span>
                </Link>
                <div className="w-px h-6 bg-border mx-1" />
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted hidden sm:inline">
                    {user.email}
                  </span>
                  <button
                    onClick={signOut}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-muted hover:text-danger hover:bg-danger/10 transition-all"
                    title="Sign out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <Link
                href="/login"
                className="px-5 py-2.5 rounded-xl font-medium text-sm text-white bg-gradient-to-r from-primary to-secondary hover:from-primary-hover transition-all shadow-lg"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
