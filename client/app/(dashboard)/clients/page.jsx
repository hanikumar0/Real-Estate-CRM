"use client";
import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { UserCheck, MapPin, DollarSign, Briefcase, Activity } from 'lucide-react';

export default function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await apiFetch('/clients');
        setClients(data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    load();
  }, []);

  if (loading) return <div className="p-12 space-y-8 animate-pulse">
    <div className="h-10 bg-slate-100 w-1/4 rounded-xl"></div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {[1,2,3].map(i=><div key={i} className="h-64 bg-slate-50 rounded-3xl"></div>)}
    </div>
  </div>;

  return (
    <div className="p-10 space-y-10">
      <header>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">VIP Client Portfolio</h1>
        <p className="text-slate-400 font-medium mt-1">Your core database of converted high-value buyers and sellers.</p>
      </header>

      {clients.length === 0 ? (
        <div className="py-40 text-center border border-slate-100 rounded-[40px] bg-slate-50/50">
           <Activity className="mx-auto text-slate-200 mb-4" size={48} />
           <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Waiting for your first conversion...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {clients.map(client => (
            <div key={client._id} className="bg-white border border-slate-200/60 rounded-[32px] p-8 shadow-sm hover:shadow-2xl transition-all duration-300 group">
              <div className="flex justify-between items-start mb-8">
                <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-sm">
                  <UserCheck size={28} />
                </div>
                <div className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${client.type === 'buyer' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-orange-50 text-orange-600 border-orange-100'}`}>
                  {client.type}
                </div>
              </div>
              
              <h3 className="text-2xl font-black text-slate-800 mb-1 group-hover:text-primary transition">{client.name}</h3>
              <p className="text-xs text-slate-400 font-black uppercase tracking-tight mb-8 italic">{client.phone} • {client.email || 'Private Email'}</p>
              
              <div className="space-y-4 pt-8 border-t border-slate-50">
                <div className="flex items-center gap-3 text-slate-600">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400"><MapPin size={16} /></div>
                  <span className="text-sm font-semibold">{client.preferences?.location || 'Undisclosed Area'}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400"><DollarSign size={16} /></div>
                  <span className="text-lg font-black font-data tracking-tight text-slate-800">${client.preferences?.budget?.toLocaleString() || 'Flexible'}</span>
                </div>
              </div>

              <div className="mt-8">
                <button className="w-full py-3 bg-slate-50 group-hover:bg-primary group-hover:text-white rounded-xl text-slate-400 text-xs font-black uppercase tracking-widest transition-all">
                  Open Client Folder
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
