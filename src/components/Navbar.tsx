import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/images/logo.png';
import { useAuthStore } from '../store/authStore';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  // Use individual selectors to prevent unnecessary re-renders
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const user = useAuthStore(state => state.user);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  // Track scroll position to change navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Close mobile menu when changing routes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);
  
  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? "py-2" : "py-4"
      }`}
    >
      <div
        className={`absolute inset-0 transition-all duration-300 ${
          isScrolled
            ? "bg-slate-900/95 backdrop-blur-xl shadow-lg"
            : "bg-slate-900/80 backdrop-blur-lg"
        } border-b border-white/10`}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-3">
              <div className="rounded-xl">
                <img src={logo} alt="Logo" width="50" />
              </div>
              <span
                className="text-2xl font-bold text-white tracking-tight"
                style={{ fontFamily: "TAN Headline" }}
              >
                RENOLOOP
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#about"
              className={`relative font-medium transition-colors duration-300 ${
                location.hash === "#about"
                  ? "text-white after:w-full"
                  : "text-slate-400 hover:text-white after:w-0 hover:after:w-full"
              } after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-orange-500 after:transition-all after:duration-300`}
            >
              About
            </a>
            <a
              href="#process"
              className={`relative font-medium transition-colors duration-300 ${
                location.hash === "#process"
                  ? "text-white after:w-full"
                  : "text-slate-400 hover:text-white after:w-0 hover:after:w-full"
              } after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-orange-500 after:transition-all after:duration-300`}
            >
              Process
            </a>
            <a
              href="#impact"
              className={`relative font-medium transition-colors duration-300 ${
                location.hash === "#impact"
                  ? "text-white after:w-full"
                  : "text-slate-400 hover:text-white after:w-0 hover:after:w-full"
              } after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-orange-500 after:transition-all after:duration-300`}
            >
              Impact
            </a>
            <a
              href="#contact"
              className={`relative font-medium transition-colors duration-300 ${
                location.hash === "#contact"
                  ? "text-white after:w-full"
                  : "text-slate-400 hover:text-white after:w-0 hover:after:w-full"
              } after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-orange-500 after:transition-all after:duration-300`}
            >
              Contact
            </a>
          </div>

          <div className="flex items-center">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                {user && (
                  <div className="hidden md:flex items-center mr-2">
                    <div className="bg-orange-500 h-8 w-8 rounded-full flex items-center justify-center text-white font-medium">
                      {user.name.charAt(0)}
                    </div>
                    <span className="ml-2 text-white hidden lg:inline">
                      {user.name}
                    </span>
                  </div>
                )}
                <Link
                  to="/dashboard"
                  className="relative overflow-hidden group bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-orange-500/25 border border-transparent"
                >
                  <span className="relative z-10">Dashboard</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-amber-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="relative text-white font-medium transition-colors duration-300 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-orange-500 hover:after:w-full after:transition-all after:duration-300"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="relative overflow-hidden group bg-white/10 backdrop-blur-lg text-white px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 border border-white/10"
                >
                  <span className="relative z-10">Create Account</span>
                  <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="md:hidden ml-4">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              >
                {mobileMenuOpen ? (
                  <X size={24} className="text-white" />
                ) : (
                  <Menu size={24} className="text-white" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-slate-900/95 backdrop-blur-xl border-b border-white/10 py-4 px-4 shadow-lg">
          <div className="flex flex-col space-y-4">
            <a
              href="#about"
              className={`py-2 px-3 rounded-lg transition-colors ${
                location.hash === "#about"
                  ? "bg-orange-500/20 text-white"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              About
            </a>
            <a
              href="#process"
              className={`py-2 px-3 rounded-lg transition-colors ${
                location.hash === "#process"
                  ? "bg-orange-500/20 text-white"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              Process
            </a>
            <a
              href="#impact"
              className={`py-2 px-3 rounded-lg transition-colors ${
                location.hash === "#impact"
                  ? "bg-orange-500/20 text-white"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              Impact
            </a>
            <a
              href="#contact"
              className={`py-2 px-3 rounded-lg transition-colors ${
                location.hash === "#contact"
                  ? "bg-orange-500/20 text-white"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              Contact
            </a>

            {isAuthenticated && (
              <div className="pt-2 border-t border-white/10">
                <div className="flex items-center space-x-3 py-2">
                  <div className="bg-orange-500 h-8 w-8 rounded-full flex items-center justify-center text-white font-medium">
                    {user?.name.charAt(0)}
                  </div>
                  <span className="text-white">{user?.name}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
