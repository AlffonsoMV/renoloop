import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Info } from 'lucide-react';
import Button from './ui/Button';
import Input from './ui/Input';
import { propertyService, Property } from '../services/supabaseService';

interface PropertyFormProps {
  property?: Property;
  isEditing?: boolean;
  onSuccess?: () => void;
}

const PropertyForm: React.FC<PropertyFormProps> = ({ 
  property, 
  isEditing = false,
  onSuccess 
}) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const [description, setDescription] = useState('');
  const [buildingAge, setBuildingAge] = useState('');
  const [currentEPC, setCurrentEPC] = useState('');
  const [hasHeatingIssues, setHasHeatingIssues] = useState(false);
  const [hasInsulationIssues, setHasInsulationIssues] = useState(false);
  const [hasVentilationIssues, setHasVentilationIssues] = useState(false);
  const [showEnvInfo, setShowEnvInfo] = useState(false);
  
  // Initialize form with property data if editing
  useEffect(() => {
    if (property && isEditing) {
      setAddress(property.address || '');
      setCity(property.city || '');
      setPostalCode(property.postal_code || '');
      setCountry(property.country || '');
      setDescription(property.description || '');
      setBuildingAge(property.building_age || '');
      setCurrentEPC(property.current_epc || '');
      setHasHeatingIssues(property.has_heating_issues || false);
      setHasInsulationIssues(property.has_insulation_issues || false);
      setHasVentilationIssues(property.has_ventilation_issues || false);
    }
  }, [property, isEditing]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      if (isEditing && property) {
        // Update existing property
        const updatedProperty = await propertyService.updateProperty(property.id, {
          address,
          city,
          postal_code: postalCode,
          country,
          description,
          building_age: buildingAge,
          current_epc: currentEPC,
          has_heating_issues: hasHeatingIssues,
          has_insulation_issues: hasInsulationIssues,
          has_ventilation_issues: hasVentilationIssues
        });
        
        if (updatedProperty) {
          if (onSuccess) {
            onSuccess();
          } else {
            navigate('/dashboard/properties');
          }
        } else {
          throw new Error('Failed to update property');
        }
      } else {
        // Create new property
        const newProperty = await propertyService.createProperty({
          address,
          city,
          postal_code: postalCode,
          country,
          description,
          building_age: buildingAge,
          current_epc: currentEPC,
          has_heating_issues: hasHeatingIssues,
          has_insulation_issues: hasInsulationIssues,
          has_ventilation_issues: hasVentilationIssues,
          status: 'pending',
        });
        
        if (newProperty) {
          if (onSuccess) {
            onSuccess();
          } else {
            navigate('/dashboard/properties');
          }
        } else {
          throw new Error('Failed to create property');
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred. Please try again.';
      setError(errorMessage);
      console.error('Property form error:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-500/10 text-red-500 p-4 rounded-xl mb-6 flex items-center">
          <AlertCircle size={20} className="mr-2" />
          <span>{error}</span>
        </div>
      )}
      
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-slate-300 mb-2">
          Street Address *
        </label>
        <Input
          id="address"
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="123 Main St"
          required
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-slate-300 mb-2">
            City *
          </label>
          <Input
            id="city"
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="New York"
            required
          />
        </div>
        
        <div>
          <label htmlFor="postalCode" className="block text-sm font-medium text-slate-300 mb-2">
            Postal Code *
          </label>
          <Input
            id="postalCode"
            type="text"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            placeholder="10001"
            required
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="country" className="block text-sm font-medium text-slate-300 mb-2">
          Country *
        </label>
        <Input
          id="country"
          type="text"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          placeholder="United States"
          required
        />
      </div>
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-2">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your property (size, number of rooms, amenities, etc.)"
          className="w-full bg-white/5 backdrop-blur-lg text-white px-4 py-3 rounded-xl border border-white/10 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 min-h-[120px]"
        />
      </div>
      
      <div className="mt-8 mb-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-white">Environmental Assessment</h3>
          <button 
            type="button" 
            onClick={() => setShowEnvInfo(!showEnvInfo)}
            className="text-orange-500 hover:text-orange-400 flex items-center"
          >
            <Info size={16} className="mr-1" />
            <span className="text-sm">Why we need this</span>
          </button>
        </div>
        
        {showEnvInfo && (
          <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4 mt-2 mb-4 text-sm text-slate-300">
            <p>RenoLoop focuses on renovating properties that don't meet minimum environmental standards. This information helps us assess your property's eligibility for our renovation program and determine the scope of work needed.</p>
            <p className="mt-2">Properties with poor energy efficiency ratings (EPC) or specific issues like inadequate heating, insulation, or ventilation are prioritized for renovation funding.</p>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="buildingAge" className="block text-sm font-medium text-slate-300 mb-2">
            Building Age (Year Built) *
          </label>
          <Input
            id="buildingAge"
            type="text"
            value={buildingAge}
            onChange={(e) => setBuildingAge(e.target.value)}
            placeholder="e.g. 1975"
            required
          />
        </div>
        
        <div>
          <label htmlFor="currentEPC" className="block text-sm font-medium text-slate-300 mb-2">
            Current Energy Performance Certificate (EPC) *
          </label>
          <select
            id="currentEPC"
            value={currentEPC}
            onChange={(e) => setCurrentEPC(e.target.value)}
            className="w-full bg-white/5 backdrop-blur-lg text-white px-4 py-3 rounded-xl border border-white/10 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300"
            required
          >
            <option value="">Select EPC Rating</option>
            <option value="A">A (Very Efficient)</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
            <option value="E">E</option>
            <option value="F">F</option>
            <option value="G">G (Inefficient)</option>
            <option value="unknown">Unknown/Not Assessed</option>
          </select>
        </div>
      </div>
      
      <div className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 p-4 mb-6">
        <p className="text-sm font-medium text-slate-300 mb-3">Select all issues that apply to your property:</p>
        
        <div className="space-y-3">
          <div className="flex items-center">
            <input
              id="heatingIssues"
              type="checkbox"
              checked={hasHeatingIssues}
              onChange={(e) => setHasHeatingIssues(e.target.checked)}
              className="h-4 w-4 rounded border-white/20 text-orange-500 focus:ring-orange-500/20"
            />
            <label htmlFor="heatingIssues" className="ml-2 text-sm text-slate-300">
              Inadequate or inefficient heating system
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              id="insulationIssues"
              type="checkbox"
              checked={hasInsulationIssues}
              onChange={(e) => setHasInsulationIssues(e.target.checked)}
              className="h-4 w-4 rounded border-white/20 text-orange-500 focus:ring-orange-500/20"
            />
            <label htmlFor="insulationIssues" className="ml-2 text-sm text-slate-300">
              Poor insulation (walls, roof, windows)
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              id="ventilationIssues"
              type="checkbox"
              checked={hasVentilationIssues}
              onChange={(e) => setHasVentilationIssues(e.target.checked)}
              className="h-4 w-4 rounded border-white/20 text-orange-500 focus:ring-orange-500/20"
            />
            <label htmlFor="ventilationIssues" className="ml-2 text-sm text-slate-300">
              Inadequate ventilation or air quality issues
            </label>
          </div>
        </div>
      </div>
      
      <div className="flex space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate('/dashboard/properties')}
          fullWidth
        >
          Cancel
        </Button>
        
        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
          fullWidth
        >
          {isEditing ? 'Update Property' : 'Add Property'}
        </Button>
      </div>
    </form>
  );
};

export default PropertyForm;
