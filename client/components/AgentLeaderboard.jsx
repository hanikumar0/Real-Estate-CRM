"use client";
import React from 'react';
import { Award, TrendingUp, DollarSign, Target, User } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AgentLeaderboard({ agents = [] }) {
  // Sort by score just in case
  const sortedAgents = [...agents].sort((a, b) => b.score - a.score);
  const maxScore = sortedAgents.length > 0 ? sortedAgents[0].score : 100;

  return (
    <div className="bg-white border border-slate-100 rounded-[40px] p-10 shadow-sm relative overflow-hidden group">
      <header className="flex justify-between items-end mb-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Award className="text-amber-500" size={20} />
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Performance Ranking</h3>
          </div>
          <p className="text-slate-400 text-xs font-medium uppercase tracking-widest leading-none">Top 10 Agents by Productivity Score</p>
        </div>
        <div className="text-right">
          <span className="bg-slate-50 text-slate-400 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest">Global Metrics</span>
        </div>
      </header>

      <div className="space-y-8">
        {sortedAgents.length === 0 ? (
          <div className="py-20 text-center text-slate-300 font-bold uppercase tracking-widest text-xs">No ranking data available</div>
        ) : (
          sortedAgents.map((agent, index) => (
            <motion.div 
              key={agent._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs ${
                    index === 0 ? 'bg-amber-100 text-amber-600' : 
                    index === 1 ? 'bg-slate-100 text-slate-600' : 
                    index === 2 ? 'bg-orange-50 text-orange-600' : 'bg-slate-50 text-slate-300'
                  }`}>
                    #{index + 1}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 flex items-center gap-2">
                       {agent.name}
                       {index === 0 && <span className="bg-success/10 text-success text-[8px] px-2 py-0.5 rounded-full uppercase tracking-widest">Elite</span>}
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                       <span className="text-[10px] font-black text-slate-400 flex items-center gap-1"><Target size={10} /> {agent.deals || 0} Deals</span>
                       <span className="text-[10px] font-black text-slate-400 flex items-center gap-1"><DollarSign size={10} /> ${(agent.revenue / 1000).toFixed(1)}k</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                   <div className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{agent.score?.toFixed(0)}</div>
                   <div className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">PTS</div>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(agent.score / maxScore) * 100}%` }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className={`h-full rounded-full ${
                    index === 0 ? 'bg-primary' : 
                    index === 1 ? 'bg-slate-400' : 
                    'bg-slate-200'
                  }`}
                />
              </div>
            </motion.div>
          ))
        )}
      </div>

      <div className="mt-12 pt-8 border-t border-slate-50 flex items-center justify-between">
         <div className="flex -space-x-3">
            {sortedAgents.slice(0, 5).map((a, i) => (
              <div key={i} className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-black text-slate-400 uppercase ring-2 ring-transparent group-hover:ring-primary/10 transition">
                {a.name[0]}
              </div>
            ))}
         </div>
         <p className="text-[10px] font-bold text-slate-400 italic">Scores refresh every 24h based on closure velocity.</p>
      </div>
    </div>
  );
}
