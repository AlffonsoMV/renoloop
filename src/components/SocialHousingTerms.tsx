import React, { useState } from 'react';
import { Calendar, Home, Users, AlertCircle, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import Button from './ui/Button';

interface SocialHousingTermsProps {
  onAccept?: () => void;
  onCancel?: () => void;
  showButtons?: boolean;
}

const SocialHousingTerms: React.FC<SocialHousingTermsProps> = ({ 
  onAccept, 
  onCancel,
  showButtons = true
}) => {
  const [expandedSection, setExpandedSection] = useState<string | null>('overview');
  
  const toggleSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };
  
  return (
    <div className="bg-slate-800/50 rounded-xl border border-white/10 p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Social Housing Commitment Terms</h2>
        <p className="text-slate-300">
          By participating in the RenoLoop program, you agree to the following terms regarding the social housing commitment for your renovated property.
        </p>
      </div>
      
      <div className="space-y-4 mb-8">
        {/* Overview Section */}
        <div className="border border-white/10 rounded-lg overflow-hidden">
          <button 
            className="w-full flex items-center justify-between bg-white/5 p-4 text-left"
            onClick={() => toggleSection('overview')}
          >
            <div className="flex items-center">
              <Home className="text-orange-500 mr-3" size={20} />
              <span className="font-medium text-white">Program Overview</span>
            </div>
            {expandedSection === 'overview' ? (
              <ChevronUp size={20} className="text-slate-400" />
            ) : (
              <ChevronDown size={20} className="text-slate-400" />
            )}
          </button>
          
          {expandedSection === 'overview' && (
            <div className="p-4 bg-slate-700/20">
              <p className="text-slate-300 mb-3">
                RenoLoop is a state-funded program that renovates properties in Marseille that don't meet minimum environmental standards. The program provides full renovation funding with no cost to property owners.
              </p>
              <p className="text-slate-300 mb-3">
                In exchange for this renovation, property owners commit to renting their property as social housing for a fixed period. This helps address both environmental concerns and housing shortages in the region.
              </p>
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 text-slate-300 text-sm">
                <div className="flex items-start">
                  <AlertCircle className="text-blue-500 mr-2 mt-0.5 flex-shrink-0" size={16} />
                  <p>
                    Your property remains yours throughout and after the program. RenoLoop only manages the renovation and tenant placement during the commitment period.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Commitment Period Section */}
        <div className="border border-white/10 rounded-lg overflow-hidden">
          <button 
            className="w-full flex items-center justify-between bg-white/5 p-4 text-left"
            onClick={() => toggleSection('period')}
          >
            <div className="flex items-center">
              <Calendar className="text-orange-500 mr-3" size={20} />
              <span className="font-medium text-white">Commitment Period</span>
            </div>
            {expandedSection === 'period' ? (
              <ChevronUp size={20} className="text-slate-400" />
            ) : (
              <ChevronDown size={20} className="text-slate-400" />
            )}
          </button>
          
          {expandedSection === 'period' && (
            <div className="p-4 bg-slate-700/20">
              <p className="text-slate-300 mb-3">
                The standard commitment period is 9 years from the completion of renovations. During this time, your property must be rented as social housing through the RenoLoop program.
              </p>
              <p className="text-slate-300 mb-3">
                The commitment period may be adjusted based on:
              </p>
              <ul className="list-disc pl-5 text-slate-300 space-y-2 mb-3">
                <li>The extent and cost of renovations required</li>
                <li>The property's location and size</li>
                <li>Current housing needs in the area</li>
              </ul>
              <p className="text-slate-300">
                After the commitment period ends, you regain full control over your property with no further obligations to the program.
              </p>
            </div>
          )}
        </div>
        
        {/* Tenant Selection Section */}
        <div className="border border-white/10 rounded-lg overflow-hidden">
          <button 
            className="w-full flex items-center justify-between bg-white/5 p-4 text-left"
            onClick={() => toggleSection('tenants')}
          >
            <div className="flex items-center">
              <Users className="text-orange-500 mr-3" size={20} />
              <span className="font-medium text-white">Tenant Selection & Rent</span>
            </div>
            {expandedSection === 'tenants' ? (
              <ChevronUp size={20} className="text-slate-400" />
            ) : (
              <ChevronDown size={20} className="text-slate-400" />
            )}
          </button>
          
          {expandedSection === 'tenants' && (
            <div className="p-4 bg-slate-700/20">
              <p className="text-slate-300 mb-3">
                Tenants will be selected from qualified applicants in the RenoLoop system. While you won't have direct control over tenant selection, all tenants are thoroughly vetted.
              </p>
              <p className="text-slate-300 mb-3">
                Rent will be set according to social housing guidelines, which consider:
              </p>
              <ul className="list-disc pl-5 text-slate-300 space-y-2 mb-3">
                <li>Property location, size, and features</li>
                <li>Current market rates for similar social housing</li>
                <li>Regional housing affordability targets</li>
              </ul>
              <p className="text-slate-300 mb-3">
                You'll receive 100% of the rental income, minus a small management fee (typically 8-10%) if you opt for RenoLoop to handle property management.
              </p>
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 text-slate-300 text-sm">
                <div className="flex items-start">
                  <HelpCircle className="text-green-500 mr-2 mt-0.5 flex-shrink-0" size={16} />
                  <p>
                    While rent for social housing is typically below market rate, the program's benefits often outweigh this difference through renovation value, guaranteed occupancy, and tax incentives.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Early Termination Section */}
        <div className="border border-white/10 rounded-lg overflow-hidden">
          <button 
            className="w-full flex items-center justify-between bg-white/5 p-4 text-left"
            onClick={() => toggleSection('termination')}
          >
            <div className="flex items-center">
              <AlertCircle className="text-orange-500 mr-3" size={20} />
              <span className="font-medium text-white">Early Termination</span>
            </div>
            {expandedSection === 'termination' ? (
              <ChevronUp size={20} className="text-slate-400" />
            ) : (
              <ChevronDown size={20} className="text-slate-400" />
            )}
          </button>
          
          {expandedSection === 'termination' && (
            <div className="p-4 bg-slate-700/20">
              <p className="text-slate-300 mb-3">
                If you wish to exit the program before the commitment period ends, you have two options:
              </p>
              <ol className="list-decimal pl-5 text-slate-300 space-y-3 mb-3">
                <li>
                  <span className="font-medium text-white">Repayment Option:</span> You can repay a prorated portion of the renovation costs based on the remaining commitment period.
                </li>
                <li>
                  <span className="font-medium text-white">Transfer Option:</span> You can sell the property to another owner who agrees to continue the social housing commitment for the remaining period.
                </li>
              </ol>
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-slate-300 text-sm">
                <div className="flex items-start">
                  <AlertCircle className="text-red-500 mr-2 mt-0.5 flex-shrink-0" size={16} />
                  <p>
                    Early termination without following one of these options may result in legal action to recover the full renovation costs plus penalties.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {showButtons && (
        <div className="flex space-x-4">
          <Button
            variant="outline"
            onClick={onCancel}
            fullWidth
          >
            Cancel
          </Button>
          
          <Button
            variant="primary"
            onClick={onAccept}
            fullWidth
          >
            I Accept These Terms
          </Button>
        </div>
      )}
    </div>
  );
};

export default SocialHousingTerms;
