"use client";
import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-white z-[100] flex flex-col items-center justify-center gap-6">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-slate-100 rounded-full" />
        <div className="absolute inset-0 w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
      <div className="space-y-2 text-center">
        <h2 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] italic">EstateFlow</h2>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest animate-pulse">Synchronizing Workspace...</p>
      </div>
    </div>
  );
}
