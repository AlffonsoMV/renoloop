import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Search, MapPin, AlertCircle } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { propertyService, Property } from '../services/supabaseService';

const Housing = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    const fetchProperties = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const propertiesData = await propertyService.getAvailableProperties();
        setProperties(propertiesData);
        setFilteredProperties(propertiesData);
      } catch (err) {
        setError('Failed to load properties. Please try again.');
        console.error('Properties fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProperties();
  }, []);
  
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredProperties(properties);
      return;
    }
    
    const searchTermLower = searchTerm.toLowerCase();
    const filtered = properties.filter(property => 
      property.address.toLowerCase().includes(searchTermLower) ||
      property.city.toLowerCase().includes(searchTermLower) ||
      property.postal_code.toLowerCase().includes(searchTermLower) ||
      property.country.toLowerCase().includes(searchTermLower) ||
      (property.description && property.description.toLowerCase().includes(searchTermLower))
    );
    
    setFilteredProperties(filtered);
  }, [searchTerm, properties]);
  
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Housing Options</h1>
          <p className="text-slate-400">Browse available properties and find your next home</p>
        </div>
      </div>
      
      <div className="mb-8">
        <div className="relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">
            <Search size={20} />
          </div>
          <Input
            type="text"
            placeholder="Search by address, city, or country..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin h-12 w-12 border-4 border-orange-500 border-t-transparent rounded-full"></div>
        </div>
      )}
      
      {error && (
        <div className="bg-red-500/10 text-red-500 p-4 rounded-xl mb-6 flex items-center">
          <AlertCircle size={20} className="mr-2" />
          <span>{error}</span>
        </div>
      )}
      
      {!isLoading && !error && filteredProperties.length === 0 && (
        <Card className="text-center py-12">
          <Building2 size={48} className="mx-auto mb-4 text-slate-400" />
          <h3 className="text-xl font-bold text-white mb-2">No Properties Found</h3>
          <p className="text-slate-400 mb-6">
            {searchTerm.trim() !== '' 
              ? 'No properties match your search criteria. Try a different search term.' 
              : 'There are no available properties at the moment. Please check back later.'}
          </p>
          {searchTerm.trim() !== '' && (
            <Button variant="secondary" onClick={() => setSearchTerm('')}>
              Clear Search
            </Button>
          )}
        </Card>
      )}
      
      {!isLoading && !error && filteredProperties.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <Card key={property.id} className="hover:border-orange-500/30 transition-colors h-full flex flex-col">
              <div className="flex-1">
                <div className="flex items-center mb-4">
                  <Building2 size={20} className="text-orange-500 mr-2" />
                  <h3 className="text-xl font-bold text-white">{property.address}</h3>
                </div>
                
                <div className="flex items-start mb-4">
                  <MapPin size={16} className="text-slate-400 mr-2 mt-0.5" />
                  <p className="text-slate-400">{property.city}, {property.postal_code}, {property.country}</p>
                </div>
                
                {property.description && (
                  <p className="text-slate-300 mb-4 line-clamp-3">{property.description}</p>
                )}
              </div>
              
              <div className="mt-4">
                <Link to={`/dashboard/properties/${property.id}`}>
                  <Button variant="primary" fullWidth>
                    View Details
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Housing;
