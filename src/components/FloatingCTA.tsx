import React from 'react';
import { ArrowRight } from 'lucide-react';

const FloatingCTA = () => {
  return (
    <div className="fixed bottom-8 right-8 z-50">
      <button className="group bg-gradient-to-r from-orange-500 to-amber-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-orange-600 hover:to-amber-600 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-orange-500/25 flex items-center backdrop-blur-lg">
        Register Your Property
        <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform duration-300" size={20} />
      </button>
    </div>
  );
};

export default FloatingCTA;