"use client";
import { Cpu, Server, Database, Globe, Network, Activity } from 'lucide-react';

export default function AdminMonitorPage() {
  return (
    <div className="p-10 space-y-12">
      <header>
        <div className="flex items-center gap-3 text-primary mb-3">
          <Cpu size={18} />
          <span className="text-[10px] font-black uppercase tracking-[0.4em]">Infrastructure_Pulse</span>
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight">Edge Monitor</h1>
        <p className="text-slate-400 text-sm mt-2">Real-time infrastructure health and API throughput monitoring.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <MonitorCard 
          title="Compute Cluster" 
          value="Healthy" 
          detail="0.04% Error Rate" 
          icon={Server} 
          status="success" 
        />
        <MonitorCard 
          title="Database Latency" 
          value="12ms" 
          detail="Synchronized" 
          icon={Database} 
          status="success" 
        />
        <MonitorCard 
          title="Network Ingress" 
          value="4.2 GB/s" 
          detail="Optimal Flow" 
          icon={Globe} 
          status="success" 
        />
      </div>

      <section className="bg-slate-800/40 border border-slate-700/50 rounded-[40px] p-12">
         <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-white">Active Traffic Nodes</h2>
            <div className="flex gap-2">
               <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
               <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Global Relay Active</span>
            </div>
         </div>
         
         <div className="space-y-6">
            {[
              { region: 'NA-East-1', load: '14%', ping: '9ms' },
              { region: 'EU-West-3', load: '28%', ping: '42ms' },
              { region: 'AP-South-1', load: '6%', ping: '118ms' },
            ].map(item => (
              <div key={item.region} className="flex items-center justify-between p-6 bg-slate-900 border border-slate-800 rounded-3xl group hover:border-primary/50 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-2 h-10 bg-slate-800 rounded-full overflow-hidden">
                    <div className="w-full bg-primary" style={{ height: item.load }}></div>
                  </div>
                  <span className="text-sm font-bold text-white tracking-tight">{item.region}</span>
                </div>
                <div className="flex gap-8 items-center">
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-600 uppercase">Load</p>
                    <p className="text-sm font-bold text-white">{item.load}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-600 uppercase">Latency</p>
                    <p className="text-sm font-bold text-primary italic">{item.ping}</p>
                  </div>
                </div>
              </div>
            ))}
         </div>
      </section>
    </div>
  );
}

function MonitorCard({ title, value, detail, icon: Icon, status }) {
  return (
    <div className="bg-slate-800/30 border border-slate-700/50 p-8 rounded-[32px] group hover:border-primary/20 transition-all">
       <div className="flex justify-between items-start mb-6">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
             <Icon size={24} />
          </div>
          <div className="px-3 py-1 bg-success/10 border border-success/20 rounded-full">
             <span className="text-[10px] font-black text-success uppercase">Active</span>
          </div>
       </div>
       <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">{title}</h4>
       <div className="text-3xl font-black text-white italic mb-1">{value}</div>
       <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{detail}</p>
    </div>
  );
}
