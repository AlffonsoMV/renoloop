import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  fullWidth = true,
  className = '',
  ...props
}) => {
  const widthClass = fullWidth ? 'w-full' : '';
  const errorClass = error ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-orange-500';
  
  return (
    <div className={`mb-4 ${widthClass}`}>
      {label && (
        <label className="block text-white mb-2 font-medium">
          {label}
        </label>
      )}
      <input
        className={`bg-white/5 backdrop-blur-lg text-white px-4 py-3 rounded-xl border ${errorClass} outline-none focus:ring-2 focus:ring-orange-500/20 transition-all duration-300 ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-red-500 text-sm">{error}</p>
      )}
    </div>
  );
};

export default Input;
