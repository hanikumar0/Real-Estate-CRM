"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import api from '@/lib/axios';

export default function LoginPage() {
  const [isClient, setIsClient] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  // Prevent Hydration Errors in Production
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const data = await api.post('/api/auth/login', { email, password });
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({ name: data.name, role: data.role }));
      localStorage.setItem('role', data.role);
      
      router.push('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isClient) return null;

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row font-sans overflow-hidden">
      {/* Visual Side */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 relative items-center justify-center p-20">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070')] bg-cover bg-center opacity-20 grayscale" />
        <div className="relative z-10 max-w-lg">
          <div className="w-16 h-16 bg-blue-500 rounded-3xl flex items-center justify-center mb-10 shadow-2xl shadow-blue-500/20">
            <Shield className="text-white" size={32} />
          </div>
          <h1 className="text-6xl font-black text-white tracking-tighter leading-none mb-6 italic">Secure, API-driven access for teams.</h1>
          <p className="text-slate-400 text-xl font-medium leading-relaxed">Your data stays synchronized across every device with our robust REST architecture.</p>
        </div>
      </div>

      {/* Form Side */}
      <div className="flex-1 flex items-center justify-center p-8 sm:p-12 md:p-20 bg-slate-50/50">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md space-y-12"
        >
          <header className="space-y-4">
             <button onClick={() => router.push('/')} className="inline-flex items-center text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors group">
               <ArrowRight className="rotate-180 mr-2 group-hover:-translate-x-1 transition-transform" size={14} /> Back to Landing
             </button>
             <h2 className="text-4xl font-black text-slate-900 tracking-tight">Welcome back.</h2>
             <p className="text-slate-400 font-medium tracking-tight">Access your synchronized CRM workspace.</p>
          </header>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-red-50 border border-red-100 p-5 rounded-[20px] mb-8"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <p className="text-xs font-bold text-red-600 uppercase tracking-wider">{error}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleLogin} className="space-y-8">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={18} />
                  <input 
                    type="email" 
                    required 
                    autoComplete="email"
                    className="w-full h-16 pl-14 pr-6 bg-white border border-slate-200 rounded-[24px] focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300 shadow-sm"
                    placeholder="hani@estateflow.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={18} />
                  <input 
                    type="password" 
                    required 
                    autoComplete="current-password"
                    className="w-full h-16 pl-14 pr-6 bg-white border border-slate-200 rounded-[24px] focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300 shadow-sm"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <button 
              disabled={loading}
              className="w-full h-16 bg-blue-600 text-white rounded-[24px] font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-blue-600/20 hover:-translate-y-1 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-4"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <>Log in to Workspace <ArrowRight size={18} /></>}
            </button>
          </form>

          <footer className="pt-8 flex justify-center border-t border-slate-100">
             <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">
               Don't have an account? <button onClick={() => router.push('/register')} className="text-blue-600 hover:underline">Create account</button>
             </p>
          </footer>
        </motion.div>
      </div>
    </div>
  );
}
