import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiDollarSign, FiBarChart2, FiSettings } from 'react-icons/fi';

const navItems = [
  { to: '/', label: 'لوحة التحكم', icon: FiHome },
  { to: '/expenses', label: 'المصاريف', icon: FiDollarSign },
  { to: '/reports', label: 'التقارير', icon: FiBarChart2 },
  { to: '/settings', label: 'الإعدادات', icon: FiSettings },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <aside
        className={`
          fixed top-14 right-0 z-30 h-[calc(100vh-3.5rem)] w-56 bg-card border-l border-border
          transform transition-transform duration-200 lg:static lg:translate-x-0 lg:border-l-0
          ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
        `}
      >
        <nav className="p-4 flex flex-col gap-1">
          {navItems.map(({ to, label, icon: Icon }) => {
            const isActive = location.pathname === to || (to !== '/' && location.pathname.startsWith(to));
            return (
              <Link
                key={to}
                to={to}
                onClick={onClose}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                  ${isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}
                `}
              >
                <Icon className="w-5 h-5" />
                {label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
