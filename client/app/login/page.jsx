"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2, Lock } from 'lucide-react';
import { apiFetch } from '@/lib/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    console.log("🔍 Debug - Current API URL:", process.env.NEXT_PUBLIC_API_URL || "Not found");
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

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

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="flex items-center justify-center p-8 sm:p-12 relative overflow-hidden bg-white">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md space-y-8"
        >
          <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-primary transition mb-8 text-sm font-medium">
            <ArrowLeft size={16} /> Back to Landing
          </Link>
          
          <div className="space-y-2">
            <h1 className="text-4xl font-black tracking-tight text-slate-900">Welcome back.</h1>
            <p className="text-slate-500">Access your synchronized CRM workspace.</p>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Email Address</label>
                <input 
                  type="email" 
                  required 
                  autocomplete="email"
                  className="w-full px-5 py-4 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                  placeholder="agent@estateflow.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Password</label>
                <input 
                  type="password" 
                  required 
                  autocomplete="current-password"
                  className="w-full px-5 py-4 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="w-full btn-primary !py-4 shadow-xl shadow-primary/20 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" /> : 'Log in to Workspace'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 pt-6">
            Don't have an account? <Link href="/register" className="text-primary font-bold hover:underline underline-offset-4">Create account</Link>
          </p>
        </motion.div>
      </div>

      <div className="hidden lg:flex bg-slate-900 relative items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-slate-900 z-0"></div>
        <div className="relative z-10 p-20 space-y-12">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-primary shadow-2xl">
            <Lock size={32} />
          </div>
          <div className="space-y-4 max-w-sm">
            <h2 className="text-4xl font-black text-white leading-tight">Secure, API-driven access for teams.</h2>
            <p className="text-slate-400 font-medium">Your data stays synchronized across every device with our robust REST architecture.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
