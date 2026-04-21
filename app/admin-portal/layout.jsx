"use client";
import AdminSidebar from '@/components/AdminSidebar';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function AdminPortalLayout({ children }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const role = localStorage.getItem('role');
      const token = localStorage.getItem('token');
      if (!token || (role !== 'ADMIN' && role !== 'MANAGER')) {
        router.replace('/admin-login');
      } else {
        setAuthorized(true);
        setChecking(false);
      }
    };
    const timer = setTimeout(checkAuth, 100);
    return () => clearTimeout(timer);
  }, [router]);

  if (checking || !authorized) {
    return (
      <div className="h-screen bg-slate-50 flex items-center justify-center font-sans">
         <div className="space-y-6 text-center">
           <Loader2 className="text-primary animate-spin mx-auto" size={32} />
           <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Loading Secure Portal...</p>
         </div>
      </div>
    );
  }

  return (
    <div className="flex bg-[#f8fafc] min-h-screen text-slate-900 font-sans selection:bg-primary/10">
      <AdminSidebar />
      <main className="flex-1 ml-72 min-h-screen p-8">
        <div className="bg-white border border-slate-200 rounded-[32px] shadow-xl shadow-slate-200/50 min-h-[calc(100vh-4rem)] relative overflow-hidden flex flex-col">
          {/* Clean, light background accents */}
          <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-slate-50 to-transparent pointer-events-none"></div>
          
          <div className="relative z-10 flex-1 flex flex-col p-4">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
