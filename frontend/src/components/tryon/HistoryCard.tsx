"use client";

import React from 'react';
import { Clock, CheckCircle, XCircle, Loader } from 'lucide-react';
import { TryOnResult } from '@/lib/api';
import Link from 'next/link';

type HistoryCardProps = {
  item: TryOnResult;
};

const statusConfig = {
  completed: { icon: CheckCircle, color: 'text-success', bg: 'bg-success/10', label: 'Completed' },
  processing: { icon: Loader, color: 'text-warning', bg: 'bg-warning/10', label: 'Processing' },
  pending: { icon: Clock, color: 'text-muted', bg: 'bg-muted/10', label: 'Pending' },
  failed: { icon: XCircle, color: 'text-danger', bg: 'bg-danger/10', label: 'Failed' },
};

export default function HistoryCard({ item }: HistoryCardProps) {
  const status = statusConfig[item.status];
  const StatusIcon = status.icon;

  return (
    <Link href={`/result/${item.id}`}>
      <div className="glass rounded-2xl overflow-hidden hover:border-primary/30 transition-all duration-300 group cursor-pointer">
        {/* Image preview strip */}
        <div className="flex h-40">
          <div className="flex-1 bg-card overflow-hidden">
            {item.user_image_url && (
              <img
                src={item.user_image_url}
                alt="User"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            )}
          </div>
          <div className="w-px bg-border" />
          <div className="flex-1 bg-card overflow-hidden">
            {item.clothing_image_url && (
              <img
                src={item.clothing_image_url}
                alt="Clothing"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            )}
          </div>
          <div className="w-px bg-border" />
          <div className="flex-1 bg-card overflow-hidden">
            {item.result_url ? (
              <img
                src={item.result_url}
                alt="Result"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted">
                <Loader className="w-6 h-6 animate-spin" />
              </div>
            )}
          </div>
        </div>

        {/* Info bar */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${status.bg}`}>
              <StatusIcon className={`w-3.5 h-3.5 ${status.color} ${item.status === 'processing' ? 'animate-spin' : ''}`} />
              <span className={`text-xs font-medium ${status.color}`}>{status.label}</span>
            </div>
          </div>
          <span className="text-xs text-muted">
            {new Date(item.created_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>
      </div>
    </Link>
  );
}
