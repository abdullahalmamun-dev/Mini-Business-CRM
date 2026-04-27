import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  isLoading = false, 
  disabled = false, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "w-full py-3 px-4 rounded-xl font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-500 focus:ring-4 focus:ring-blue-500/20 shadow-[0_0_20px_rgba(37,99,235,0.4)]",
    secondary: "bg-slate-700 hover:bg-slate-600 focus:ring-4 focus:ring-slate-500/20",
    danger: "bg-red-600 hover:bg-red-500 focus:ring-4 focus:ring-red-500/20 shadow-[0_0_20px_rgba(220,38,38,0.3)]",
    ghost: "bg-transparent hover:bg-white/5 border border-slate-700 text-slate-300 hover:text-white"
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Loading...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
