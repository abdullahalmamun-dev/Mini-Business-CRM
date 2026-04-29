import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, ClipboardList, 
  BarChart3, Settings, LogOut, ChevronLeft,
  Briefcase
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Users, label: 'Customers', path: '/customers' },
    { icon: ClipboardList, label: 'Tasks', path: '/tasks' },
    { icon: BarChart3, label: 'Reports', path: '/reports' },
    { icon: Settings, label: 'Preferences', path: '/settings' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden transition-opacity duration-300"
          onClick={toggleSidebar}
        />
      )}

      <aside className={`
        fixed top-0 left-0 bottom-0 z-40
        w-64 bg-[#030712] border-r border-white/5
        transform transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full flex flex-col p-6">
          {/* Logo Area */}
          <div className="flex items-center gap-3 mb-12 px-2">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white">
              <Briefcase size={18} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight leading-none">MiniCRM</h1>
              <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Enterprise</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `
                  flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200
                  ${isActive 
                    ? 'bg-white/5 text-white shadow-sm shadow-black/20' 
                    : 'text-slate-500 hover:text-slate-300 hover:bg-white/[0.02]'}
                `}
              >
                {({ isActive }) => (
                  <>
                    <item.icon size={18} strokeWidth={isActive ? 2 : 1.5} />
                    {item.label}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* User Section & Logout */}
          <div className="mt-auto pt-6 border-t border-white/5">
            <div className="px-4 py-3 mb-4 rounded-xl bg-white/[0.02] border border-white/5">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-tighter mb-1">Signed in as</p>
              <p className="text-sm font-semibold text-white truncate">{user?.name || 'User'}</p>
            </div>
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-500 hover:text-red-400 hover:bg-red-400/5 rounded-lg transition-all duration-200"
            >
              <LogOut size={18} strokeWidth={1.5} />
              Sign Out
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
