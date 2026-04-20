"use client";
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { apiFetch } from '@/lib/api';
import { Building2, Plus, MapPin, Grid, Map as MapIcon, Home, ArrowRight, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PropertyFormModal from '@/components/PropertyFormModal';

// Dynamic import for Leaflet to prevent SSR issues
const PropertyMap = dynamic(() => import('@/components/PropertyMap'), { 
  ssr: false,
  loading: () => <div className="h-[600px] w-full bg-slate-50 rounded-[40px] animate-pulse flex items-center justify-center font-black text-slate-300 uppercase tracking-widest">Loading Satellite Engine...</div>
});

export default function PropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('grid'); // 'grid' | 'map'
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const data = await apiFetch('/properties');
      setProperties(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    loadProperties();
  }, []);

  if (loading) return (
    <div className="p-10 space-y-10">
      <div className="h-20 bg-slate-50 rounded-3xl animate-pulse"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[1,2,3,4,5,6].map(i=><div key={i} className="h-96 bg-slate-50 rounded-[32px] animate-pulse"></div>)}
      </div>
    </div>
  );

  return (
    <div className="p-10 space-y-10 min-h-screen">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Property Asset Catalog</h1>
          <p className="text-slate-400 font-medium mt-1">Manage and monitor your high-value inventory.</p>
        </div>
        
        <div className="flex items-center gap-4 bg-white p-2 rounded-[24px] border border-slate-100 shadow-sm">
           <button 
             onClick={() => setView('grid')}
             className={`px-6 py-3 rounded-2xl flex items-center gap-2 text-sm font-bold transition-all ${view === 'grid' ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:text-slate-900'}`}
           >
             <Grid size={18} /> Catalog
           </button>
           <button 
             onClick={() => setView('map')}
             className={`px-6 py-3 rounded-2xl flex items-center gap-2 text-sm font-bold transition-all ${view === 'map' ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:text-slate-900'}`}
           >
             <MapIcon size={18} /> Spatial View
           </button>
           <div className="w-px h-8 bg-slate-100 mx-2"></div>
           <button 
             onClick={() => setIsModalOpen(true)}
             className="bg-primary text-white p-3.5 rounded-2xl shadow-lg shadow-primary/20 hover:scale-105 transition active:scale-95"
           >
             <Plus size={20} />
           </button>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {view === 'grid' ? (
          <motion.div 
            key="grid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-10"
          >
            {properties.length === 0 ? (
              <div className="py-32 text-center border-2 border-dashed border-slate-100 rounded-[40px] bg-slate-50/30">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-300 shadow-sm">
                  <Home size={32} />
                </div>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No active listings available</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {properties.map(p => (
                  <motion.div 
                    layout
                    whileHover={{ y: -10 }}
                    key={p._id} 
                    className="group bg-white border border-slate-100 rounded-[32px] overflow-hidden shadow-sm hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] transition-all duration-500"
                  >
                    <div className="aspect-[16/10] bg-slate-100 relative overflow-hidden">
                      {p.images?.[0]?.url ? 
                        <motion.img 
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.7 }}
                          src={p.images[0].url} 
                          alt={p.title} 
                          className="object-cover w-full h-full" 
                        /> : 
                        <div className="flex items-center justify-center h-full text-slate-200 bg-slate-50"><Building2 size={64} /></div>
                      }
                      <div className="absolute top-4 right-4 px-4 py-2 bg-white/90 backdrop-blur-md rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-800 shadow-xl border border-white">
                        {p.status}
                      </div>
                      <div className="absolute bottom-4 left-4 flex gap-2">
                         {p.type && (
                           <span className="px-3 py-1 bg-slate-900/40 backdrop-blur-sm rounded-lg text-white text-[8px] font-black uppercase tracking-widest">{p.type}</span>
                         )}
                      </div>
                    </div>
                    <div className="p-8 space-y-6">
                      <div>
                        <h3 className="text-xl font-black text-slate-900 truncate group-hover:text-primary transition-colors tracking-tight">{p.title}</h3>
                        <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-black uppercase tracking-[0.1em] mt-2">
                          <MapPin size={12} className="text-primary" /> {p.location}
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center pt-6 border-t border-slate-50">
                        <div>
                          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Listing Price</div>
                          <div className="text-2xl font-black text-slate-900 font-data tracking-tight mt-1">
                            ${p.price?.toLocaleString()}
                          </div>
                        </div>
                        <button className="h-14 w-14 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-sm">
                          <ArrowRight size={20} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="map"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="relative"
          >
            <div className="absolute top-6 left-6 z-10 space-y-2 pointer-events-none">
               <div className="bg-slate-900/90 backdrop-blur-xl p-6 rounded-[32px] text-white shadow-2xl pointer-events-auto border border-white/10">
                  <div className="flex items-center gap-3 mb-2">
                    <Layers size={16} className="text-primary" />
                    <h4 className="font-black text-xs uppercase tracking-widest text-primary">Interactive Layer</h4>
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium leading-relaxed max-w-[200px]">Browsing <span className="text-white font-bold">{properties.length} active listings</span> across the region. Click on markers for details.</p>
               </div>
            </div>
            <PropertyMap properties={properties} />
          </motion.div>
        )}
      </AnimatePresence>

      <PropertyFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={loadProperties} 
      />
    </div>
  );
}
