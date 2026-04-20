"use client";
import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import StatCard from '@/components/StatCard';
import { Clock, Users, ArrowUpRight, CheckCircle2, DollarSign, TrendingUp, FileText, Download } from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, AreaChart, Area,
  BarChart, Bar, Cell
} from 'recharts';
import { exportToExcel, exportToPDF } from '@/lib/exportUtils';
import AgentLeaderboard from '@/components/AgentLeaderboard';
import FollowUpWidget from '@/components/FollowUpWidget';
import { motion } from 'framer-motion';

export default function DashboardPage() {
  const [stats, setStats] = useState({ totalLeads: 0, totalDeals: 0, totalRevenue: 0, conversionRate: 0 });
  const [trends, setTrends] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const handleExportExcel = () => {
    exportToExcel(trends, 'Real_Estate_Sales_Trends_2026');
  };

  const handleExportPDF = () => {
    const headers = [
      { key: 'month', label: 'Month' },
      { key: 'revenue', label: 'Revenue ($)' },
      { key: 'count', label: 'Deals Count' }
    ];
    exportToPDF(trends, headers, 'Quarterly Sales Velocity Report', 'Sales_Report_2026');
  };

  useEffect(() => {
    async function loadDashboard() {
      try {
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        const role = localStorage.getItem('role');
        setUser({ role });

        const [dashboardData] = await Promise.all([
          apiFetch('/analytics/dashboard')
        ]);
        setStats(dashboardData);

        if (role === 'ADMIN' || role === 'MANAGER') {
          const [trendsData, leaderboardData] = await Promise.all([
            apiFetch('/analytics/sales-trends'),
            apiFetch('/analytics/leaderboard')
          ]);
          
          setTrends(trendsData.map(t => ({
            month: new Date(2026, t._id - 1).toLocaleString('default', { month: 'short' }),
            revenue: t.revenue,
            count: t.count
          })));

          setLeaderboard(leaderboardData);
        }
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    loadDashboard();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  };

  if (loading) return <div className="p-10 animate-pulse space-y-12">
    <div className="flex gap-6">
      {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-slate-50 flex-1 rounded-3xl"></div>)}
    </div>
    <div className="h-96 bg-slate-50 rounded-[40px]"></div>
  </div>;

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="p-10 space-y-12 overflow-hidden"
    >
      <header className="flex justify-between items-center">
        <motion.div variants={itemVariants}>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">System Overview</h1>
          <p className="text-slate-400 font-medium mt-1">Real-time performance metrics for your workspace.</p>
        </motion.div>
        <motion.div variants={itemVariants} className="px-6 py-3 bg-white border border-slate-100 rounded-2xl shadow-sm flex items-center gap-4 hover:shadow-md transition cursor-pointer">
           <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-success animate-ping"></div>
           </div>
           <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
             Live Updates Connected
           </div>
        </motion.div>
      </header>

      {/* Primary Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <StatCard title="Pipeline Size" value={stats.totalLeads} icon={Users} color="blue" />
        <StatCard title="Active Deals" value={stats.totalDeals} icon={ArrowUpRight} color="slate" />
        <StatCard title="Net Revenue" value={`$${(stats.totalRevenue / 1000).toFixed(1)}k`} icon={DollarSign} color="success" />
        <StatCard title="Conversion" value={`${stats.conversionRate}%`} icon={TrendingUp} color="primary" />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Sales Performance Chart */}
        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
           <div className="bg-white border border-slate-100 rounded-[40px] p-10 shadow-sm relative overflow-hidden group hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] transition-all duration-500">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">Revenue Velocity</h3>
                  <p className="text-slate-400 text-xs font-medium mt-1 uppercase tracking-widest">Transaction trend for 2024</p>
                </div>
                <div className="flex gap-2">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleExportExcel}
                    className="text-[10px] font-black text-slate-900 bg-slate-100 px-4 py-2.5 rounded-xl hover:bg-slate-200 transition uppercase tracking-[0.2em] flex items-center gap-2"
                  >
                    <Download size={14} /> Excel
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleExportPDF}
                    className="text-[10px] font-black text-white bg-slate-900 px-4 py-2.5 rounded-xl hover:bg-slate-800 transition uppercase tracking-[0.2em] flex items-center gap-2"
                  >
                    <FileText size={14} /> PDF
                  </motion.button>
                </div>
              </div>
              
              <div className="h-[350px] w-full">
                {user?.role === 'AGENT' ? (
                  <div className="h-full flex items-center justify-center bg-slate-50/50 rounded-3xl border border-dashed border-slate-100">
                    <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Analytics reserved for management</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trends}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 900}} />
                      <YAxis hide />
                      <Tooltip 
                        contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', padding: '20px' }}
                        itemStyle={{ fontWeight: 900, color: '#0f172a' }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#3b82f6" 
                        strokeWidth={4}
                        fillOpacity={1} 
                        fill="url(#colorRevenue)" 
                        animationDuration={2000}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
           </div>
        </motion.div>

        {/* Leaderboard or Personal Insights */}
        <motion.div variants={itemVariants} className="space-y-8">
            {user?.role !== 'AGENT' ? (
              <AgentLeaderboard agents={leaderboard} />
            ) : (
              <div className="space-y-8">
                <FollowUpWidget />
                <motion.div 
                  whileHover={{ y: -5 }}
                  className="bg-slate-900 rounded-[40px] p-10 text-white relative h-full flex flex-col justify-between shadow-2xl overflow-hidden group border border-white/5"
                >
                  <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/20 blur-[100px] rounded-full group-hover:scale-150 transition-transform duration-700"></div>
                  <div className="space-y-8 relative z-10">
                      <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center">
                        <CheckCircle2 size={24} className="text-success" />
                      </div>
                      <div>
                        <h4 className="text-2xl font-black tracking-tight leading-none">Goal Achievement</h4>
                        <p className="text-slate-400 text-sm mt-3 leading-relaxed font-medium">You have achieved <span className="text-white font-black italic">82%</span> of your quarterly revenue target. Keep the momentum.</p>
                      </div>
                  </div>
                  <div className="pt-10 relative z-10">
                    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: '82%' }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                          className="h-full bg-success" 
                          style={{boxShadow: '0 0 20px #10b981'}}
                        />
                    </div>
                    <div className="flex justify-between mt-4">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Q2 Progress</span>
                        <span className="text-[10px] font-black text-white uppercase tracking-widest italic">82% / 100%</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
        </motion.div>
      </div>
    </motion.div>
  );
}
