"use client";
import { Settings, ShieldCheck, Database, Bell, Layout } from 'lucide-react';

export default function AdminSettingsPage() {
  return (
    <div className="p-10 space-y-12">
      <header>
        <div className="flex items-center gap-3 text-primary mb-3">
          <Settings size={18} />
          <span className="text-[10px] font-black uppercase tracking-[0.4em]">Core_Configuration</span>
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight">System Configuration</h1>
        <p className="text-slate-400 text-sm mt-2">Global environment variables and core platform behavior settings.</p>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
        <section className="space-y-6">
          <SettingGroup 
            title="Security Architecture" 
            description="Manage authentication protocols and session policies."
            items={[
              { label: 'Multi-Factor Authentication', status: 'Mandatory', icon: ShieldCheck },
              { label: 'Session Timeout (Minutes)', value: '60', icon: Layout },
            ]}
          />
          <SettingGroup 
            title="Automation & Data" 
            description="Configure webhook integrations and data retention."
            items={[
              { label: 'n8n Webhook Sync', status: 'Enabled', icon: Database },
              { label: 'Communication Alerts', status: 'Active', icon: Bell },
            ]}
          />
        </section>
        
        <div className="bg-primary/5 border border-primary/20 rounded-[40px] p-12 relative overflow-hidden">
           <div className="relative z-10">
              <h3 className="text-xl font-bold text-white mb-4">Kernel Status</h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-8">
                The core system is currently running on **SaaS Ver 4.0.2**. All modules are synchronized and operating within optimal parameters.
              </p>
              <div className="space-y-4">
                 <div className="flex justify-between text-xs">
                    <span className="text-slate-500 font-bold uppercase underline">Node Uptime</span>
                    <span className="text-white font-black italic">14 Days, 2h 14m</span>
                 </div>
                 <div className="flex justify-between text-xs">
                    <span className="text-slate-500 font-bold uppercase underline">Last Deployment</span>
                    <span className="text-white font-black italic">2026-04-18 14:22</span>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function SettingGroup({ title, description, items }) {
  return (
    <div className="bg-slate-800/30 border border-slate-700/50 rounded-[32px] p-8 space-y-6">
      <div>
         <h3 className="text-lg font-bold text-white">{title}</h3>
         <p className="text-xs text-slate-500 font-medium">{description}</p>
      </div>
      <div className="space-y-3">
         {items.map(item => (
           <div key={item.label} className="flex items-center justify-between p-4 bg-slate-900/50 border border-slate-800 rounded-2xl">
              <div className="flex items-center gap-3">
                 <item.icon size={16} className="text-slate-500" />
                 <span className="text-xs font-bold text-white">{item.label}</span>
              </div>
              <span className="text-[10px] font-black text-primary uppercase tracking-widest">{item.status || item.value}</span>
           </div>
         ))}
      </div>
    </div>
  );
}
