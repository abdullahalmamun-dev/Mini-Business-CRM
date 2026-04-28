import React, { useState } from 'react';
import { 
  User, Bell, Shield, Palette, Save, 
  Mail, Phone, Building, Globe, Moon, Sun
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';

const Settings = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }, 1000);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Preferences</h1>
        <p className="text-slate-400 text-sm">Manage your profile and application settings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Navigation Sidebar */}
        <div className="space-y-2 lg:col-span-1">
          <SettingsTab icon={<User size={18} />} label="Profile Information" active />
          <SettingsTab icon={<Bell size={18} />} label="Notifications" />
          <SettingsTab icon={<Shield size={18} />} label="Security & Password" />
          <SettingsTab icon={<Palette size={18} />} label="Appearance" />
        </div>

        {/* Content Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-6">
            <h3 className="text-lg font-semibold text-white mb-6">Profile Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                  <input 
                    type="text" 
                    defaultValue={user?.name}
                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:ring-2 focus:ring-blue-500/50 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                  <input 
                    type="email" 
                    defaultValue={user?.email}
                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:ring-2 focus:ring-blue-500/50 outline-none opacity-60 cursor-not-allowed"
                    readOnly
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Organization</label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                  <input 
                    type="text" 
                    placeholder="Company Name"
                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:ring-2 focus:ring-blue-500/50 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Language</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                  <select className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:ring-2 focus:ring-blue-500/50 outline-none appearance-none">
                    <option>English (US)</option>
                    <option>Spanish</option>
                    <option>French</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6">
            <h3 className="text-lg font-semibold text-white mb-6">System Theme</h3>
            <div className="flex gap-4">
              <ThemeOption icon={<Sun size={20} />} label="Light" disabled />
              <ThemeOption icon={<Moon size={20} />} label="Dark" active />
            </div>
          </div>

          <div className="flex items-center justify-end gap-4">
            {success && <span className="text-emerald-400 text-sm animate-fade-in">Settings saved successfully!</span>}
            <Button className="w-auto px-8" onClick={handleSave} isLoading={loading}>
              <Save size={18} />
              <span>Save Changes</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SettingsTab = ({ icon, label, active }) => (
  <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
    active 
      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/20' 
      : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent'
  }`}>
    {icon}
    <span className="text-sm font-medium">{label}</span>
  </button>
);

const ThemeOption = ({ icon, label, active, disabled }) => (
  <div className={`flex-1 flex flex-col items-center gap-3 p-6 rounded-2xl border transition-all cursor-pointer ${
    active 
      ? 'bg-blue-500/10 border-blue-500/50 text-blue-400' 
      : 'bg-white/[0.02] border-white/5 text-slate-500 hover:border-white/10'
  } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
    {icon}
    <span className="text-sm font-semibold">{label}</span>
  </div>
);

export default Settings;
