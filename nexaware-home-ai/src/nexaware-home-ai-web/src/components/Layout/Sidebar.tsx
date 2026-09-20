import { Link, useLocation } from 'react-router-dom';
import { Home, MessageSquare, FileText, PackageSearch, Settings, Bot, BookOpen, HelpCircle, X } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...classes: (string | undefined | null | false)[]) {
  return twMerge(clsx(classes));
}

interface SidebarProps {
  onClose?: () => void;
}

export function Sidebar({ onClose }: SidebarProps = {}) {
  const location = useLocation();

  const links = [
    { to: '/', icon: Home, label: 'Dashboard' },
    { to: '/chat', icon: MessageSquare, label: 'Chat Assistant' },
    { to: '/documents', icon: FileText, label: 'Documents' },
    { to: '/manuals', icon: BookOpen, label: 'Service Manuals' },
    { to: '/items', icon: PackageSearch, label: 'Household Items' },
    { to: '/help', icon: HelpCircle, label: 'How to Use' },
  ];

  return (
    <div className="w-64 h-full bg-surface/95 backdrop-blur-xl md:glass-panel md:rounded-none border-y-0 border-l-0 flex flex-col z-10">
      <div className="p-6 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="bg-primary/20 p-2 rounded-xl text-primary">
            <Bot size={28} />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-indigo-300 bg-clip-text text-transparent">NexAware</h1>
            <p className="text-xs text-text-muted font-medium tracking-wider uppercase">Home AI</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="md:hidden p-2 text-text-muted hover:text-text rounded-xl hover:bg-surfaceHighlight">
            <X size={20} />
          </button>
        )}
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.to || (link.to !== '/' && location.pathname.startsWith(link.to));

          return (
            <Link
              key={link.to}
              to={link.to}
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium',
                isActive
                  ? 'bg-primary/10 text-primary shadow-sm shadow-primary/5'
                  : 'text-text-muted hover:bg-surfaceHighlight hover:text-text'
              )}
            >
              <Icon size={20} className={cn('transition-transform duration-300', isActive && 'scale-110')} />
              <span className="truncate">{link.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto">
        <Link
          to="/settings"
          onClick={onClose}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-text-muted hover:bg-surfaceHighlight hover:text-text transition-colors font-medium"
        >
          <Settings size={20} />
          Settings
        </Link>
      </div>
    </div>
  );
}
