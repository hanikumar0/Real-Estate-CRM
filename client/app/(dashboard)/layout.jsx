import Sidebar from '@/components/Sidebar';

export default function DashboardLayout({ children }) {
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
