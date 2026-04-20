"use client";
import SystemLogs from '@/components/SystemLogs';
import { Activity } from 'lucide-react';

export default function AdminLogsPage() {
  return (
    <div className="p-10 space-y-8">
      <header>
        <div className="flex items-center gap-3 text-primary mb-3">
          <Activity size={18} />
          <span className="text-[10px] font-black uppercase tracking-[0.4em]">Audit_Stream_01</span>
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight">System Audit Trails</h1>
        <p className="text-slate-400 text-sm mt-2">Historical security logs and operational events captured across the cluster.</p>
      </header>

      <div className="bg-white rounded-[40px] p-2 overflow-hidden shadow-2xl">
        <SystemLogs />
      </div>
    </div>
  );
}
