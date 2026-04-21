"use client";
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full text-center space-y-8"
      >
        <div className="relative">
          <h1 className="text-[120px] font-black text-slate-200 leading-none">404</h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-xl font-bold text-slate-900 bg-white/80 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-100 shadow-sm">Page Not Synchronized</p>
          </div>
        </div>
        
        <p className="text-slate-500 font-medium">The workspace you are looking for doesn't exist or has been moved to a different sector.</p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white rounded-2xl font-bold shadow-xl shadow-primary/20 hover:-translate-y-1 transition-all">
            <Home size={18} /> Return Home
          </Link>
          <button onClick={() => window.history.back()} className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition-all">
            <ArrowLeft size={18} /> Go Back
          </button>
        </div>
      </motion.div>
    </div>
  );
}
