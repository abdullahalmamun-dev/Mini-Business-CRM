import React from 'react';
import { Bell, UserCircle, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';

const Navbar = ({ toggleSidebar }) => {
  const { user } = useAuth();
  const { notifications, unreadCount, clearUnread } = useNotifications();
  const [showDropdown, setShowDropdown] = React.useState(false);

  return (
    <header className="bg-[#1e293b]/80 backdrop-blur-md border-b border-white/10 h-16 flex items-center justify-between px-6 sticky top-0 z-20">
      <div className="flex items-center gap-4">
        <button onClick={toggleSidebar} className="lg:hidden text-gray-400 hover:text-white transition">
          <Menu size={24} />
        </button>
        <h2 className="text-xl font-semibold text-white tracking-tight hidden sm:block">Dashboard</h2>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="relative">
          <button 
            onClick={() => {
              setShowDropdown(!showDropdown);
              if (unreadCount > 0) clearUnread();
            }}
            className="text-gray-400 hover:text-white transition relative p-2"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-blue-500 text-[10px] text-white flex items-center justify-center rounded-full animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {showDropdown && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowDropdown(false)}></div>
              <div className="absolute right-0 mt-2 w-72 glass-panel border border-white/10 p-2 z-20 animate-fade-in shadow-2xl">
                <div className="px-3 py-2 border-b border-white/5 mb-2">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Recent Alerts</p>
                </div>
                <div className="space-y-1 max-h-60 overflow-y-auto">
                  {notifications.length > 0 ? notifications.map((n, i) => (
                    <div key={i} className="p-3 rounded-lg bg-white/[0.02] border border-white/5 hover:bg-white/5 transition-all">
                      <p className="text-xs text-white leading-relaxed">{n.message}</p>
                      <p className="text-[10px] text-slate-500 mt-1">{new Date(n.timestamp).toLocaleTimeString()}</p>
                    </div>
                  )) : (
                    <p className="text-xs text-slate-500 text-center py-4 italic">No new notifications</p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex items-center gap-3 cursor-pointer group pl-4 border-l border-white/10">
          <div className="hidden md:block text-right">
            <p className="text-sm font-medium text-white">{user?.name || 'Guest User'}</p>
            <p className="text-xs text-blue-400">{user?.role || 'User'}</p>
          </div>
          <UserCircle size={32} className="text-gray-400 group-hover:text-blue-400 transition" />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
