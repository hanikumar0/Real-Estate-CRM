"use client";
import React from 'react';
import { Shield, Clock, Info, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function SystemLogs() {
  const logs = [
    { id: 1, type: 'INFO', msg: 'System integrity check passed.', time: '2m ago', icon: CheckCircle2, color: 'text-success' },
    { id: 2, type: 'SECURITY', msg: 'Multiple failed login attempts from IP 192.168.1.45', time: '15m ago', icon: Shield, color: 'text-red-500' },
    { id: 3, type: 'CONFIG', msg: 'Email notification template "DEAL_CLOSED" updated.', time: '1h ago', icon: Info, color: 'text-blue-500' },
    { id: 4, type: 'ALERT', msg: 'Database backup successfully uploaded to S3.', time: '3h ago', icon: AlertTriangle, color: 'text-yellow-600' },
    { id: 5, type: 'SYSTEM', msg: 'V8 Engine optimization triggered for analytics worker.', time: '5h ago', icon: CheckCircle2, color: 'text-success' },
  ];

  return (
    <div className="bg-white border border-slate-100 rounded-[40px] p-10 shadow-sm">
      <header className="flex justify-between items-center mb-10">
        <div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight">System Security Logs</h3>
          <p className="text-slate-400 text-xs font-medium mt-1 uppercase tracking-widest">Administrative Audit Trail</p>
        </div>
        <button className="px-4 py-2 bg-slate-50 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-100 transition">View Full Archive</button>
      </header>

      <div className="space-y-4">
        {logs.map(log => (
          <div key={log.id} className="group flex items-center justify-between p-5 rounded-3xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
             <div className="flex items-center gap-6">
                <div className={`w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center ${log.color} group-hover:scale-110 transition duration-300 shadow-sm`}>
                   <log.icon size={20} />
                </div>
                <div>
                   <div className="flex items-center gap-2">
                      <span className={`text-[8px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-full bg-slate-100 text-slate-500`}>{log.type}</span>
                      <p className="text-sm font-bold text-slate-900">{log.msg}</p>
                   </div>
                   <p className="text-[10px] text-slate-400 font-medium mt-1 uppercase tracking-widest">{log.time}</p>
                </div>
             </div>
             <button className="text-[10px] font-black text-primary opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest">Inspect</button>
          </div>
        ))}
      </div>
    </div>
  );
}
