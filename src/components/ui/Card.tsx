import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
}

const Card: React.FC<CardProps> = ({ 
  children, 
  title, 
  subtitle,
  className = '' 
}) => {
  return (
    <div className={`bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 shadow-xl ${className}`}>
      {title && (
        <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
      )}
      {subtitle && (
        <p className="text-slate-400 mb-6">{subtitle}</p>
      )}
      {children}
    </div>
  );
};

export default Card;
