import React from 'react';
import { Bell, UserCircle, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';

const Navbar = ({ toggleSidebar }) => {
  const { user } = useAuth();
  const { notifications, unreadCount, clearUnread } = useNotifications();
  const [showDropdown, setShowDropdown] = React.useState(false);

  return (
    <header className="bg-[#030712]/80 backdrop-blur-xl border-b border-white/5 h-16 flex items-center justify-between px-8 sticky top-0 z-20">
      <div className="flex items-center gap-4">
        <button onClick={toggleSidebar} className="text-slate-400 hover:text-white transition">
          <Menu size={22} />
        </button>
        <div className="hidden sm:flex items-center gap-2">
          <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">Workspace /</span>
          <h2 className="text-sm font-semibold text-white tracking-tight">Overview</h2>
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="relative">
          <button 
            onClick={() => {
              setShowDropdown(!showDropdown);
              if (unreadCount > 0) clearUnread();
            }}
            className="text-slate-400 hover:text-white transition relative p-2"
          >
            <Bell size={18} strokeWidth={2} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full border-2 border-[#030712]"></span>
            )}
          </button>

          {showDropdown && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowDropdown(false)}></div>
              <div className="absolute right-0 mt-4 w-80 bg-[#111827] border border-white/10 p-4 rounded-2xl z-20 animate-in fade-in zoom-in-95 duration-200 shadow-2xl shadow-black">
                <div className="flex items-center justify-between mb-4 px-1">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Notifications</p>
                  <span className="text-[10px] text-blue-500 font-bold uppercase">Mark all read</span>
                </div>
                <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                  {notifications.length > 0 ? notifications.map((n, i) => (
                    <div key={i} className="p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/5 transition-all cursor-pointer">
                      <p className="text-xs text-slate-200 leading-normal">{n.message}</p>
                      <p className="text-[10px] text-slate-600 mt-2 font-medium">{new Date(n.timestamp).toLocaleTimeString()}</p>
                    </div>
                  )) : (
                    <div className="py-10 text-center">
                      <p className="text-xs text-slate-600 italic">All caught up</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex items-center gap-3 cursor-pointer group border-l border-white/5 pl-6">
          <div className="hidden md:block text-right">
            <p className="text-xs font-bold text-white tracking-tight leading-none mb-1">{user?.name || 'Guest'}</p>
            <p className="text-[10px] font-bold text-blue-500 uppercase tracking-tighter uppercase">{user?.role || 'Staff'}</p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 group-hover:border-blue-500/50 group-hover:text-blue-400 transition-all">
            <UserCircle size={20} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
