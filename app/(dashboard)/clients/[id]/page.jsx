"use client";
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Phone, Mail, MapPin, DollarSign, 
  MessageSquare, Calendar, ChevronLeft, 
  Plus, History, Briefcase, Star, Clock 
} from 'lucide-react';

export default function ClientDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newLog, setNewLog] = useState({ type: 'CALL', message: '' });

  useEffect(() => {
    async function loadClient() {
      try {
        const data = await apiFetch(`/clients/${id}`);
        setClient(data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    loadClient();
  }, [id]);

  const handleAddInteraction = async (e) => {
    e.preventDefault();
    try {
      const res = await apiFetch(`/clients/${id}/interactions`, {
        method: 'POST',
        body: JSON.stringify(newLog)
      });
      setClient(res);
      setNewLog({ type: 'CALL', message: '' });
    } catch (err) { alert(err.message); }
  };

  if (loading) return <div className="p-12 animate-pulse space-y-12">
    <div className="h-10 bg-slate-50 w-1/3 rounded-xl"></div>
    <div className="grid grid-cols-3 gap-10">
       <div className="col-span-2 h-[600px] bg-slate-50 rounded-[40px]"></div>
       <div className="h-[400px] bg-slate-50 rounded-[40px]"></div>
    </div>
  </div>;

  if (!client) return <div>Client not found</div>;

  return (
    <div className="p-10 space-y-10 min-h-screen pb-32">
      <header className="flex items-center gap-6">
        <button 
          onClick={() => router.back()}
          className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-primary transition shadow-sm"
        >
          <ChevronLeft size={24} />
        </button>
        <div>
          <div className="flex items-center gap-3">
             <h1 className="text-4xl font-black text-slate-900 tracking-tight">{client.name}</h1>
             <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${client.type === 'BUYER' ? 'bg-indigo-50 text-indigo-600' : 'bg-orange-50 text-orange-600'}`}>
                {client.type} Account
             </span>
          </div>
          <p className="text-slate-400 font-medium mt-1 uppercase text-[10px] tracking-widest">Client Interaction Folder • ID_{client._id.slice(-6)}</p>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
        {/* Main Content: Timeline & Actions */}
        <div className="xl:col-span-2 space-y-12">
          
          {/* Interaction Logger */}
          <section className="bg-white border border-slate-100 rounded-[40px] p-10 shadow-sm">
             <div className="flex items-center gap-3 mb-8">
                <History className="text-primary" size={20} />
                <h3 className="font-bold text-slate-900">Record New Interaction</h3>
             </div>
             
             <form onSubmit={handleAddInteraction} className="space-y-6">
                <div className="flex gap-4">
                   {['CALL', 'EMAIL', 'MEETING', 'NOTE'].map(type => (
                     <button 
                       key={type}
                       type="button"
                       onClick={() => setNewLog({...newLog, type})}
                       className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition ${newLog.type === type ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                     >
                        {type}
                     </button>
                   ))}
                </div>
                <div className="relative">
                   <textarea 
                     required
                     className="w-full h-32 p-6 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-primary/50 transition font-medium text-sm resize-none"
                     placeholder="What happened during this interaction? Documentation is key."
                     value={newLog.message}
                     onChange={e => setNewLog({...newLog, message: e.target.value})}
                   />
                   <button type="submit" className="absolute bottom-4 right-4 bg-slate-900 text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-black transition active:scale-95 shadow-xl">
                      Save Record
                   </button>
                </div>
             </form>
          </section>

          {/* Activity Timeline */}
          <section className="space-y-8">
             <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest ml-4">Activity Stream</h3>
             <div className="space-y-6">
                {(client.interactions || []).slice().reverse().map((log, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={idx}
                    className="flex gap-6 group"
                  >
                     <div className="flex flex-col items-center">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg ${log.type === 'CALL' ? 'bg-blue-500' : log.type === 'MEETING' ? 'bg-emerald-500' : 'bg-slate-400'}`}>
                           {log.type === 'CALL' ? <Phone size={18} /> : log.type === 'MEETING' ? <Calendar size={18} /> : <MessageSquare size={18} />}
                        </div>
                        <div className="w-0.5 h-full bg-slate-100 my-2"></div>
                     </div>
                     <div className="bg-white border border-slate-100 p-8 rounded-[32px] flex-1 shadow-sm group-hover:shadow-md transition">
                        <div className="flex justify-between items-center mb-4">
                           <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                              {new Date(log.createdAt).toLocaleString()}
                           </span>
                           <div className="flex gap-1">
                              {[1,2,3].map(i => <div key={i} className="w-1 h-1 bg-slate-200 rounded-full"></div>)}
                           </div>
                        </div>
                        <p className="text-slate-700 font-medium leading-relaxed">{log.message}</p>
                     </div>
                  </motion.div>
                ))}
             </div>
          </section>
        </div>

        {/* Sidebar: Details & Preferences */}
        <div className="space-y-10">
           <section className="bg-slate-900 text-white rounded-[40px] p-10 relative overflow-hidden shadow-2xl border border-white/10">
              <div className="absolute top-0 right-0 p-10 opacity-10">
                 <Briefcase size={80} />
              </div>
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-primary mb-10">Preference Kernel</h3>
              <div className="space-y-8">
                 <DataRow icon={DollarSign} label="Target Budget" value={`$${client.preferences?.budget?.toLocaleString() || 'N/A'}`} />
                 <DataRow icon={MapPin} label="Territory" value={client.preferences?.location || 'Unspecified'} />
                 <DataRow icon={Clock} label="Status" value={client.status} />
              </div>
              
              <div className="mt-12 pt-10 border-t border-white/5 space-y-4">
                 <div className="flex items-center gap-4 text-slate-400 hover:text-white transition cursor-pointer">
                    <Phone size={16} /> <span className="text-xs font-bold">{client.phone}</span>
                 </div>
                 <div className="flex items-center gap-4 text-slate-400 hover:text-white transition cursor-pointer">
                    <Mail size={16} /> <span className="text-xs font-bold">{client.email || 'No email provided'}</span>
                 </div>
              </div>
           </section>

           <section className="bg-white border border-slate-100 rounded-[40px] p-10">
              <header className="flex justify-between items-center mb-8">
                 <h3 className="font-bold text-slate-900">Wishlist Assets</h3>
                 <Star size={18} className="text-warning fill-warning" />
              </header>
              <div className="space-y-4">
                 {(client.interestedProperties || []).length === 0 ? (
                   <p className="text-xs text-slate-400 font-medium italic">No properties linked yet.</p>
                 ) : (
                   client.interestedProperties.map(p => (
                     <div key={p._id} className="flex items-center gap-4 p-4 hover:bg-slate-50 rounded-2xl transition cursor-pointer group">
                        <div className="w-12 h-12 bg-slate-100 rounded-xl"></div>
                        <div>
                           <p className="text-sm font-bold text-slate-900 group-hover:text-primary transition">{p.title}</p>
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">${p.price?.toLocaleString()}</p>
                        </div>
                     </div>
                   ))
                 )}
                 <button className="w-full mt-6 py-4 border-2 border-dashed border-slate-100 rounded-2xl text-slate-400 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition active:scale-95">
                    Link Property
                 </button>
              </div>
           </section>
        </div>
      </div>
    </div>
  );
}

function DataRow({ icon: Icon, label, value }) {
  return (
    <div className="flex gap-6 items-center">
       <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-primary border border-white/5 shadow-inner">
          <Icon size={18} />
       </div>
       <div>
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{label}</p>
          <p className="text-lg font-black tracking-tight">{value}</p>
       </div>
    </div>
  );
}
