"use client";
import React, { useState, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ImageUploader({ onUploadSuccess, maxFiles = 10 }) {
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > maxFiles) {
      alert(`Max ${maxFiles} images allowed`);
      return;
    }

    setUploading(true);
    
    try {
      const formData = new FormData();
      files.forEach(file => formData.append('files', file));

      // Use native fetch to avoid application/json default from helper
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/upload/multiple', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      
      const newImages = data.files.map(file => ({
        id: file.filename,
        url: `http://localhost:5000${file.url}`,
        name: file.filename,
        loading: false
      }));

      setImages(prev => [...prev, ...newImages]);
      onUploadSuccess?.([...images, ...newImages]);
    } catch (err) {
      console.error('Upload error:', err);
      alert('Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (id) => {
    const filtered = images.filter(img => img.id !== id);
    setImages(filtered);
    onUploadSuccess?.(filtered);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <AnimatePresence>
          {images.map((img) => (
            <motion.div
              key={img.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="group relative aspect-square rounded-[24px] overflow-hidden border border-slate-100 bg-slate-50 shadow-sm"
            >
              <img src={img.url} alt="Uploaded" className="w-full h-full object-cover transition duration-500 group-hover:scale-110" />
              <button 
                onClick={() => removeImage(img.id)}
                className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur-md rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
              >
                <X size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        {images.length < maxFiles && (
          <label className="aspect-square rounded-[24px] border-2 border-dashed border-slate-100 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 hover:border-primary/20 transition-all group">
            <input type="file" multiple className="hidden" onChange={handleFileChange} accept="image/*" />
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-300 group-hover:text-primary transition-colors shadow-sm">
              <Upload size={24} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-4 group-hover:text-slate-900 transition-colors">
              Add Media
            </span>
          </label>
        )}
      </div>

      <div className="flex items-center gap-3 px-6 py-4 bg-blue-50/50 border border-blue-100 rounded-2xl">
         <AlertCircle size={16} className="text-blue-500" />
         <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">
           Images are limited to 10 per listing. Max size 5MB.
         </p>
      </div>
    </div>
  );
}
