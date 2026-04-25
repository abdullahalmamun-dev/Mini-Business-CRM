import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, CheckSquare, Activity, Settings, LogOut, BarChart3 } from 'lucide-react';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'Customers', icon: Users, path: '/customers' },
    { name: 'Tasks', icon: CheckSquare, path: '/tasks' },
    { name: 'Reports', icon: BarChart3, path: '/reports' },
  ];

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden" 
          onClick={toggleSidebar}
        ></div>
      )}

      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#0f172a] border-r border-white/10 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-16 flex items-center px-6 border-b border-white/10">
          <div className="flex items-center gap-2 text-blue-500">
            <Activity size={28} className="font-bold" />
            <span className="text-xl font-bold text-white tracking-wider">MiniCRM</span>
          </div>
        </div>

        <nav className="p-4 space-y-1 h-[calc(100vh-4rem)] flex flex-col justify-between">
          <div className="space-y-2">
            <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 mt-2">Main Menu</p>
            {menuItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) => 
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? 'bg-blue-500/15 text-blue-400 font-medium border border-blue-500/20' 
                      : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'
                  }`
                }
              >
                <item.icon size={20} />
                <span>{item.name}</span>
              </NavLink>
            ))}
          </div>

          <div className="space-y-2">
            <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Settings</p>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:bg-white/5 hover:text-white transition-all duration-200 border border-transparent">
              <Settings size={20} />
              <span>Preferences</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-all duration-200 mt-2 border border-transparent">
              <LogOut size={20} />
              <span>Sign Out</span>
            </button>
          </div>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
