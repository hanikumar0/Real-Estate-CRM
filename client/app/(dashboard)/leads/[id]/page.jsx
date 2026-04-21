"use client";
import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { ArrowLeft, MessageSquare, CreditCard, ChevronRight, Plus, User as UserIcon, Calendar, DollarSign, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ActivityTimeline from '@/components/ActivityTimeline';
import { motion } from 'framer-motion';

export default function LeadDetailPage({ params }) {
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const fetchLead = async () => {
    try {
      const data = await apiFetch(`/leads/${params.id}`);
      setLead(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    fetchLead();
  }, [params.id]);

  const handleAddNote = async (e) => {
    if (!note.trim()) return;
    setSubmitting(true);
    try {
      await apiFetch(`/leads/${params.id}/notes`, {
        method: 'POST',
        body: JSON.stringify({ content: note })
      });
      setNote('');
      fetchLead();
    } catch (err) {
      console.error('Note entry failed:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Accessing Lead Intelligence...</p>
      </div>
    </div>
  );

  if (!lead) return <div className="p-12 text-center text-red-500 font-bold">404: Lead Record Not Found</div>;

  // Consolidate notes and system-generated activities for the timeline
  const combinedActivities = [
    ...(lead.notes || []).map(n => ({ ...n, type: 'NOTE', createdAt: n.date })),
  ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="p-10 space-y-10 max-w-7xl mx-auto min-h-screen">
      <header className="flex items-center justify-between">
        <Link href="/leads" className="bg-white p-4 rounded-2xl border border-slate-100 text-slate-400 hover:text-primary transition shadow-sm group">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition" />
        </Link>
        <div className="flex gap-4">
           {lead.status === 'QUALIFIED' && (
             <button className="bg-emerald-500 text-white px-8 py-4 rounded-[24px] font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-500/20 hover:scale-105 active:scale-95 transition">
               Initialize Transaction
             </button>
           )}
           <button className="bg-slate-900 text-white px-8 py-4 rounded-[24px] font-black text-xs uppercase tracking-widest shadow-xl shadow-black/20 hover:scale-105 active:scale-95 transition">
             Edit Profile
           </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Intelligence Card */}
        <div className="lg:col-span-4 space-y-8">
           <div className="bg-white border border-slate-100 rounded-[40px] p-10 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
              
              <div className="relative z-10 space-y-10">
                 <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/5 text-primary rounded-full text-[8px] font-black uppercase tracking-[0.2em] border border-primary/10">
                      Active Prospect
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tighter">{lead.name}</h1>
                    <div className="flex items-center gap-4 text-slate-400">
                       <p className="text-[10px] font-black uppercase tracking-widest">{lead.phone}</p>
                       <span className="w-1 h-1 rounded-full bg-slate-200"></span>
                       <p className="text-[10px] font-black uppercase tracking-widest truncate">{lead.email}</p>
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-6 pt-6 border-t border-slate-50">
                    <div className="space-y-2">
                       <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                         <DollarSign size={8} /> Acquisition Budget
                       </span>
                       <p className="text-2xl font-black text-slate-900 font-data tracking-tight">${lead.budget?.toLocaleString()}</p>
                    </div>
                    <div className="space-y-2">
                       <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                         <MapPin size={8} /> Preferred Region
                       </span>
                       <p className="text-xs font-black text-slate-600 uppercase tracking-widest truncate">{lead.locationPreference || 'Not Specified'}</p>
                    </div>
                 </div>

                 <div className="p-6 bg-slate-50 rounded-[32px] border border-slate-100 space-y-4">
                    <div className="flex justify-between items-center">
                       <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">Workflow status</span>
                       <span className="bg-white px-3 py-1 rounded-full text-[8px] font-black text-primary border border-slate-100">{lead.status}</span>
                    </div>
                    <div className="flex justify-between items-center">
                       <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">Lead Source</span>
                       <span className="text-[10px] font-bold text-slate-600">{lead.source}</span>
                    </div>
                 </div>
              </div>
           </div>

           {/* Follow-up Reminder */}
           <div className="bg-slate-900 rounded-[40px] p-10 text-white relative overflow-hidden shadow-2xl">
              <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-primary/20 blur-[80px] rounded-full"></div>
              <div className="relative z-10 space-y-6">
                 <div className="flex items-center gap-3">
                    <Calendar size={20} className="text-primary" />
                    <h3 className="font-black text-xs uppercase tracking-widest">Next Interaction</h3>
                 </div>
                 <p className="text-2xl font-black tracking-tight leading-none">
                    {lead.followUpDate ? new Date(lead.followUpDate).toLocaleDateString(undefined, { month: 'long', day: 'numeric' }) : 'Unscheduled'}
                 </p>
                 <p className="text-slate-400 text-xs font-medium leading-relaxed">System will trigger an alert 15 minutes prior to the scheduled follow-up window.</p>
                 <button className="w-full py-4 bg-white/10 hover:bg-white/20 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition border border-white/5">
                   Reschedule
                 </button>
              </div>
           </div>
        </div>

        {/* Right Column: Interaction Journal */}
        <div className="lg:col-span-8 space-y-10">
           <section className="bg-white border border-slate-100 rounded-[40px] p-10 shadow-sm space-y-10">
              <div className="flex justify-between items-center">
                 <div className="flex items-center gap-3">
                   <MessageSquare size={20} className="text-primary" />
                   <h2 className="text-xl font-black text-slate-900 tracking-tight">Interaction Journal</h2>
                 </div>
                 <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                   {lead.notes?.length || 0} Entries Logged
                 </div>
              </div>

              {/* Add Note Input */}
              <div className="relative group">
                 <textarea 
                   value={note}
                   onChange={(e) => setNote(e.target.value)}
                   placeholder="Synthesize the outcome of your last contact..."
                   rows="4"
                   className="w-full bg-slate-50 border-none p-8 rounded-[32px] text-sm text-slate-900 placeholder:text-slate-300 outline-none focus:ring-4 focus:ring-primary/5 transition-all resize-none font-medium"
                 />
                 <div className="absolute bottom-6 right-6">
                    <button 
                      onClick={handleAddNote}
                      disabled={submitting}
                      className="bg-slate-900 text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary transition shadow-xl disabled:bg-slate-300 flex items-center gap-2"
                    >
                      {submitting ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                      Append Note
                    </button>
                 </div>
              </div>

              <AnimatePresence>
                 <div className="pt-2">
                    <ActivityTimeline activities={combinedActivities} />
                 </div>
              </AnimatePresence>
           </section>
        </div>
      </div>
    </div>
  );
}
