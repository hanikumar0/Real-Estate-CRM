"use client";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ShieldCheck, Users, Activity, Terminal, Settings, LogOut, Cpu, Eye } from 'lucide-react';

const adminNavItems = [
  { name: 'Control Center', href: '/admin-portal', icon: ShieldCheck },
  { name: 'User Governance', href: '/admin-portal/users', icon: Users },
  { name: 'System Logs', href: '/admin-portal/logs', icon: Activity },
  { name: 'Edge Monitor', href: '/admin-portal/monitor', icon: Cpu },
  { name: 'Core Config', href: '/admin-portal/settings', icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.clear();
    router.replace('/admin-login');
  };

  return (
    <div className="w-72 bg-white h-screen border-r border-slate-200 flex flex-col fixed left-0 top-0 z-50">
      <div className="p-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center text-primary shadow-sm">
            <Terminal size={22} />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tighter uppercase italic">Admin.OS</h1>
            <div className="flex items-center gap-2">
               <div className="w-1.5 h-1.5 bg-success rounded-full animate-pulse shadow-[0_0_5px_#10b981]"></div>
               <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">System Ready</span>
            </div>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-6 space-y-1 mt-4">
        {adminNavItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.name} 
              href={item.href}
              className={`flex items-center justify-between px-5 py-4 rounded-2xl transition-all duration-300 group ${
                isActive ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-500 hover:text-primary hover:bg-primary/5'
              }`}
            >
              <div className="flex items-center gap-4">
                 <item.icon size={20} className={isActive ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'} />
                 <span className={`text-sm font-bold tracking-tight ${isActive ? 'text-white' : 'text-slate-600'}`}>{item.name}</span>
              </div>
              {isActive && <div className="w-1.5 h-1.5 rounded-full bg-white shadow-sm"></div>}
            </Link>
          );
        })}
        
        <div className="pt-8 mx-4">
           <Link 
             href="/dashboard"
             className="flex items-center gap-4 px-4 py-4 text-slate-400 hover:text-primary transition-colors text-sm font-bold"
           >
             <Eye size={18} />
             <span>Agent View</span>
           </Link>
        </div>
      </nav>

      <div className="p-8 border-t border-slate-100 bg-slate-50/50">
         <div className="mb-6 px-2">
            <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
               <span>Performance</span>
               <span className="text-success font-bold">100%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden shadow-inner">
               <div className="h-full bg-primary w-[88%] rounded-full shadow-sm"></div>
            </div>
         </div>
        <button 
          onClick={handleLogout}
          className="w-full text-left px-5 py-4 text-sm font-bold text-red-500 hover:bg-red-50 rounded-2xl flex items-center gap-4 transition-all"
        >
          <LogOut size={18} />
          Sign Out Terminal
        </button>
      </div>
    </div>
  );
}
