import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Building2, MapPin, Edit, Trash2, AlertCircle, Search, Filter } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { propertyService, Property } from '../services/supabaseService';

const MyProperties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  useEffect(() => {
    const fetchProperties = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const propertiesData = await propertyService.getMyProperties();
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
    let filtered = [...properties];
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(property => property.status === statusFilter);
    }
    
    // Apply search filter
    if (searchTerm.trim() !== '') {
      const searchTermLower = searchTerm.toLowerCase();
      filtered = filtered.filter(property => 
        property.address.toLowerCase().includes(searchTermLower) ||
        property.city.toLowerCase().includes(searchTermLower) ||
        property.postal_code.toLowerCase().includes(searchTermLower) ||
        property.country.toLowerCase().includes(searchTermLower) ||
        (property.description && property.description.toLowerCase().includes(searchTermLower))
      );
    }
    
    setFilteredProperties(filtered);
  }, [searchTerm, statusFilter, properties]);
  
  const handleDeleteProperty = async (id: string) => {
    setIsDeleting(true);
    
    try {
      const success = await propertyService.deleteProperty(id);
      
      if (success) {
        // Remove the property from the list
        setProperties(properties.filter(p => p.id !== id));
        setShowDeleteConfirm(null);
      } else {
        throw new Error('Failed to delete property');
      }
    } catch (err) {
      setError('Failed to delete property. Please try again.');
      console.error('Property delete error:', err);
    } finally {
      setIsDeleting(false);
    }
  };
  
  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
      pending: { bg: 'bg-yellow-500/20', text: 'text-yellow-500', label: 'Pending Approval' },
      approved: { bg: 'bg-blue-500/20', text: 'text-blue-500', label: 'Approved' },
      renovating: { bg: 'bg-purple-500/20', text: 'text-purple-500', label: 'Under Renovation' },
      available: { bg: 'bg-green-500/20', text: 'text-green-500', label: 'Available' },
      occupied: { bg: 'bg-orange-500/20', text: 'text-orange-500', label: 'Occupied' },
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    
    return (
      <span className={`${config.bg} ${config.text} px-3 py-1 rounded-full text-xs`}>
        {config.label}
      </span>
    );
  };
  
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">My Properties</h1>
          <p className="text-slate-400">Manage your registered properties</p>
        </div>
        
        <Link to="/dashboard/properties/add">
          <Button variant="primary">
            <Plus size={18} className="mr-2" />
            Add Property
          </Button>
        </Link>
      </div>
      
      {error && (
        <div className="bg-red-500/10 text-red-500 p-4 rounded-xl mb-6 flex items-center">
          <AlertCircle size={20} className="mr-2" />
          <span>{error}</span>
        </div>
      )}
      
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1">
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">
              <Search size={20} />
            </div>
            <Input
              type="text"
              placeholder="Search properties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="w-full md:w-64">
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">
              <Filter size={20} />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-white/5 backdrop-blur-lg text-white px-10 py-3 rounded-xl border border-white/10 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 appearance-none"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending Approval</option>
              <option value="approved">Approved</option>
              <option value="renovating">Under Renovation</option>
              <option value="available">Available</option>
              <option value="occupied">Occupied</option>
            </select>
          </div>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin h-12 w-12 border-4 border-orange-500 border-t-transparent rounded-full"></div>
        </div>
      ) : filteredProperties.length === 0 ? (
        <Card className="text-center py-12">
          <Building2 size={48} className="mx-auto mb-4 text-slate-400" />
          <h3 className="text-xl font-bold text-white mb-2">No Properties Found</h3>
          <p className="text-slate-400 mb-6">
            {properties.length === 0 
              ? 'You haven\'t registered any properties yet.' 
              : 'No properties match your search criteria.'}
          </p>
          {properties.length === 0 ? (
            <Link to="/dashboard/properties/add">
              <Button variant="primary">
                <Plus size={18} className="mr-2" />
                Add Your First Property
              </Button>
            </Link>
          ) : (
            <Button variant="secondary" onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
            }}>
              Clear Filters
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <Card key={property.id} className="hover:border-orange-500/30 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  <Building2 size={20} className="text-orange-500 mr-2" />
                  <h3 className="text-xl font-bold text-white">{property.address}</h3>
                </div>
                {getStatusBadge(property.status)}
              </div>
              
              <div className="flex items-start mb-4">
                <MapPin size={16} className="text-slate-400 mr-2 mt-0.5" />
                <p className="text-slate-400">{property.city}, {property.postal_code}, {property.country}</p>
              </div>
              
              {property.description && (
                <p className="text-slate-300 mb-4 line-clamp-2">{property.description}</p>
              )}
              
              <div className="flex justify-between mt-6">
                <Link to={`/dashboard/properties/${property.id}`}>
                  <Button variant="secondary">
                    View Details
                  </Button>
                </Link>
                
                <div className="flex space-x-2">
                  <Link to={`/dashboard/properties/edit/${property.id}`}>
                    <Button variant="outline" className="p-2">
                      <Edit size={18} />
                    </Button>
                  </Link>
                  
                  <Button 
                    variant="outline" 
                    className="p-2 text-red-500 border-red-500/20 hover:bg-red-500/10"
                    onClick={() => setShowDeleteConfirm(property.id)}
                  >
                    <Trash2 size={18} />
                  </Button>
                </div>
              </div>
              
              {/* Delete Confirmation */}
              {showDeleteConfirm === property.id && (
                <div className="absolute inset-0 bg-slate-800/95 backdrop-blur-sm flex items-center justify-center rounded-xl p-6">
                  <div className="text-center">
                    <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">Delete Property?</h3>
                    <p className="text-slate-300 mb-6">
                      Are you sure you want to delete this property? This action cannot be undone.
                    </p>
                    <div className="flex space-x-4 justify-center">
                      <Button 
                        variant="outline" 
                        onClick={() => setShowDeleteConfirm(null)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        variant="primary" 
                        className="bg-red-500 hover:bg-red-600"
                        onClick={() => handleDeleteProperty(property.id)}
                        isLoading={isDeleting}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyProperties;
