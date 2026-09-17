import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Menu } from 'lucide-react';

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-[100dvh] bg-background overflow-hidden selection:bg-primary/30 selection:text-primary-hover w-full">

      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - responsive positioning */}
      <div className={`fixed inset-y-0 left-0 z-50 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-300 md:flex`}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      <main className="flex-1 flex flex-col min-w-0 h-[100dvh] overflow-hidden relative">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center p-4 border-b border-surfaceHighlight bg-surface/50 backdrop-blur-md z-30">
          <button onClick={() => setSidebarOpen(true)} className="p-2 text-text-muted hover:text-text rounded-xl hover:bg-surfaceHighlight transition-colors">
            <Menu size={24} />
          </button>
          <div className="ml-4 font-bold text-lg bg-gradient-to-r from-primary to-indigo-300 bg-clip-text text-transparent">Home AI</div>
        </div>

        <div className="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-primary/10 blur-[80px] md:blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] md:w-[500px] md:h-[500px] bg-indigo-900/5 blur-[100px] md:blur-[120px] rounded-full translate-y-1/4 -translate-x-1/4 pointer-events-none" />

        <div className="flex-1 overflow-y-auto relative z-10 p-4 sm:p-6 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
