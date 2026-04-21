"use client";
import React, { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { UserPlus, Shield, Power, Mail, Phone, MoreVertical, Search, CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      const data = await apiFetch('/users'); // Corrected from /auth/agents
      setUsers(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }
 
  const toggleStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      await apiFetch(`/users/${userId}/status`, { 
        method: 'PATCH', 
        body: JSON.stringify({ status: newStatus }) 
      });
      setUsers(users.map(u => u._id === userId ? { ...u, status: newStatus } : u));
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    }
  };

  if (loading) return <div className="animate-pulse space-y-4 pt-10"><div className="h-64 bg-slate-50 rounded-[32px]"></div></div>;

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Team Governance</h2>
          <p className="text-slate-400 font-medium text-xs uppercase tracking-widest mt-1">Manage 2026 Workforce access</p>
        </div>
        <button className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition flex items-center gap-2">
          <UserPlus size={14} /> Onboard Agent
        </button>
      </header>

      <div className="bg-white border border-slate-100 rounded-[32px] overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
              <th className="px-8 py-5">Full Name & Role</th>
              <th className="px-8 py-5">Communication</th>
              <th className="px-8 py-5">Security Status</th>
              <th className="px-8 py-5">Performance Tier</th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {users.map((user, idx) => (
              <motion.tr 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                key={user._id} 
                className="hover:bg-slate-50/80 transition-colors"
              >
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-xs ${user.role === 'ADMIN' ? 'bg-slate-900 text-white' : 'bg-primary/5 text-primary'}`}>
                      {user.name.split(' ').map(n=>n[0]).join('')}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 flex items-center gap-2">
                        {user.name}
                        {user.role === 'ADMIN' && <Shield size={12} className="text-primary" />}
                      </div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">{user.role}</div>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                   <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-xs font-medium text-slate-600"><Mail size={12} /> {user.email}</div>
                      <div className="flex items-center gap-2 text-xs font-medium text-slate-600"><Phone size={12} /> {user.agentProfile?.phone || 'No Phone'}</div>
                   </div>
                </td>
                <td className="px-8 py-6">
                   <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${user.status === 'ACTIVE' ? 'bg-success/5 text-success' : 'bg-red-50 text-red-500'}`}>
                      {user.status === 'ACTIVE' ? <CheckCircle size={10} /> : <XCircle size={10} />}
                      {user.status}
                   </span>
                </td>
                <td className="px-8 py-6">
                   <div className="w-full max-w-[100px] h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: '65%' }}></div>
                   </div>
                </td>
                <td className="px-8 py-6 text-right">
                   <div className="flex justify-end gap-3">
                      <button 
                        onClick={() => toggleStatus(user._id, user.status)}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${user.status === 'ACTIVE' ? 'text-red-500 hover:bg-red-50' : 'text-success hover:bg-success/10'}`}
                      >
                        <Power size={18} />
                      </button>
                      <button className="w-10 h-10 rounded-xl bg-white border border-slate-100 text-slate-400 flex items-center justify-center hover:bg-slate-50 transition">
                         <MoreVertical size={18} />
                      </button>
                   </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
