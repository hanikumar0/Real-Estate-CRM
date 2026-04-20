"use client";
import React, { useEffect, useState } from 'react';
import { X, Home, DollarSign, Target, ArrowRight, Building2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiFetch } from '@/lib/api';

export default function LeadMatchesModal({ isOpen, onClose, lead }) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && lead?._id) {
      async function loadMatches() {
        try {
          setLoading(true);
          const data = await apiFetch(`/leads/${lead._id}/matches`);
          setMatches(data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
      }
      loadMatches();
    }
  }, [isOpen, lead]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-2xl bg-white rounded-[40px] shadow-2xl overflow-hidden relative flex flex-col max-h-[80vh]"
      >
        <header className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
          <div>
            <div className="flex items-center gap-3">
              <Target size={20} className="text-primary" />
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">AI Asset Matcher</h2>
            </div>
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-1">Suggested for {lead?.name}</p>
          </div>
          <button onClick={onClose} className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all border border-slate-100">
            <X size={20} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-10 space-y-6">
          {loading ? (
             <div className="space-y-4">
                {[1,2,3].map(i => <div key={i} className="h-24 bg-slate-50 animate-pulse rounded-3xl" />)}
             </div>
          ) : matches.length === 0 ? (
            <div className="py-20 text-center space-y-4">
               <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto text-slate-300">
                  <Home size={32} />
               </div>
               <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">No matching assets found for this budget.</p>
            </div>
          ) : (
            matches.map(property => (
              <motion.div 
                key={property._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white border border-slate-100 rounded-3xl p-6 flex items-center justify-between hover:shadow-xl hover:border-primary/20 transition-all group"
              >
                <div className="flex items-center gap-6">
                   <div className="w-20 h-20 bg-slate-50 rounded-2xl overflow-hidden">
                      {property.images?.[0]?.url ? 
                        <img src={property.images[0].url} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" alt="" /> :
                        <div className="w-full h-full flex items-center justify-center text-slate-200"><Building2 size={24} /></div>
                      }
                   </div>
                   <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-primary bg-primary/5 px-2 py-0.5 rounded-full uppercase tracking-tighter">{property.matchScore}% Match</span>
                        <h4 className="font-bold text-slate-900 leading-none">{property.title}</h4>
                      </div>
                      <p className="text-xs text-slate-400 font-medium mt-1 uppercase tracking-widest">{property.location}</p>
                      <div className="flex items-center gap-3 mt-3">
                         <span className="text-lg font-black text-slate-900 font-data">${property.price?.toLocaleString()}</span>
                         <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{property.type}</span>
                      </div>
                   </div>
                </div>
                <button className="h-14 w-14 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-sm">
                   <ArrowRight size={20} />
                </button>
              </motion.div>
            ))
          )}
        </div>
        
        <footer className="p-10 bg-slate-900 text-white flex justify-between items-center">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Lead Budget</p>
              <p className="text-xl font-black text-primary font-data">${lead?.budget?.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Active Preferences</p>
              <p className="text-xs font-bold uppercase tracking-widest">{lead?.preferences?.propertyType || 'Any Asset'}</p>
            </div>
        </footer>
      </motion.div>
    </div>
  );
}
