import React from 'react';
import { Bell, UserCircle, Menu } from 'lucide-react';

const Navbar = ({ toggleSidebar }) => {
  return (
    <header className="bg-[#1e293b]/80 backdrop-blur-md border-b border-white/10 h-16 flex items-center justify-between px-6 sticky top-0 z-20">
      <div className="flex items-center gap-4">
        <button onClick={toggleSidebar} className="lg:hidden text-gray-400 hover:text-white transition">
          <Menu size={24} />
        </button>
        <h2 className="text-xl font-semibold text-white tracking-tight hidden sm:block">Dashboard</h2>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="text-gray-400 hover:text-white transition relative">
          <Bell size={20} />
          <span className="absolute top-0 right-0 w-2 h-2 bg-blue-500 rounded-full"></span>
        </button>
        <div className="flex items-center gap-3 cursor-pointer group pl-4 border-l border-white/10">
          <div className="hidden md:block text-right">
            <p className="text-sm font-medium text-white">Admin User</p>
            <p className="text-xs text-blue-400">Admin</p>
          </div>
          <UserCircle size={32} className="text-gray-400 group-hover:text-blue-400 transition" />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
