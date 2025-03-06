import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const FloatingCTA = () => {
  const { isAuthenticated } = useAuthStore();
  
  // Don't show the floating CTA if the user is already authenticated
  if (isAuthenticated) {
    return null;
  }
  
  return (
    <div className="fixed bottom-8 right-8 z-50">
      <Link 
        to="/register" 
        className="group bg-gradient-to-r from-orange-500 to-amber-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-orange-600 hover:to-amber-600 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-orange-500/25 flex items-center backdrop-blur-lg"
      >
        Register Your Property
        <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform duration-300" size={20} />
      </Link>
    </div>
  );
};

export default FloatingCTA;
