"use client";
import React, { useEffect, useState } from 'react';
import { Calendar, Clock, ChevronRight, Phone, MessageSquare } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { motion } from 'framer-motion';

export default function FollowUpWidget() {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReminders() {
      try {
        const data = await apiFetch('/leads/reminders');
        setReminders(data);
      } catch (err) {
        console.error('Failed to load reminders', err);
      } finally {
        setLoading(false);
      }
    }
    loadReminders();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const isOverdue = date < now && !isToday;

    return (
      <span className={`text-[10px] font-black uppercase tracking-widest ${isOverdue ? 'text-red-500' : isToday ? 'text-primary' : 'text-slate-400'}`}>
        {isToday ? 'Today' : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} @ {date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
        {isOverdue && ' (Overdue)'}
      </span>
    );
  };

  if (loading) return (
    <div className="bg-white rounded-[32px] p-8 border border-slate-100 animate-pulse">
       <div className="h-4 bg-slate-100 w-1/3 mb-6 rounded"></div>
       <div className="space-y-4">
          {[1,2,3].map(i => <div key={i} className="h-16 bg-slate-50 rounded-2xl"></div>)}
       </div>
    </div>
  );

  return (
    <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm">
      <header className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
           <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <Calendar size={18} />
           </div>
           <h3 className="font-bold text-slate-900">Follow-up Pipeline</h3>
        </div>
        <span className="bg-primary/5 text-primary text-[10px] font-black px-3 py-1 rounded-full uppercase">
          {reminders.length} Pending
        </span>
      </header>

      <div className="space-y-3">
        {reminders.length === 0 ? (
          <div className="py-12 text-center space-y-3">
             <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
                <Clock size={24} />
             </div>
             <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No scheduled tasks</p>
          </div>
        ) : (
          reminders.slice(0, 5).map((item, idx) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              key={item.followUpId}
              className="group p-4 bg-slate-50 hover:bg-white border border-transparent hover:border-slate-100 rounded-2xl transition-all cursor-pointer flex items-center justify-between shadow-sm hover:shadow-md"
            >
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors border border-slate-100">
                    <Phone size={16} />
                 </div>
                 <div>
                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors">{item.name}</h4>
                    {formatDate(item.date)}
                 </div>
              </div>
              
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                 <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-900">
                    <MessageSquare size={16} />
                 </button>
                 <ChevronRight size={18} className="text-slate-300" />
              </div>
            </motion.div>
          ))
        )}
      </div>

      {reminders.length > 5 && (
        <button className="w-full mt-6 py-3 text-xs font-bold text-slate-400 hover:text-primary transition-colors underline-offset-4 hover:underline uppercase tracking-widest">
          View all Task Reminders
        </button>
      )}
    </div>
  );
}
