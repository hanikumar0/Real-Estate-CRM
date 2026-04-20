"use client";
import React, { useState } from 'react';
import { X, User, Phone, Mail, DollarSign, MapPin, Plus, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiFetch } from '@/lib/api';

export default function LeadFormModal({ isOpen, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    budget: '',
    locationPreference: '',
    source: 'manual'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiFetch('/leads', {
        method: 'POST',
        body: JSON.stringify({
          ...formData,
          budget: formData.budget ? Number(formData.budget) : undefined
        })
      });
      onSuccess?.();
      onClose();
      setFormData({ name: '', phone: '', email: '', budget: '', locationPreference: '', source: 'manual' });
    } catch (err) {
      console.error(err);
      alert('Failed to add lead: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-10">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-lg bg-white rounded-[40px] shadow-2xl relative overflow-hidden flex flex-col"
          >
            <div className="p-10 md:p-12">
              <header className="mb-10 flex justify-between items-start">
                <div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">Capture Lead</h2>
                  <p className="text-slate-400 font-medium mt-1 uppercase text-[10px] tracking-widest">New Prospect Entry</p>
                </div>
                <button onClick={onClose} className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors">
                  <X size={20} />
                </button>
              </header>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input 
                      required
                      type="text" 
                      placeholder="Prospect Full Name"
                      className="w-full h-14 pl-12 pr-6 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                      <input 
                        required
                        type="tel" 
                        placeholder="Phone Number"
                        className="w-full h-14 pl-12 pr-6 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300"
                        value={formData.phone}
                        onChange={e => setFormData({...formData, phone: e.target.value})}
                      />
                    </div>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                      <input 
                        type="email" 
                        placeholder="Email Address"
                        className="w-full h-14 pl-12 pr-6 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300"
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                      <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                      <input 
                        type="number" 
                        placeholder="Budget ($)"
                        className="w-full h-14 pl-12 pr-6 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300"
                        value={formData.budget}
                        onChange={e => setFormData({...formData, budget: e.target.value})}
                      />
                    </div>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                      <input 
                        type="text" 
                        placeholder="Location Preference"
                        className="w-full h-14 pl-12 pr-6 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300"
                        value={formData.locationPreference}
                        onChange={e => setFormData({...formData, locationPreference: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Lead Source</label>
                    <div className="grid grid-cols-3 gap-2">
                       {['manual', 'referral', 'website'].map(src => (
                         <button
                           key={src}
                           type="button"
                           onClick={() => setFormData({...formData, source: src})}
                           className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${formData.source === src ? 'bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-900/10' : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'}`}
                         >
                           {src}
                         </button>
                       ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button 
                    disabled={loading}
                    className="w-full h-16 bg-primary text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:-translate-y-1 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                  >
                    {loading ? <Loader2 className="animate-spin" /> : <><Plus size={20} /> Initialize Prospect</>}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
