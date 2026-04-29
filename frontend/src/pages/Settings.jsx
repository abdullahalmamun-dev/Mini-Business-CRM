import React, { useState } from 'react';
import { 
  User, Bell, Shield, Palette, Save, 
  Mail, Phone, Building, Globe, Moon, Sun,
  Check, Lock, Eye, EyeOff
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/axios';

const Settings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwords, setPasswords] = useState({ current: '', new: '' });
  const [profileName, setProfileName] = useState(user?.name || '');
  const [notifications, setNotifications] = useState({
    email: true,
    browser: true,
    tasks: false
  });

  const handleSave = async () => {
    setLoading(true);
    setSuccess(false);
    try {
      if (activeTab === 'profile') {
        await api.put('/users/profile', { name: profileName });
      } else if (activeTab === 'security') {
        if (!passwords.current || !passwords.new) {
          alert('Please fill in both password fields');
          return;
        }
        await api.put('/users/password', { 
          currentPassword: passwords.current, 
          newPassword: passwords.new 
        });
        setPasswords({ current: '', new: '' });
      }
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="glass-panel p-6">
              <h3 className="text-lg font-semibold text-white mb-6">Profile Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputGroup 
                  label="Full Name" 
                  icon={<User size={16} />} 
                  value={profileName} 
                  onChange={(e) => setProfileName(e.target.value)} 
                />
                <InputGroup label="Email Address" icon={<Mail size={16} />} value={user?.email} disabled />
                <InputGroup label="Organization" icon={<Building size={16} />} placeholder="Acme Corp" />
                <InputGroup label="Language" icon={<Globe size={16} />} type="select" options={['English (US)', 'Spanish', 'French']} />
              </div>
            </div>
          </div>
        );
      case 'notifications':
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="glass-panel p-6">
              <h3 className="text-lg font-semibold text-white mb-6">Notification Preferences</h3>
              <div className="space-y-4">
                <ToggleItem 
                  title="Email Notifications" 
                  description="Receive activity updates and reports via email." 
                  enabled={notifications.email}
                  onChange={() => setNotifications({...notifications, email: !notifications.email})}
                />
                <ToggleItem 
                  title="Browser Notifications" 
                  description="Show desktop alerts for urgent tasks." 
                  enabled={notifications.browser}
                  onChange={() => setNotifications({...notifications, browser: !notifications.browser})}
                />
                <ToggleItem 
                  title="Task Reminders" 
                  description="Daily summary of tasks due today." 
                  enabled={notifications.tasks}
                  onChange={() => setNotifications({...notifications, tasks: !notifications.tasks})}
                />
              </div>
            </div>
          </div>
        );
      case 'security':
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="glass-panel p-6">
              <h3 className="text-lg font-semibold text-white mb-6">Security Settings</h3>
              <div className="space-y-6 max-w-md">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Current Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                    <input 
                      type={showPassword ? 'text' : 'password'} 
                      value={passwords.current}
                      onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                      className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:ring-2 focus:ring-blue-500/50 outline-none" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                    <input 
                      type={showPassword ? 'text' : 'password'} 
                      value={passwords.new}
                      onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                      className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:ring-2 focus:ring-blue-500/50 outline-none" 
                    />
                  </div>
                </div>
                <button 
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-2"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  {showPassword ? 'Hide Passwords' : 'Show Passwords'}
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Preferences</h1>
        <p className="text-slate-400 text-sm">Manage your profile and application settings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-2 lg:col-span-1">
          <SettingsTab 
            icon={<User size={18} />} 
            label="Profile Information" 
            active={activeTab === 'profile'} 
            onClick={() => setActiveTab('profile')}
          />
          <SettingsTab 
            icon={<Bell size={18} />} 
            label="Notifications" 
            active={activeTab === 'notifications'} 
            onClick={() => setActiveTab('notifications')}
          />
          <SettingsTab 
            icon={<Shield size={18} />} 
            label="Security & Password" 
            active={activeTab === 'security'} 
            onClick={() => setActiveTab('security')}
          />

        </div>

        <div className="lg:col-span-2 space-y-6">
          {renderContent()}

          <div className="flex items-center justify-end gap-4">
            {success && (
              <div className="flex items-center gap-2 text-emerald-400 text-sm animate-fade-in">
                <Check size={16} />
                <span>Settings saved successfully!</span>
              </div>
            )}
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

const InputGroup = ({ label, icon, type = 'text', options, defaultValue, disabled, placeholder }) => (
  <div className="space-y-2">
    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</label>
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">{icon}</div>
      {type === 'select' ? (
        <select className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:ring-2 focus:ring-blue-500/50 outline-none appearance-none">
          {options.map(opt => <option key={opt}>{opt}</option>)}
        </select>
      ) : (
        <input 
          type={type}
          defaultValue={defaultValue}
          disabled={disabled}
          placeholder={placeholder}
          className={`w-full bg-slate-900/50 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:ring-2 focus:ring-blue-500/50 outline-none ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
        />
      )}
    </div>
  </div>
);

const ToggleItem = ({ title, description, enabled, onChange }) => (
  <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5">
    <div>
      <p className="text-sm font-medium text-white">{title}</p>
      <p className="text-xs text-slate-500">{description}</p>
    </div>
    <button 
      onClick={onChange}
      className={`w-10 h-5 rounded-full transition-all relative ${enabled ? 'bg-blue-500' : 'bg-slate-700'}`}
    >
      <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${enabled ? 'left-6' : 'left-1'}`}></div>
    </button>
  </div>
);

const SettingsTab = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
      active 
        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/20' 
        : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent'
    }`}
  >
    {icon}
    <span className="text-sm font-medium">{label}</span>
  </button>
);



export default Settings;
