"use client";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Users, Building2, WalletCards, Briefcase, ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Leads', href: '/leads', icon: Users },
  { name: 'Properties', href: '/properties', icon: Building2 },
  { name: 'Deals', href: '/deals', icon: Briefcase },
  { name: 'Clients', href: '/clients', icon: WalletCards },
];

export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();
  const router = useRouter();
  const [role, setRole] = useState(null);

  useEffect(() => {
    setRole(localStorage.getItem('role'));
  }, []);

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[80] lg:hidden"
          />
        )}
      </AnimatePresence>

      <div className={`w-64 bg-white h-screen border-r border-slate-200 flex flex-col fixed left-0 top-0 z-[90] transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
      <div className="p-8">
        <h1 className="text-2xl font-black text-primary tracking-tighter">EstateFlow</h1>
      </div>
      <nav className="flex-1 px-4 space-y-1 mt-4">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link 
              key={item.name} 
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition duration-200 ${
                isActive ? 'bg-primary/10 text-primary' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} />
              {item.name}
            </Link>
          );
        })}

        {(role === 'ADMIN' || role === 'MANAGER') && (
          <div className="pt-4 mt-4 border-t border-slate-50">
            <p className="px-4 mb-2 text-[10px] font-black uppercase text-slate-400 tracking-widest">Admin Control</p>
            <Link 
              href="/admin-portal"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition duration-200 ${
                pathname.startsWith('/admin-portal') ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/20' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <ShieldCheck size={18} strokeWidth={pathname.startsWith('/admin-portal') ? 2.5 : 2} />
              Secure Portal
            </Link>
          </div>
        )}
      </nav>
      <div className="p-4 border-t">
        <button 
          onClick={() => { 
            localStorage.clear();
            router.replace('/login'); 
          }}
          className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg flex items-center gap-2"
        >
          Logout
        </button>
      </div>
      </div>
    </>
  );
}
