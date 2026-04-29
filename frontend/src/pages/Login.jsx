import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Briefcase, ArrowRight, Loader2 } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const success = await login(formData.email, formData.password);
      if (success) {
        navigate('/');
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } catch (err) {
      setError('Connection failed. Please check your network.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] flex flex-col items-center justify-center p-6 selection:bg-blue-500/30">
      <div className="w-full max-w-[400px] animate-in fade-in slide-in-from-bottom-4 duration-1000">
        
        {/* Minimal Brand Header */}
        <div className="flex flex-col items-center mb-12 text-center">
          <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-2xl shadow-blue-600/20">
            <Briefcase size={28} strokeWidth={2} />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Welcome Back</h1>
          <p className="text-slate-500 text-sm font-medium">Enter your credentials to access the terminal</p>
        </div>

        <div className="bg-[#111827]/50 border border-white/5 p-8 rounded-[32px] shadow-2xl shadow-black/50 backdrop-blur-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Email</label>
              <input
                type="email"
                required
                className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white text-sm focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-slate-700"
                placeholder="name@company.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Password</label>
              <input
                type="password"
                required
                className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white text-sm focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-slate-700"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            {error && (
              <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black font-bold py-4 rounded-2xl hover:bg-slate-200 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              {loading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest text-center">Demo Access Keys</p>
            <div className="grid grid-cols-1 gap-2">
              <CredentialBadge role="Admin" email="admin@crm.com" />
              <CredentialBadge role="Manager" email="manager@crm.com" />
              <CredentialBadge role="Staff" email="staff1@crm.com" />
            </div>
            <p className="text-[10px] text-slate-700 text-center">Password for all: <span className="text-slate-500 font-mono">password123</span></p>
          </div>
        </div>

        <p className="mt-10 text-center text-xs text-slate-600 font-medium">
          Authorized access only. All activity is logged for security audits.
        </p>
      </div>
    </div>
  );
};

const CredentialBadge = ({ role, email }) => (
  <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors group cursor-pointer" 
       onClick={() => navigator.clipboard.writeText(email)}>
    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">{role}</span>
    <span className="text-[11px] text-slate-400 group-hover:text-blue-400 transition-colors">{email}</span>
  </div>
);

export default Login;
