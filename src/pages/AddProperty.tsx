import React, { useState } from 'react';
import { Plus, FileText } from 'lucide-react';
import Card from '../components/ui/Card';
import PropertyForm from '../components/PropertyForm';
import SocialHousingTerms from '../components/SocialHousingTerms';
import Button from '../components/ui/Button';

const AddProperty = () => {
  const [showTerms, setShowTerms] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  
  const handleAcceptTerms = () => {
    setTermsAccepted(true);
    setShowTerms(false);
  };
  
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Add New Property</h1>
        <p className="text-slate-400">Register your property for renovation and tenant matching</p>
      </div>
      
      {/* Social Housing Terms Banner */}
      {!termsAccepted && (
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mb-6 flex items-start">
          <FileText className="text-blue-500 mr-3 mt-1 flex-shrink-0" size={20} />
          <div className="flex-1">
            <h3 className="text-white font-medium mb-1">Social Housing Commitment Required</h3>
            <p className="text-slate-300 text-sm mb-3">
              By registering your property with RenoLoop, you agree to rent it as social housing for a fixed period after renovation. 
              Please review the terms before proceeding.
            </p>
            <Button 
              variant="secondary" 
              onClick={() => setShowTerms(true)}
              className="text-sm py-1.5"
            >
              Review Terms
            </Button>
          </div>
        </div>
      )}
      
      {/* Terms Modal */}
      {showTerms && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <SocialHousingTerms 
              onAccept={handleAcceptTerms}
              onCancel={() => setShowTerms(false)}
            />
          </div>
        </div>
      )}
      
      {/* Property Form */}
      <Card>
        <div className="flex items-center mb-6">
          <div className="bg-orange-500/20 p-2 rounded-full mr-4">
            <Plus size={24} className="text-orange-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Property Details</h2>
            <p className="text-slate-400">Provide information about your property</p>
          </div>
        </div>
        
        {termsAccepted ? (
          <PropertyForm />
        ) : (
          <div className="text-center py-8">
            <FileText size={48} className="mx-auto mb-4 text-slate-500" />
            <h3 className="text-xl font-bold text-white mb-2">Terms Acceptance Required</h3>
            <p className="text-slate-400 mb-6 max-w-md mx-auto">
              Please review and accept the social housing commitment terms before adding your property.
            </p>
            <Button 
              variant="primary" 
              onClick={() => setShowTerms(true)}
            >
              Review Terms
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default AddProperty;
