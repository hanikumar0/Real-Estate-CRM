"use client";
import React, { useState } from 'react';
import { X, MapPin, DollarSign, Building2, Ruler, Bed, Bath, Plus, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiFetch } from '@/lib/api';
import ImageUploader from './ImageUploader';
import dynamic from 'next/dynamic';

// Dynamic import for the Map Picker to prevent SSR issues
const LocationPicker = dynamic(() => import('./LocationPicker'), { 
  ssr: false,
  loading: () => <div className="h-48 w-full bg-slate-50 rounded-2xl animate-pulse flex items-center justify-center text-[10px] font-black text-slate-300">Initializing Map Engine...</div>
});

export default function PropertyFormModal({ isOpen, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'RESIDENTIAL',
    price: '',
    location: '',
    size: '',
    bedrooms: '',
    bathrooms: '',
    coordinates: { lat: 28.6139, lng: 77.2090 } // Default New Delhi
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        size: Number(formData.size),
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        images: images.map(img => ({ url: img.url, publicId: img.id }))
      };

      await apiFetch('/properties', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      onSuccess?.();
      onClose();
    } catch (err) {
      console.error(err);
      alert('Failed to add property: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 md:p-10">
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
        className="w-full max-w-4xl bg-white rounded-[48px] shadow-2xl relative overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
      >
        {/* Left Side: Form Details */}
        <div className="flex-1 p-8 md:p-12 overflow-y-auto custom-scrollbar">
          <header className="mb-10">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">List New Asset</h2>
            <p className="text-slate-400 font-medium mt-1 uppercase text-[10px] tracking-widest">Inventory Management System</p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              <div className="group">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Asset Title</label>
                <input 
                  required
                  type="text" 
                  placeholder="e.g. Modern Minimalist Villa"
                  className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300"
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Price ($)</label>
                   <input required type="number" placeholder="500,000" className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-bold" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                </div>
                <div>
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Type</label>
                   <select className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-bold" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                     <option value="RESIDENTIAL">Residential</option>
                     <option value="COMMERCIAL">Commercial</option>
                   </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Sqft</label>
                    <input type="number" className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-2xl font-bold" value={formData.size} onChange={e => setFormData({...formData, size: e.target.value})} />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Beds</label>
                    <input type="number" className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-2xl font-bold" value={formData.bedrooms} onChange={e => setFormData({...formData, bedrooms: e.target.value})} />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Baths</label>
                    <input type="number" className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-2xl font-bold" value={formData.bathrooms} onChange={e => setFormData({...formData, bathrooms: e.target.value})} />
                 </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Media Gallery</label>
                <ImageUploader onUploadSuccess={setImages} />
              </div>
            </div>

            <button 
              disabled={loading}
              className="w-full h-16 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-slate-900/20 hover:-translate-y-1 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {loading ? 'Encrypting & Saving...' : <><Plus size={20} /> Publish Listing</>}
            </button>
          </form>
        </div>

        {/* Right Side: Map & Address */}
        <div className="w-full md:w-80 lg:w-[400px] bg-slate-50 p-8 border-l border-slate-100 flex flex-col gap-8">
           <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Geographic Coordinates</label>
              <div className="h-64 rounded-3xl overflow-hidden shadow-inner border border-slate-200">
                 <LocationPicker 
                   position={[formData.coordinates.lat, formData.coordinates.lng]} 
                   onChange={(coords) => setFormData({...formData, coordinates: coords})}
                 />
              </div>
              <p className="text-[9px] text-slate-400 font-bold italic ml-1">Click the map to pinpoint exact location.</p>
           </div>

           <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Postal Address</label>
              <textarea 
                required
                className="w-full h-32 p-6 bg-white border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-bold text-sm resize-none"
                placeholder="e.g. 742 Evergreen Terrace, Springfield..."
                value={formData.location}
                onChange={e => setFormData({...formData, location: e.target.value})}
              ></textarea>
           </div>
        </div>

        <button onClick={onClose} className="absolute top-8 right-8 w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 hover:text-slate-900 hover:scale-110 transition-all shadow-sm">
          <X size={20} />
        </button>
      </motion.div>
    </div>
  );
}
