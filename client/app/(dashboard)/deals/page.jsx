"use client";
import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { 
  TrendingUp, ArrowUpRight, DollarSign, 
  MoreHorizontal, Plus, Clock, 
  MapPin, User, ChevronRight,
  GripVertical
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const STAGES = [
  { id: 'INQUIRY', label: 'Inquiry', color: 'bg-blue-500' },
  { id: 'NEGOTIATION', label: 'Negotiation', color: 'bg-amber-500' },
  { id: 'AGREEMENT', label: 'Agreement', color: 'bg-purple-500' },
  { id: 'CLOSED', label: 'Closed', color: 'bg-emerald-500' }
];

export default function DealsPage() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDeals() {
      try {
        const data = await apiFetch('/deals');
        setDeals(data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    loadDeals();
  }, []);

  const handleStageChange = async (dealId, newStage) => {
    try {
      setDeals(prev => prev.map(d => d._id === dealId ? { ...d, stage: newStage } : d));
      await apiFetch(`/deals/${dealId}/stage`, {
        method: 'PATCH',
        body: JSON.stringify({ stage: newStage })
      });
    } catch (err) {
      console.error('Failed to update stage:', err);
    }
  };

  if (loading) return (
    <div className="p-10 space-y-10">
      <div className="flex gap-4">
        {[1, 2, 3, 4].map(i => <div key={i} className="h-[600px] w-full bg-slate-50 rounded-[40px] animate-pulse"></div>)}
      </div>
    </div>
  );

  return (
    <div className="p-10 space-y-10 min-h-screen">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Financial Pipeline</h1>
          <p className="text-slate-400 font-medium mt-1">Drag and drop to advance negotiations.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="p-4 bg-white border border-slate-100 rounded-3xl shadow-sm flex items-center gap-4">
             <div className="w-10 h-10 bg-primary/5 text-primary rounded-xl flex items-center justify-center">
               <DollarSign size={20} />
             </div>
             <div>
               <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none">Pipeline Value</div>
               <div className="text-xl font-black text-slate-900 mt-1">
                 ${deals.reduce((acc, d) => acc + (d.dealValue || 0), 0).toLocaleString()}
               </div>
             </div>
          </div>
          <button className="h-14 w-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center hover:scale-105 transition active:scale-95 shadow-xl">
            <Plus size={24} />
          </button>
        </div>
      </header>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {STAGES.map(stage => {
          const stageDeals = deals.filter(d => d.stage === stage.id);
          const stageValue = stageDeals.reduce((acc, d) => acc + (d.dealValue || 0), 0);

          return (
            <div key={stage.id} className="space-y-6">
              {/* Column Header */}
              <div className="flex items-center justify-between px-4">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${stage.color}`}></div>
                  <h3 className="font-black text-slate-900 uppercase tracking-widest text-[10px]">{stage.label}</h3>
                  <span className="bg-slate-100 px-2 py-0.5 rounded-md text-[10px] font-bold text-slate-500">{stageDeals.length}</span>
                </div>
                <div className="text-[10px] font-bold text-slate-400">${(stageValue / 1000).toFixed(1)}k</div>
              </div>

              {/* Column Content */}
              <div className="space-y-4 min-h-[500px]">
                <AnimatePresence mode="popLayout">
                  {stageDeals.map((deal) => (
                    <motion.div
                      key={deal._id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="group bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer relative overflow-hidden"
                    >
                      {/* Interactive Selection Placeholder */}
                      <div className="absolute top-4 right-4 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">
                         <div className="flex gap-1">
                            {STAGES.filter(s => s.id !== stage.id).map(s => (
                              <button 
                                key={s.id}
                                onClick={(e) => { e.stopPropagation(); handleStageChange(deal._id, s.id); }}
                                className="w-6 h-6 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                                title={s.label}
                              >
                                {s.label[0]}
                              </button>
                            ))}
                         </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                             <User size={20} />
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 group-hover:text-primary transition">{deal.clientId?.name || 'Unknown Client'}</div>
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mt-1">
                              <MapPin size={10} className="text-primary" /> {deal.propertyId?.title || 'No Property'}
                            </div>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-slate-50 flex items-end justify-between">
                           <div>
                              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Deal Value</div>
                              <div className="text-xl font-black text-slate-900 mt-1 font-data tracking-tight">${(deal.dealValue || 0).toLocaleString()}</div>
                           </div>
                           <div className="text-right">
                              <div className="text-[10px] font-black text-success uppercase tracking-widest leading-none">Earnings</div>
                              <div className="text-sm font-bold text-success mt-1 font-data tracking-tight">${(deal.commissionAmount || 0).toLocaleString()}</div>
                           </div>
                        </div>

                        <div className="pt-2 flex items-center justify-between">
                           <div className="flex items-center gap-2 text-slate-400">
                              <Clock size={14} />
                              <span className="text-[10px] font-bold italic">{new Date(deal.createdAt).toLocaleDateString()}</span>
                           </div>
                           <div className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-[0.1em] ${deal.status === 'ACTIVE' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'}`}>
                             {deal.status}
                           </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {stageDeals.length === 0 && (
                  <div className="h-32 border-2 border-dashed border-slate-100 rounded-[32px] flex items-center justify-center">
                     <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Drop Here</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

