"use client";
import React, { useState } from 'react';
import { Search, MapPin, Calendar, CheckCircle2, Building2, Phone, ArrowRight, Loader2, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiFetch } from '@/lib/api';
import Link from 'next/link';

export default function ClientTrackingPage() {
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setStatus(null);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL || 'http://localhost:5000/api';
      const cleanUrl = apiUrl.endsWith('/api') ? apiUrl : `${apiUrl}/api`;

      // Direct fetch from public endpoint (no token needed here)
      const res = await fetch(`${cleanUrl}/leads/track?phone=${phone}`);
      if (!res.ok) throw new Error('Lead information not found. Please contact your agent.');
      const data = await res.json();
      setStatus(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const statusMap = {
    'NEW': { label: 'In Queue', icon: Clock, color: 'text-blue-500', bg: 'bg-blue-50', progress: 20 },
    'CONTACTED': { label: 'Discovery Session', icon: Phone, color: 'text-yellow-600', bg: 'bg-yellow-50', progress: 40 },
    'QUALIFIED': { label: 'Asset Search', icon: Target, color: 'text-primary', bg: 'bg-primary/5', progress: 60 },
    'IN_DEAL': { label: 'Negotiation', icon: Building2, color: 'text-success', bg: 'bg-success/5', progress: 80 },
    'CONVERTED': { label: 'Closing Accomplished', icon: CheckCircle2, color: 'text-success', bg: 'bg-success/10', progress: 100 }
  };

  const current = statusMap[status?.status] || statusMap['NEW'];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-primary selection:text-white">
      {/* Navigation */}
      <nav className="p-8 max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-black text-primary tracking-tighter">EstateFlow<span className="text-slate-200">.</span></Link>
        <div className="flex items-center gap-2 px-4 py-2 border rounded-full text-[10px] font-black uppercase tracking-widest text-slate-400">
           Client Progress System 1.0
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-20 pb-40">
        <div className="text-center space-y-4 mb-20">
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black tracking-tight text-slate-900"
          >
            Track your <span className="text-primary italic">journey.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-400 font-medium max-w-xl mx-auto"
          >
            Enter your registered mobile number to see where you stand in our high-velocity acquisition pipeline.
          </motion.p>
        </div>

        {/* Input Section */}
        <section className="mb-24">
          <form onSubmit={handleTrack} className="max-w-md mx-auto relative group">
            <div className={`absolute -inset-1 bg-gradient-to-r from-primary to-blue-600 rounded-[32px] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200 ${loading ? 'animate-pulse' : ''}`}></div>
            <div className="relative flex bg-white rounded-3xl p-2 shadow-2xl">
              <input 
                type="tel" 
                placeholder="Mobile number..."
                className="flex-1 px-6 py-4 outline-none font-bold text-slate-900 placeholder:text-slate-300"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                required
              />
              <button 
                disabled={loading}
                className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition flex items-center gap-2 active:scale-95 disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" size={16} /> : <>Track <ArrowRight size={16} /></>}
              </button>
            </div>
          </form>
          {error && <p className="text-center mt-6 text-red-500 font-bold text-xs uppercase tracking-widest">{error}</p>}
        </section>

        {/* Results Section */}
        <AnimatePresence mode="wait">
          {status && (
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              className="space-y-12"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="bg-slate-50 rounded-[40px] p-12 space-y-8 border border-slate-100 relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[40px] -translate-x-1/2 -translate-y-1/2"></div>
                   <div className="space-y-2 relative z-10">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Client Identity</p>
                     <h3 className="text-4xl font-black text-slate-900 tracking-tight">{status.name}</h3>
                   </div>

                   <div className="flex gap-10 relative z-10">
                     <div>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Last Update</p>
                       <p className="font-bold text-slate-800">{new Date(status.updatedAt).toLocaleDateString()}</p>
                     </div>
                     <div>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Agent Status</p>
                       <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${status.hasAgent ? 'bg-success/10 text-success' : 'bg-slate-200 text-slate-500'}`}>
                         {status.hasAgent ? 'Assigned' : 'Awaiting'}
                       </span>
                     </div>
                   </div>
                </div>

                <div className="flex flex-col justify-center space-y-8 p-6">
                   <div className="flex items-center gap-6">
                      <div className={`w-20 h-20 rounded-3xl ${current.bg} flex items-center justify-center ${current.color} shadow-sm border border-white`}>
                        <current.icon size={32} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Current Stage</p>
                        <h4 className={`text-3xl font-black ${current.color} tracking-tight`}>{current.label}</h4>
                      </div>
                   </div>
                   
                   <div className="space-y-4 pt-4">
                      <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-50">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${current.progress}%` }}
                          transition={{ duration: 1.5, type: 'spring' }}
                          className={`h-full ${status.status === 'CONVERTED' ? 'bg-success' : 'bg-primary'}`}
                        />
                      </div>
                      <div className="flex justify-between">
                         <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Pipeline Start</span>
                         <span className="text-[10px] font-black text-primary uppercase tracking-widest">{current.progress}% Completion</span>
                      </div>
                   </div>
                </div>
              </div>

              <div className="p-10 border-2 border-dashed border-slate-100 rounded-[40px] text-center">
                 <p className="text-slate-400 font-medium mb-6 italic">"Our team is currently optimizing asset matches for your specific requirements."</p>
                 <Link href="/" className="inline-flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest hover:gap-4 transition-all">
                    Contact Estate Support <ArrowRight size={14} />
                 </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="footer-bg py-20 px-8 border-t border-slate-100 bg-slate-50/50">
        <div className="max-w-7xl mx-auto text-center space-y-6">
          <div className="text-2xl font-black text-primary tracking-tighter">EstateFlow</div>
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest">© 2026 Synchronized Systems • Lead Tracking Interface</p>
        </div>
      </footer>

      <style jsx global>{`
        .font-sans { font-family: var(--font-sans), sans-serif; }
        .font-data { font-family: var(--font-data), monospace; }
        .success { color: #10b981; }
        .bg-success\/5 { background-color: rgba(16, 185, 129, 0.05); }
        .bg-success\/10 { background-color: rgba(16, 185, 129, 0.1); }
      `}</style>
    </div>
  );
}

// Mocking clock icon if not imported correctly
const Clock = ({size, className}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);
