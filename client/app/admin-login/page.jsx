"use client";
import React, { useState } from 'react';
import { ShieldCheck, Lock, User, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { apiFetch } from '@/lib/api';

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
      const data = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      
      if (data.role !== 'ADMIN' && data.role !== 'MANAGER') {
        throw new Error('Access Denied: You do not have administrative privileges.');
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
          <header className="text-center mb-10">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-primary/20 shadow-sm transition-transform hover:rotate-3">
               <ShieldCheck size={32} className="text-primary" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Admin Portal</h1>
            <p className="text-sm text-slate-400 font-medium mt-2">Welcome back! Manage your estate empire.</p>
          </header>

          <form onSubmit={handleAdminLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 ml-1">Email Address</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                  <input 
                    type="email" 
                    autoComplete="email"
                    placeholder="admin@estateflow.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-6 outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all text-sm font-medium text-slate-900"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 ml-1">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                  <input 
                    type="password" 
                    autoComplete="current-password"
                    placeholder="Enter your security key"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-6 outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all text-sm font-medium text-slate-900"
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
                className="bg-red-50 border border-red-100 p-4 rounded-2xl text-xs text-red-600 font-bold flex items-center gap-3 shadow-sm"
              >
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                {error}
              </motion.div>
            )}

            <button 
              disabled={loading}
              className="w-full py-5 bg-primary text-white rounded-2xl font-bold text-sm hover:bg-blue-600 active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-xl shadow-primary/20"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : 'Sign In to Dashboard'}
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
