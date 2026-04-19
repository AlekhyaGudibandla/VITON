"use client";

import React, { useState } from 'react';
import { useAuth } from './AuthProvider';
import { Eye, EyeOff, Mail, Lock, User, Sparkles, ArrowRight } from 'lucide-react';

type AuthFormProps = {
  mode: 'login' | 'signup';
  onToggleMode?: () => void;
};

export default function AuthForm({ mode, onToggleMode }: AuthFormProps) {
  const { signIn, signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (mode === 'signup') {
        await signUp(email, password, fullName);
        setSuccess('Account created! Check your email to verify.');
      } else {
        await signIn(email, password);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto page-transition">
      <div className="bg-white rounded-3xl-soft p-10 shadow-soft border border-border/50 relative overflow-hidden">
        {/* Background decorative element */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        
        {/* Header */}
        <div className="text-center mb-10 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-primary text-[10px] font-bold uppercase tracking-widest mb-4">
             Join the Future
          </div>
          <h2 className="text-4xl font-bold tracking-tight mb-3">
            {mode === 'login' ? 'Welcome ' : 'Create '} 
            <span className="text-primary italic">{mode === 'login' ? 'Back' : 'Account'}</span>
          </h2>
          <p className="text-muted font-medium text-sm">
            {mode === 'login'
              ? 'Enter your credentials to access your studio'
              : 'Sign up for your free virtual fitting room'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          {mode === 'signup' && (
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted ml-1" htmlFor="fullName">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted/60" />
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full pl-12 pr-4 py-4 bg-secondary/30 border border-transparent rounded-xl-soft text-foreground placeholder:text-muted/50 focus:outline-none focus:bg-white focus:border-primary/30 focus:ring-4 focus:ring-primary/5 transition-all font-medium"
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-muted ml-1" htmlFor="email">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted/60" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full pl-12 pr-4 py-4 bg-secondary/30 border border-transparent rounded-xl-soft text-foreground placeholder:text-muted/50 focus:outline-none focus:bg-white focus:border-primary/30 focus:ring-4 focus:ring-primary/5 transition-all font-medium"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-muted ml-1" htmlFor="password">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted/60" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onPaste={(e) => e.preventDefault()}
                onCopy={(e) => e.preventDefault()}
                onContextMenu={(e) => e.preventDefault()}
                autoComplete="new-password"
                spellCheck="false"
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full pl-12 pr-12 py-4 bg-secondary/30 border border-transparent rounded-xl-soft text-foreground placeholder:text-muted/50 focus:outline-none focus:bg-white focus:border-primary/30 focus:ring-4 focus:ring-primary/5 transition-all font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted/60 hover:text-primary transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Error / Success messages */}
          {error && (
            <div className="p-4 rounded-xl-soft bg-danger/5 border border-danger/10 text-danger text-xs font-bold animate-fadeIn">
              {error}
            </div>
          )}
          {success && (
            <div className="p-4 rounded-xl-soft bg-success/5 border border-success/10 text-success text-xs font-bold animate-fadeIn">
              {success}
            </div>
          )}

          {/* Submit */}
          <button
            id="auth-submit"
            type="submit"
            disabled={loading}
            className="w-full py-4.5 rounded-xl-soft font-bold text-white bg-primary hover:bg-primary-hover disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 shadow-glow flex items-center justify-center gap-2 group"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                {mode === 'login' ? 'Sign In' : 'Create Account'}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        {/* Toggle mode */}
        <div className="mt-8 text-center relative z-10">
          <p className="text-sm text-muted font-medium">
            {mode === 'login' ? "New to VirtualFit? " : 'Already a member? '}
            <button
              onClick={onToggleMode}
              className="text-primary font-bold hover:underline decoration-2 underline-offset-4 transition-all"
            >
              {mode === 'login' ? 'Create an account' : 'Sign in instead'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
