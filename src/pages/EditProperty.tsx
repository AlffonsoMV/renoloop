import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Edit, AlertCircle } from 'lucide-react';
import Card from '../components/ui/Card';
import PropertyForm from '../components/PropertyForm';
import { propertyService, Property } from '../services/supabaseService';

const EditProperty = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) {
        navigate('/dashboard/properties');
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      try {
        const propertyData = await propertyService.getPropertyById(id);
        
        if (!propertyData) {
          throw new Error('Property not found');
        }
        
        setProperty(propertyData);
      } catch (err) {
        setError('Failed to load property. Please try again.');
        console.error('Property fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProperty();
  }, [id, navigate]);
  
  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-orange-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  if (error || !property) {
    return (
      <div className="p-8">
        <div className="bg-red-500/10 text-red-500 p-4 rounded-xl mb-6 flex items-center">
          <AlertCircle size={20} className="mr-2" />
          <span>{error || 'Property not found'}</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Edit Property</h1>
        <p className="text-slate-400">Update your property information</p>
      </div>
      
      <Card>
        <div className="flex items-center mb-6">
          <div className="bg-orange-500/20 p-2 rounded-full mr-4">
            <Edit size={24} className="text-orange-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{property.address}</h2>
            <p className="text-slate-400">{property.city}, {property.postal_code}, {property.country}</p>
          </div>
        </div>
        
        <PropertyForm property={property} isEditing={true} />
      </Card>
    </div>
  );
};

export default EditProperty;
