"use client";

import React from 'react';
import Link from 'next/link';
import { useAuth } from '../auth/AuthProvider';
import { Sparkles, LogOut, History, LayoutDashboard, User, Users } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'History', href: '/history', icon: History },
    { name: 'Profiles', href: '/profiles', icon: Users },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="sticky top-0 z-50 px-4 py-4">
      <div className="max-w-7xl mx-auto">
        <div className="glass rounded-2xl-soft px-6 py-3 flex items-center justify-between transition-all duration-300">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center shadow-soft group-hover:scale-105 transition-transform">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground tracking-tight">Virtual<span className="text-primary">Fit</span></span>
          </Link>

          {/* Navigation */}
          <div className="flex items-center gap-1 sm:gap-4">
            {user ? (
              <>
                <div className="flex items-center bg-secondary/50 p-1 rounded-xl-soft mr-2">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        isActive(item.href) 
                          ? 'bg-white text-primary shadow-soft' 
                          : 'text-muted hover:text-foreground'
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                      <span className="hidden md:inline">{item.name}</span>
                    </Link>
                  ))}
                </div>
                
                <div className="flex items-center gap-2 pl-2 border-l border-border">
                  <div className="hidden sm:flex flex-col items-end mr-2">
                    <span className="text-xs font-semibold text-foreground leading-none">
                      {user.email?.split('@')[0]}
                    </span>
                    <span className="text-[10px] text-muted font-bold tracking-tight uppercase">
                      Studio User
                    </span>
                  </div>
                  <button
                    onClick={signOut}
                    className="flex items-center justify-center w-10 h-10 rounded-xl bg-white border border-border text-muted hover:text-danger hover:border-danger/30 hover:bg-danger/5 transition-all shadow-sm"
                    title="Sign out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  href="/login"
                  className="hidden sm:block text-sm font-medium text-muted hover:text-foreground px-4 py-2 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="px-6 py-2.5 rounded-xl-soft font-semibold text-sm text-white bg-primary hover:bg-primary-hover transition-all shadow-glow hover:scale-105 active:scale-95"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
