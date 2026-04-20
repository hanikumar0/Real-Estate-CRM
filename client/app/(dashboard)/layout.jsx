"use client";
import Sidebar from '@/components/Sidebar';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.replace('/login');
    } else {
      setAuthorized(true);
    }
  }, [router]);

  if (!authorized) return (
    <div className="h-screen flex items-center justify-center bg-slate-50">
       <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="flex bg-slate-50 min-h-screen">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <main className="flex-1 lg:ml-64 min-h-screen p-4 group">
        {/* Mobile Header Trigger */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-white rounded-xl mb-4 shadow-sm border border-slate-100">
           <h1 className="text-xl font-black text-primary italic tracking-tighter">EstateFlow</h1>
           <button 
             onClick={() => setIsSidebarOpen(true)}
             className="p-2 bg-slate-50 rounded-lg text-slate-400"
           >
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
           </button>
        </div>

        <div className="bg-white rounded-3xl shadow-sm min-h-[calc(100vh-2rem)] border border-slate-100 overflow-hidden">
          {children}
        </div>
      </main>
    </div>
  );
}
