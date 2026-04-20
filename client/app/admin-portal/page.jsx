"use client";
import React, { useEffect, useState } from 'react';
import UserManagement from '@/components/UserManagement';
import SystemLogs from '@/components/SystemLogs';
import { BarChart3, Users2, Database, Network, Box, Globe, Activity, Terminal } from 'lucide-react';
import { motion } from 'framer-motion';
import { apiFetch } from '@/lib/api';

export default function AdminPortalDashboard() {
  const [stats, setStats] = useState({ totalAgents: 0, apiTraffic: 0, totalLeads: 0, totalDeals: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await apiFetch('/analytics/admin-stats');
        setStats(data);
      } catch (err) {
        console.error('Admin Fetch Failed', err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const handleTestN8n = async () => {
    try {
      const res = await apiFetch('/analytics/test-n8n', { method: 'POST' });
      if (res.success) {
        alert('🚀 Pulse Test Delivered! Check your backend terminal for success logs.');
      } else {
        alert('⚠️ Pulse Test failed. Verify N8N_WEBHOOK_URL in your .env file.');
      }
    } catch (err) {
      alert('❌ Error triggering automation: ' + err.message);
    }
  };

  if (loading) return (
    <div className="p-12 space-y-8 animate-pulse bg-white min-h-screen">
       <div className="h-20 bg-slate-100 rounded-2xl w-1/3"></div>
       <div className="grid grid-cols-4 gap-6">
          {[1,2,3,4].map(i => <div key={i} className="h-32 bg-slate-100 rounded-3xl"></div>)}
       </div>
    </div>
  );

  return (
    <div className="p-10 space-y-12 bg-white rounded-3xl">
      <header className="flex justify-between items-start">
        <div>
           <div className="flex items-center gap-3 text-primary mb-3">
              <Box size={18} />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">System Monitoring</span>
           </div>
           <h1 className="text-4xl font-black text-slate-900 tracking-tight">Control Center</h1>
           <p className="text-slate-500 font-medium mt-2 text-sm max-w-xl">Global administration terminal for system-wide health and team oversight.</p>
        </div>
        
        <div className="flex gap-4">
           <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col items-center gap-2">
              <Globe size={16} className="text-slate-400" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Network</span>
              <div className="w-1.5 h-1.5 bg-success rounded-full"></div>
           </div>
           <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col items-center gap-2">
              <Activity size={16} className="text-slate-400" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Latency</span>
              <span className="text-xs font-bold text-slate-900">18ms</span>
           </div>
        </div>
      </header>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         <PortalStatCard title="Active Agents" value={stats.totalAgents} icon={Users2} trend="+2 Online" color="blue" />
         <PortalStatCard title="API Traffic" value={`${(stats.apiTraffic / 1000).toFixed(1)}k`} icon={BarChart3} trend="Stable" color="indigo" />
         <PortalStatCard title="Lead Growth" value={stats.totalLeads} icon={Network} trend="+12%" color="emerald" />
         <PortalStatCard title="Pipeline Status" value={stats.totalDeals} icon={Database} trend="Healthy" color="violet" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-12">
        <div className="xl:col-span-3 space-y-12">
          <section className="bg-white border border-slate-200 rounded-[32px] p-2 overflow-hidden shadow-sm">
             <UserManagement />
          </section>
        </div>
        <div className="space-y-12">
          <section className="bg-primary/5 rounded-[32px] p-10 border border-primary/10 relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 opacity-20">
                <Terminal size={24} className="text-primary" />
             </div>
             <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4">Automation Pulse</h3>
             <p className="text-xs text-slate-500 font-medium leading-relaxed mb-8">
                Verify n8n connectivity and infrastructure response.
             </p>
             <button 
                onClick={handleTestN8n}
                className="w-full py-4 bg-primary text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-blue-600 transition shadow-lg shadow-primary/20 active:scale-95"
             >
                Trigger Test
             </button>
          </section>
          
          <div className="bg-white rounded-[32px] p-2 overflow-hidden border border-slate-100 shadow-xl shadow-slate-200/50">
             <SystemLogs />
          </div>
        </div>
      </div>
    </div>
  );
}

function PortalStatCard({ title, value, icon: Icon, trend, color }) {
  const colors = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    violet: 'bg-violet-50 text-violet-600 border-violet-100'
  };

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className={`p-8 bg-white border border-slate-200 rounded-[32px] transition-all group relative overflow-hidden shadow-sm hover:shadow-md`}
    >
      <div className="relative z-10 flex flex-col h-full justify-between">
        <div className="flex justify-between items-start">
           <div className={`w-12 h-12 ${colors[color]} rounded-2xl flex items-center justify-center border transition-transform group-hover:scale-110`}>
              <Icon size={22} />
           </div>
           <div className="text-[10px] font-black text-success uppercase tracking-widest">{trend}</div>
        </div>
        <div className="mt-8">
           <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{title}</h4>
           <div className="text-4xl font-black text-slate-900 tracking-tight">{value}</div>
        </div>
      </div>
    </motion.div>
  );
}
