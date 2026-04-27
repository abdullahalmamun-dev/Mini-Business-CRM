import React from 'react';

export const Spinner = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-[3px]',
    lg: 'w-12 h-12 border-4'
  };

  return (
    <div className={`border-blue-500/20 border-t-blue-500 rounded-full animate-spin ${sizes[size]} ${className}`}></div>
  );
};

export const Skeleton = ({ className = '', circle = false }) => (
  <div className={`bg-slate-800 animate-pulse ${circle ? 'rounded-full' : 'rounded'} ${className}`}></div>
);

export const LoadingOverlay = ({ message = 'Loading...' }) => (
  <div className="fixed inset-0 z-[100] bg-slate-950/40 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
    <Spinner size="lg" />
    <p className="text-slate-300 font-medium animate-pulse tracking-wide">{message}</p>
  </div>
);
