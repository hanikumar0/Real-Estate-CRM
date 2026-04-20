"use client";
import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { exportToExcel, exportToPDF } from '@/lib/exportUtils';
import { Search, Plus, Filter, MoreHorizontal, Phone, FileText, FileSpreadsheet, Target as TargetIcon } from 'lucide-react';
import LeadMatchesModal from '@/components/LeadMatchesModal';

export default function LeadsPage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [selectedLeadForMatch, setSelectedLeadForMatch] = useState(null);
  const [isMatchModalOpen, setIsMatchModalOpen] = useState(false);

  const openMatcher = (e, lead) => {
    e.stopPropagation();
    setSelectedLeadForMatch(lead);
    setIsMatchModalOpen(true);
  };

  const handleExportExcel = () => {
    const data = leads.map(l => ({
      Name: l.name,
      Email: l.email,
      Phone: l.phone,
      Status: l.status,
      Budget: l.budget,
      Source: l.source,
      'Follow Up': l.followUpDate ? new Date(l.followUpDate).toLocaleDateString() : 'N/A'
    }));
    exportToExcel(data, `Leads_Master_Export_${new Date().toISOString().split('T')[0]}`);
  };

  const handleExportPDF = () => {
    const headers = [
      { key: 'name', label: 'Name' },
      { key: 'status', label: 'Status' },
      { key: 'budget', label: 'Budget' },
      { key: 'source', label: 'Source' },
      { key: 'followUpDate', label: 'Next Followup' }
    ];
    exportToPDF(leads, headers, 'Active Sales Pipeline - Lead Report', 'Leads_Report');
  };

  useEffect(() => {
    async function loadLeads() {
      try {
        const data = await apiFetch('/leads');
        setLeads(data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    loadLeads();
  }, []);

  const getUrgencyStyles = (date) => {
    if (!date) return 'bg-slate-50 text-slate-400';
    const d = new Date(date);
    const today = new Date();
    today.setHours(0,0,0,0);
    const ld = new Date(d);
    ld.setHours(0,0,0,0);

    if (ld < today) return 'bg-red-50 text-red-600 border-red-100 shadow-sm shadow-red-50';
    if (ld.getTime() === today.getTime()) return 'bg-yellow-50 text-yellow-700 border-yellow-100 shadow-sm shadow-yellow-50';
    return 'bg-blue-50 text-blue-600 border-blue-100 shadow-sm shadow-blue-50';
  };

  if (loading) return <div className="p-12 animate-pulse space-y-4">
    <div className="h-10 bg-slate-100 w-1/4 rounded-xl"></div>
    <div className="h-64 bg-slate-50 rounded-3xl"></div>
  </div>;

  return (
    <div className="p-10 space-y-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Lead Portfolio</h1>
          <p className="text-slate-400 font-medium mt-1">Manage and qualify your active sales pipeline.</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <div className="flex bg-white border border-slate-100 rounded-2xl p-1 shadow-sm">
            <button 
              onClick={handleExportExcel}
              className="flex items-center gap-2 text-slate-600 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition"
            >
              <FileSpreadsheet size={16} className="text-success" /> Excel
            </button>
            <div className="w-px h-6 bg-slate-100 self-center"></div>
            <button 
              onClick={handleExportPDF}
              className="flex items-center gap-2 text-slate-600 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition"
            >
              <FileText size={16} className="text-primary" /> PDF
            </button>
          </div>
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-3.5 rounded-2xl font-bold hover:bg-black transition shadow-xl">
            <Plus size={18} /> New Lead
          </button>
        </div>
      </header>

      {/* Action Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between pb-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
          <input 
            type="text" 
            placeholder="Search name, phone, or email..." 
            className="w-full pl-12 pr-6 py-3.5 bg-slate-50 border-none rounded-2xl text-sm outline-none focus:ring-2 focus:ring-primary/10 transition"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button className="flex-1 md:flex-none border border-slate-100 px-4 py-3 rounded-xl text-slate-500 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-50 transition">
            <Filter size={14} /> Filter
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-[32px] overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50">
              <th className="px-8 py-5">Full Name</th>
              <th className="px-8 py-5">Lifecycle</th>
              <th className="px-8 py-5">Financial Details</th>
              <th className="px-8 py-5">Next Follow-up</th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {leads.length === 0 ? (
              <tr><td colSpan="5" className="p-20 text-center text-slate-400 font-medium">No leads in the pipeline.</td></tr>
            ) : (
              leads.map(lead => (
                <tr 
                  key={lead._id} 
                  className="group hover:bg-slate-50/80 cursor-pointer transition-colors duration-200"
                  onClick={() => router.push(`/leads/${lead._id}`)}
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-primary/5 text-primary flex items-center justify-center font-black text-xs">
                        {lead.name.split(' ').map(n=>n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{lead.name}</div>
                        <div className="text-xs text-slate-400 font-medium mt-0.5">{lead.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="capitalize px-3 py-1 bg-white border border-slate-100 rounded-lg text-[10px] font-black tracking-widest text-slate-600 shadow-sm">
                      {lead.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="text-sm font-bold text-slate-700 font-data">${lead.budget?.toLocaleString() || 'N/A'}</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">{lead.source}</div>
                  </td>
                  <td className="px-8 py-6">
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border ${getUrgencyStyles(lead.followUpDate)}`}>
                       {lead.followUpDate ? new Date(lead.followUpDate).toLocaleDateString(undefined, {month: 'short', day: 'numeric'}) : 'No Date Set'}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={(e) => openMatcher(e, lead)}
                        className="w-9 h-9 flex items-center justify-center rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition"
                        title="AI Matching"
                      >
                       <TargetIcon size={14} />
                      </button>
                      <button className="w-9 h-9 flex items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/20 hover:scale-110 transition"><Phone size={14} /></button>
                      <button className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-slate-900 transition"><MoreHorizontal size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <LeadMatchesModal 
        isOpen={isMatchModalOpen} 
        onClose={() => setIsMatchModalOpen(false)} 
        lead={selectedLeadForMatch} 
      />
    </div>
  );
}
