"use client";
import React from 'react';
import { Clock, MessageSquare, Tag, User, MapPin, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const activityIcons = {
  'STATUS_CHANGE': Tag,
  'NOTE': MessageSquare,
  'DOCUMENT': MapPin,
  'SYSTEM': AlertCircle,
  'default': Clock
};

export default function ActivityTimeline({ activities }) {
  if (!activities || activities.length === 0) {
    return (
      <div className="py-20 text-center bg-slate-50/50 rounded-[40px] border-2 border-dashed border-slate-100">
         <Clock size={32} className="mx-auto text-slate-200 mb-4" />
         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No activities recorded yet</p>
      </div>
    );
  }

  return (
    <div className="relative space-y-8 before:absolute before:inset-y-0 before:left-6 before:w-px before:bg-slate-100">
      {activities.map((activity, idx) => {
        const Icon = activityIcons[activity.type] || activityIcons.default;
        const colorClass = activity.type === 'STATUS_CHANGE' ? 'bg-primary text-white' : 'bg-white text-slate-400 border border-slate-100';

        return (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="relative pl-16 group"
          >
            {/* Timeline Marker */}
            <div className={`absolute left-0 w-12 h-12 rounded-2xl flex items-center justify-center z-10 shadow-sm transition-transform group-hover:scale-110 ${colorClass}`}>
               <Icon size={20} />
            </div>

            {/* Bubble Content */}
            <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
               <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none">
                      {activity.type?.replace('_', ' ') || 'Notification'}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-slate-200"></span>
                    <span className="text-[10px] font-bold text-slate-400 italic">
                      {new Date(activity.createdAt || activity.date).toLocaleString()}
                    </span>
                  </div>
                  {activity.createdBy && (
                    <div className="flex items-center gap-1.5 opacity-50">
                      <User size={10} />
                      <span className="text-[10px] font-bold">{activity.createdBy?.name || 'System'}</span>
                    </div>
                  )}
               </div>
               <p className="text-slate-600 text-sm leading-relaxed font-medium">
                 {activity.message || activity.content || activity.note}
               </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
