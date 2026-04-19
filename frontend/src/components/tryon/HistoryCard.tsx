"use client";

import React from 'react';
import { Clock, CheckCircle, XCircle, Loader2, Calendar, Sparkles } from 'lucide-react';
import { TryOnResult } from '@/lib/api';
import Link from 'next/link';

type HistoryCardProps = {
  item: TryOnResult;
};

const statusConfig = {
  completed: { icon: CheckCircle, color: 'text-success', bg: 'bg-success/10', label: 'Completed' },
  processing: { icon: Loader2, color: 'text-primary', bg: 'bg-primary/10', label: 'Processing' },
  pending: { icon: Clock, color: 'text-muted', bg: 'bg-muted/10', label: 'Pending' },
  failed: { icon: XCircle, color: 'text-danger', bg: 'bg-danger/10', label: 'Failed' },
};

export default function HistoryCard({ item }: HistoryCardProps) {
  const status = statusConfig[item.status];
  const StatusIcon = status.icon;

  return (
    <Link href={`/result/${item.id}`}>
      <div className="group bg-white rounded-2xl-soft shadow-soft border border-border/40 overflow-hidden hover:shadow-glow hover:-translate-y-1 transition-all duration-500 cursor-pointer">
        {/* Main Result Preview */}
        <div className="relative aspect-[4/5] overflow-hidden bg-secondary/20">
          {item.result_url ? (
            <img
              src={item.result_url}
              alt="Result"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-muted gap-3">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
                 <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest">Processing</span>
            </div>
          )}
          
          {/* Status Overlay Badge */}
          <div className="absolute top-4 left-4">
             <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full glass shadow-sm`}>
                <StatusIcon className={`w-3.5 h-3.5 ${status.color} ${item.status === 'processing' ? 'animate-spin' : ''}`} />
                <span className={`text-[10px] font-bold uppercase tracking-wider ${status.color}`}>{status.label}</span>
             </div>
          </div>

          {/* Source Previews Overlay */}
          <div className="absolute bottom-4 left-4 right-4 flex gap-2">
             <div className="w-12 h-12 rounded-lg border-2 border-white shadow-lg overflow-hidden bg-white">
                <img src={item.user_image_url} className="w-full h-full object-cover" alt="Source" />
             </div>
             <div className="w-12 h-12 rounded-lg border-2 border-white shadow-lg overflow-hidden bg-white">
                <img src={item.clothing_image_url} className="w-full h-full object-cover" alt="Cloth" />
             </div>
             <div className="ml-auto w-10 h-10 rounded-full glass flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Sparkles className="w-4 h-4 text-primary" />
             </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="p-5 flex items-center justify-between border-t border-border/30 bg-white group-hover:bg-secondary/10 transition-colors">
          <div className="flex items-center gap-2 text-muted">
            <Calendar className="w-3.5 h-3.5" />
            <span className="text-xs font-bold tracking-tight">
              {new Date(item.created_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })}
            </span>
          </div>
          <div className="text-[10px] font-black text-primary/40 uppercase tracking-tighter">
            View Details
          </div>
        </div>
      </div>
    </Link>
  );
}
