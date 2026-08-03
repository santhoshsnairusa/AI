import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export function Layout() {
  return (
    <div className="flex h-screen bg-background overflow-hidden selection:bg-primary/30 selection:text-primary-hover">
      <Sidebar />
      <main className="flex-1 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-900/5 blur-[120px] rounded-full translate-y-1/4 -translate-x-1/4 pointer-events-none" />
        
        <div className="h-full overflow-y-auto relative z-10 p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
