"use client";
import UserManagement from '@/components/UserManagement';
import { Users } from 'lucide-react';

export default function AdminUsersPage() {
  return (
    <div className="p-10 space-y-8">
      <header>
        <div className="flex items-center gap-3 text-primary mb-3">
          <Users size={18} />
          <span className="text-[10px] font-black uppercase tracking-[0.4em]">Governance_Node</span>
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight">Workforce Governance</h1>
        <p className="text-slate-400 text-sm mt-2">Manage security clearances and operational roles for your global team.</p>
      </header>

      <div className="bg-slate-800/30 border border-white/5 rounded-[40px] p-2 overflow-hidden shadow-inner">
        <UserManagement />
      </div>
    </div>
  );
}
