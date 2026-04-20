"use client";
import React, { useState } from 'react';
import { ShieldCheck, Lock, Terminal, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      
      if (data.role !== 'ADMIN' && data.role !== 'MANAGER') {
        throw new Error('Access Denied: Administrative privileges required.');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      router.push('/admin-portal');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6 font-sans text-slate-600">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white border border-slate-200 rounded-[32px] p-12 shadow-2xl shadow-slate-200/50">
          <header className="text-center mb-12">
            <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-primary/20 shadow-sm transition-transform hover:rotate-3">
               <ShieldCheck size={36} className="text-primary" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase italic">Admin.Auth</h1>
            <p className="text-xs text-slate-400 font-bold tracking-widest uppercase mt-3">Administrative Control Gateway</p>
          </header>

          <form onSubmit={handleAdminLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Administrator ID</label>
                <div className="relative group">
                  <Terminal className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                  <input 
                    type="email" 
                    placeholder="admin@estateflow.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-6 outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all text-sm font-bold text-slate-900"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Security Key</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-6 outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all text-sm font-bold text-slate-900"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-50 border border-red-100 p-4 rounded-2xl text-[11px] text-red-600 font-bold uppercase tracking-wide flex items-center gap-3 shadow-sm"
              >
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                {error}
              </motion.div>
            )}

            <button 
              disabled={loading}
              className="w-full py-5 bg-primary text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-600 active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-xl shadow-primary/20"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : 'Access Core Portal'}
            </button>
          </form>
        </div>

        <p className="text-center mt-12 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
          Secured by EstateFlow Multi-Layer Encryption
        </p>
      </motion.div>
    </div>
  );
}
