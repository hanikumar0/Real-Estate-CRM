"use client";
import Sidebar from '@/components/Sidebar';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.replace('/login');
    } else {
      setAuthorized(true);
    }
    
    // Listens for 'storage' events to logout from all tabs
    const handleStorageChange = () => {
      if (!localStorage.getItem('token')) {
        router.replace('/login');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [router]);

  if (!authorized) return (
    <div className="h-screen flex items-center justify-center bg-slate-50">
       <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="flex bg-slate-50 min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-64 min-h-screen p-4">
        <div className="bg-white rounded-2xl shadow-sm min-h-[calc(100vh-2rem)] border border-slate-100">
          {children}
        </div>
      </main>
    </div>
  );
}
