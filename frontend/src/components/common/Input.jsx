import React from 'react';

const Input = ({ label, icon: Icon, error, className = '', ...props }) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && <label className="text-sm font-medium text-slate-300 ml-1 block">{label}</label>}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
            <Icon size={18} />
          </div>
        )}
        <input
          {...props}
          className={`w-full ${Icon ? 'pl-11' : 'px-4'} pr-4 py-3 rounded-xl bg-slate-900/50 border ${
            error ? 'border-red-500/50 focus:ring-red-500/20' : 'border-slate-700/50 focus:ring-blue-500/50'
          } text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all`}
        />
      </div>
      {error && <p className="text-xs text-red-400 ml-1 mt-1 font-medium">{error}</p>}
    </div>
  );
};

export default Input;
