import React from 'react';
import { Building } from 'lucide-react';
import logo from '../assets/images/logo.png';

const Navbar = () => {
  return (
    <nav className="fixed w-full z-50">
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-xl border-b border-white/10" />
      <div className="max-w-7xl mx-auto px-4 relative">
        <div className="flex items-center justify-between h-24">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl">
              <img src={logo} alt="Logo" width="30" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">
              RenoLoop
            </span>
          </div>

          <div className="hidden md:flex space-x-12">
            <a
              href="#about"
              className="text-slate-400 hover:text-white transition-colors"
            >
              About
            </a>
            <a
              href="#process"
              className="text-slate-400 hover:text-white transition-colors"
            >
              Process
            </a>
            <a
              href="#impact"
              className="text-slate-400 hover:text-white transition-colors"
            >
              Impact
            </a>
            <a
              href="#contact"
              className="text-slate-400 hover:text-white transition-colors"
            >
              Contact
            </a>
          </div>

          <button className="bg-white/10 backdrop-blur-lg text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/20 transition-all duration-300 transform hover:scale-105 border border-white/10">
            Start Registration
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
