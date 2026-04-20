"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import UserManagement from '@/components/UserManagement';
import { ShieldAlert, BarChart3, Settings2, Users2, Database, Network } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminControlPage() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'ADMIN' && role !== 'MANAGER') {
      router.push('/dashboard');
    } else {
      setIsAdmin(true);
    }
    setLoading(false);
  }, [router]);

  if (loading || !isAdmin) return (
    <div className="h-screen flex items-center justify-center bg-white">
        <div className="w-10 h-10 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="p-10 space-y-12 bg-slate-50/30 min-h-screen">
      <header className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-3 text-primary mb-2">
            <ShieldAlert size={18} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Secure Management Zone</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Project Administration</h1>
          <p className="text-slate-400 font-medium mt-1">Global system configuration and workforce governance.</p>
        </div>
        
        <div className="flex gap-4">
           {[Database, Network, Settings2].map((Icon, i) => (
             <div key={i} className="w-12 h-12 bg-white rounded-2xl border border-slate-100 flex items-center justify-center text-slate-400 shadow-sm hover:text-primary transition-colors cursor-pointer">
                <Icon size={20} />
             </div>
           ))}
        </div>
      </header>

      {/* Admin Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
         <AdminStatCard title="Total Agents" value="24" sub="3 Pipeline" icon={Users2} color="slate" />
         <AdminStatCard title="API Traffic" value="98.2k" sub="Healthy" icon={BarChart3} color="primary" />
         <AdminStatCard title="Integrations" value="12" sub="n8n Active" icon={Network} color="success" />
         <AdminStatCard title="System Load" value="12%" sub="Optimized" icon={Database} color="blue" />
      </div>

      <div className="grid grid-cols-1 gap-12">
        <section>
          <UserManagement />
        </section>
      </div>
    </div>
  );
}

function AdminStatCard({ title, value, sub, icon: Icon, color }) {
  const colors = {
    slate: 'bg-slate-900 text-white',
    primary: 'bg-white border-slate-100 text-slate-900',
    success: 'bg-white border-slate-100 text-slate-900',
    blue: 'bg-white border-slate-100 text-slate-900'
  };

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className={`p-8 rounded-[40px] shadow-sm relative overflow-hidden group ${colors[color] || colors.primary} ${color !== 'slate' ? 'border' : ''}`}
    >
      <div className="flex justify-between items-start relative z-10">
        <div className="space-y-4">
          <p className={`text-[10px] font-black uppercase tracking-widest ${color === 'slate' ? 'text-slate-400' : 'text-slate-400'}`}>{title}</p>
          <h3 className="text-3xl font-black font-data">{value}</h3>
          <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${color === 'slate' ? 'bg-primary shadow-[0_0_10px_#3b82f6]' : 'bg-success shadow-[0_0_10px_#10b981]'}`}></div>
            <span className={`text-[10px] font-bold uppercase tracking-widest ${color === 'slate' ? 'text-slate-500' : 'text-slate-400'}`}>{sub}</span>
          </div>
        </div>
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color === 'slate' ? 'bg-white/10 text-white' : 'bg-slate-50 text-slate-900'}`}>
           <Icon size={24} />
        </div>
      </div>
    </motion.div>
  );
}
