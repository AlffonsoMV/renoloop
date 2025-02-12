import React from 'react';
import {
  Building2,
  Users,
  Handshake,
  ArrowRight,
  Building,
  Euro,
  Home,
  Shield,
} from 'lucide-react';
import Navbar from './components/Navbar';
import FloatingCTA from './components/FloatingCTA';

function App() {
  return (
    <div className="min-h-screen bg-slate-900">
      <Navbar />
      <FloatingCTA />

      {/* Hero Section with Problem Statement */}
      <div className="relative min-h-screen">
        {/* Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#080808_1px,transparent_1px),linear-gradient(to_bottom,#080808_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

        <div className="relative pt-24 pb-20">
          {/* Stats Bar */}
          <div className="max-w-7xl mx-auto px-4 my-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
                <div className="flex items-center space-x-4">
                  <div className="bg-red-500/10 p-3 rounded-xl">
                    <Building2 className="text-red-500" size={24} />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-white">40,000+</div>
                    <div className="text-red-500">Deteriorated Buildings</div>
                  </div>
                </div>
              </div>
              <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
                <div className="flex items-center space-x-4">
                  <div className="bg-amber-500/10 p-3 rounded-xl">
                    <Users className="text-amber-500" size={24} />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-white">15,000+</div>
                    <div className="text-amber-500">Families Waiting</div>
                  </div>
                </div>
              </div>
              <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
                <div className="flex items-center space-x-4">
                  <div className="bg-emerald-500/10 p-3 rounded-xl">
                    <Euro className="text-emerald-500" size={24} />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-white">€140M</div>
                    <div className="text-emerald-500">Available Funding</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div>
                <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
                  Transforming Marseille's
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">
                    {' '}
                    Abandoned Buildings
                  </span>
                  <br />
                  Into Homes
                </h1>
                <p className="text-slate-400 text-xl mb-12 leading-relaxed">
                  40,000+ deteriorating buildings in Marseille. 15,000+ families
                  seeking homes. RenoLoop connects property owners with
                  renovation funding and future tenants, transforming urban
                  challenges into housing solutions.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-orange-600 hover:to-amber-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-orange-500/25 text-lg">
                    I Own a Property
                  </button>
                  <button className="bg-white/10 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transition-all duration-300 transform hover:scale-105 backdrop-blur-lg border border-white/10 text-lg">
                    I Need Housing
                  </button>
                </div>
              </div>

              <div className="relative">
                <div className="aspect-square rounded-2xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-amber-500/20 mix-blend-overlay z-10" />
                  <img
                    src="https://images.unsplash.com/photo-1569437061241-a848be43cc82"
                    alt="Marseille architecture"
                    className="object-cover w-full h-full"
                  />
                </div>
                {/* Floating Stats */}
                <div className="absolute -right-8 -bottom-8 bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-2xl">
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-500/10 p-3 rounded-xl">
                      <Shield className="text-blue-500" size={24} />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">
                        €35,000
                      </div>
                      <div className="text-blue-500">
                        Avg. Renovation Support
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Solution Steps */}
        <div className="max-w-7xl mx-auto px-4 py-32">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group">
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-white/10 hover:border-orange-500/50 transition-all duration-500">
                <div className="bg-gradient-to-br from-orange-500 to-amber-500 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                  <Building2 className="text-white" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Register Your Property
                </h3>
                <p className="text-slate-400 mb-6">
                  Submit your deteriorated building for assessment. Our experts
                  evaluate renovation potential and funding eligibility.
                </p>
                <div className="flex items-center text-orange-500 group-hover:text-amber-500 transition-colors">
                  <span className="font-semibold">Learn More</span>
                  <ArrowRight
                    className="ml-2 group-hover:translate-x-2 transition-transform"
                    size={20}
                  />
                </div>
              </div>
            </div>

            <div className="group">
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-white/10 hover:border-orange-500/50 transition-all duration-500">
                <div className="bg-gradient-to-br from-orange-500 to-amber-500 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                  <Euro className="text-white" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Secure Funding
                </h3>
                <p className="text-slate-400 mb-6">
                  Access renovation grants and financial support. We handle
                  paperwork and connect you with verified contractors.
                </p>
                <div className="flex items-center text-orange-500 group-hover:text-amber-500 transition-colors">
                  <span className="font-semibold">Learn More</span>
                  <ArrowRight
                    className="ml-2 group-hover:translate-x-2 transition-transform"
                    size={20}
                  />
                </div>
              </div>
            </div>

            <div className="group">
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-white/10 hover:border-orange-500/50 transition-all duration-500">
                <div className="bg-gradient-to-br from-orange-500 to-amber-500 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                  <Home className="text-white" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Transform & Lease
                </h3>
                <p className="text-slate-400 mb-6">
                  We manage the renovation process and connect you with
                  pre-screened tenants, ensuring steady rental income.
                </p>
                <div className="flex items-center text-orange-500 group-hover:text-amber-500 transition-colors">
                  <span className="font-semibold">Learn More</span>
                  <ArrowRight
                    className="ml-2 group-hover:translate-x-2 transition-transform"
                    size={20}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
