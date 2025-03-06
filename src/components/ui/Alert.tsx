import React from 'react';
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';

interface AlertProps {
  type: 'error' | 'success' | 'info' | 'warning';
  message: string;
  className?: string;
}

const Alert: React.FC<AlertProps> = ({ type, message, className = '' }) => {
  const baseClasses = 'p-4 rounded-xl mb-4 flex items-start';
  
  const typeClasses = {
    error: 'bg-red-500/10 text-red-500 border border-red-500/20',
    success: 'bg-green-500/10 text-green-500 border border-green-500/20',
    info: 'bg-blue-500/10 text-blue-500 border border-blue-500/20',
    warning: 'bg-amber-500/10 text-amber-500 border border-amber-500/20',
  };
  
  const icons = {
    error: <XCircle className="h-5 w-5 mr-3 flex-shrink-0" />,
    success: <CheckCircle className="h-5 w-5 mr-3 flex-shrink-0" />,
    info: <Info className="h-5 w-5 mr-3 flex-shrink-0" />,
    warning: <AlertCircle className="h-5 w-5 mr-3 flex-shrink-0" />,
  };
  
  return (
    <div className={`${baseClasses} ${typeClasses[type]} ${className}`}>
      {icons[type]}
      <span>{message}</span>
    </div>
  );
};

export default Alert;
