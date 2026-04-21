"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, FileText, Download, Upload, 
  DollarSign, PieChart, Briefcase, 
  Calendar, CheckCircle2, AlertCircle 
} from 'lucide-react';
import { apiFetch } from '@/lib/api';
import ImageUploader from './ImageUploader';

export default function DealDetailDrawer({ deal, onClose, onUpdate }) {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  if (!deal) return null;

  const handleDocumentUpload = async (images) => {
    setUploading(true);
    try {
      const doc = images[0]; // Take the first uploaded file
      await apiFetch(`/deals/${deal._id}/documents`, {
        method: 'POST',
        body: JSON.stringify({
          title: doc.name || 'Agreement Document',
          url: doc.url,
          type: 'CONTRACT'
        })
      });
      onUpdate?.();
    } catch (err) {
      alert('Upload failed: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex justify-end">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        />
        
        <motion.div 
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="relative w-full max-w-2xl bg-white h-screen shadow-2xl flex flex-col"
        >
          {/* Header */}
          <header className="p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
             <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Deal Dossier</h2>
                <div className="flex items-center gap-2 mt-1">
                   <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                   <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Active Transaction Record</p>
                </div>
             </div>
             <button onClick={onClose} className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 hover:text-slate-900 shadow-sm border border-slate-100">
                <X size={20} />
             </button>
          </header>

          <div className="flex-1 overflow-y-auto p-12 space-y-12 custom-scrollbar">
             {/* Financial Breakdown */}
             <section className="grid grid-cols-2 gap-8">
                <div className="bg-slate-900 rounded-[32px] p-8 text-white relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-6 opacity-10">
                      <DollarSign size={48} />
                   </div>
                   <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-4">Total Value</p>
                   <h4 className="text-3xl font-black italic">${deal.dealValue?.toLocaleString()}</h4>
                   <div className="w-full h-1 bg-white/10 rounded-full mt-6 overflow-hidden">
                      <div className="w-2/3 h-full bg-primary shadow-[0_0_15px_#3b82f6]"></div>
                   </div>
                </div>
                <div className="bg-primary/5 rounded-[32px] p-8 border border-primary/10">
                   <p className="text-[10px] font-black uppercase text-primary tracking-widest mb-4">Projected Earnings</p>
                   <h4 className="text-3xl font-black italic text-slate-900">${deal.commissionAmount?.toLocaleString()}</h4>
                   <p className="text-[10px] font-bold text-slate-400 mt-6 uppercase">Rate: {deal.commissionRate}%</p>
                </div>
             </section>

             {/* Documents Section */}
             <section className="space-y-6">
                <div className="flex justify-between items-center">
                   <h3 className="font-bold text-lg text-slate-900">Legal Documents</h3>
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{deal.documents?.length || 0} Files</span>
                </div>

                <div className="space-y-4">
                   {(deal.documents || []).length === 0 ? (
                     <div className="py-12 text-center border-2 border-dashed border-slate-100 rounded-[32px] bg-slate-50/50">
                        <FileText className="mx-auto text-slate-200 mb-4" size={32} />
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No contracts attached</p>
                     </div>
                   ) : (
                     deal.documents.map((doc, idx) => (
                       <div key={idx} className="flex items-center justify-between p-6 bg-white border border-slate-100 rounded-2xl group hover:border-primary/50 transition-all">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                                <FileText size={18} />
                             </div>
                             <div>
                                <p className="text-sm font-bold text-slate-900">{doc.title}</p>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{doc.type}</p>
                             </div>
                          </div>
                          <a href={doc.url} target="_blank" className="p-3 bg-slate-50 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-all shadow-sm">
                             <Download size={18} />
                          </a>
                       </div>
                     ))
                   )}

                   <div className="pt-6">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block ml-1">Upload New Agreement</label>
                      <ImageUploader onUploadSuccess={handleDocumentUpload} />
                   </div>
                </div>
             </section>

             {/* History/Activities */}
             <section className="space-y-6">
                <h3 className="font-bold text-lg text-slate-900">Audit Trail</h3>
                <div className="space-y-4">
                   {(deal.activities || []).slice().reverse().map((act, idx) => (
                     <div key={idx} className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                           <CheckCircle2 size={14} />
                        </div>
                        <div className="pt-1">
                           <p className="text-xs font-bold text-slate-700">{act.message}</p>
                           <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">{new Date(act.createdAt).toLocaleString()}</p>
                        </div>
                     </div>
                   ))}
                </div>
             </section>
          </div>

          {/* Footer Action */}
          <footer className="p-10 border-t border-slate-100 bg-white">
             <button 
                onClick={onClose}
                className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-black transition active:scale-[0.98] shadow-2xl shadow-slate-900/20"
             >
                Close Archive
             </button>
          </footer>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
