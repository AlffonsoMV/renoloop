import React, { useEffect, useState } from 'react';
import { MapPin, Search, Building2, X, Loader, Home, List, Map, Grid3X3, SlidersHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { propertyService, Property } from '../services/supabaseService';
import { PropertyMap } from '../components/PropertyMap';
import { profileService, Profile } from "../services/supabaseService";

const SearchApartments = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    city: '',
    country: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [, setSelectedProperty] = useState<Property | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid');
  
  // Get all available cities and countries for filters
  const cities = [...new Set(properties.map(p => p.city))].sort();
  const countries = [...new Set(properties.map(p => p.country))].sort();
  
  useEffect(() => {
    const fetchProperties = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const propertiesData = await propertyService.getAvailableProperties(
          profile?.role
        );
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


    const fetchProfile = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const profileData = await profileService.getCurrentProfile();
        
        if (profileData) {
          setProfile(profileData);
        }
      } catch (err) {
        setError('Failed to load profile. Please try again.');
        console.error('Profile fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    useEffect(() => {
      fetchProfile();
    }, []);
  
  useEffect(() => {
    let filtered = [...properties];
    
    // Apply search term filter
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
    
    // Apply dropdown filters
    if (filters.city) {
      filtered = filtered.filter(property => property.city === filters.city);
    }
    
    if (filters.country) {
      filtered = filtered.filter(property => property.country === filters.country);
    }
    
    setFilteredProperties(filtered);
  }, [searchTerm, filters, properties]);
  
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };
  
  const clearFilters = () => {
    setFilters({
      city: '',
      country: '',
    });
    setSearchTerm('');
  };
  
  const handlePropertyClick = (property: Property) => {
    setSelectedProperty(property);
    navigate(`/dashboard/properties/${property.id}`);
  };

  // Create a virtual property for the map component when in map view
  const mapCenterProperty = {
    address: filteredProperties.length > 0 ? filteredProperties[0].address : 'Marseille',
    city: filteredProperties.length > 0 ? filteredProperties[0].city : 'Marseille',
    country: filteredProperties.length > 0 ? filteredProperties[0].country : 'France'
  };
  
  return (
    <div className="p-4 md:p-8">
      {/* Header with title and view mode toggle */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Search Apartments
          </h1>
          <p className="text-slate-400">Find your perfect home in Marseille</p>
        </div>

        <div className="flex items-center space-x-2 mt-4 md:mt-0 bg-white/5 backdrop-blur-lg rounded-xl p-1 border border-white/10">
          <Button
            variant={viewMode === "grid" ? "primary" : "outline"}
            className="p-2 h-auto"
            onClick={() => setViewMode("grid")}
          >
            <Grid3X3 size={18} />
          </Button>
          <Button
            variant={viewMode === "list" ? "primary" : "outline"}
            className="p-2 h-auto"
            onClick={() => setViewMode("list")}
          >
            <List size={18} />
          </Button>
          <Button
            variant={viewMode === "map" ? "primary" : "outline"}
            className="p-2 h-auto"
            onClick={() => setViewMode("map")}
          >
            <Map size={18} />
          </Button>
        </div>
      </div>

      {/* Search and filters section */}
      <Card className="mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
          {/* Search input */}
          <div className="flex-grow">
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">
                <Search size={20} />
              </div>
              <Input
                type="text"
                placeholder="Search by address, city, or country..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
          </div>

          {/* Filter button */}
          <div>
            <Button
              variant="outline"
              className="flex items-center"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal size={18} className="mr-2" />
              Filters
              {showFilters ? <X size={16} className="ml-2" /> : null}
            </Button>
          </div>

          {/* Results count */}
          <div className="bg-white/5 backdrop-blur-lg rounded-xl px-4 py-2 border border-white/10 flex items-center">
            <span className="text-slate-300 text-sm mr-2">
              {filteredProperties.length} properties
            </span>
            {filteredProperties.length > 0 && (
              <span className="text-orange-500 text-xs font-medium bg-orange-500/10 px-2 py-1 rounded-full">
                Available Now
              </span>
            )}
          </div>
        </div>

        {/* Expandable filters */}
        <div
          className={`mt-4 transition-all duration-300 overflow-hidden ${
            showFilters ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="pt-4 border-t border-white/10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  City
                </label>
                <select
                  name="city"
                  value={filters.city}
                  onChange={handleFilterChange}
                  className="w-full bg-white/5 backdrop-blur-lg text-white px-4 py-3 rounded-xl border border-white/10 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300"
                >
                  <option value="">All Cities</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Country
                </label>
                <select
                  name="country"
                  value={filters.country}
                  onChange={handleFilterChange}
                  className="w-full bg-white/5 backdrop-blur-lg text-white px-4 py-3 rounded-xl border border-white/10 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300"
                >
                  <option value="">All Countries</option>
                  {countries.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <Button
                  variant="secondary"
                  onClick={clearFilters}
                  className="w-full md:w-auto"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Content area */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader className="animate-spin h-12 w-12 text-orange-500" />
        </div>
      ) : error ? (
        <Card className="text-center py-12">
          <div className="text-red-500 mb-4">
            <X size={48} className="mx-auto" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            Error Loading Properties
          </h3>
          <p className="text-slate-400 mb-6">{error}</p>
          <Button variant="primary" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </Card>
      ) : filteredProperties.length === 0 ? (
        <Card className="text-center py-12">
          <Building2 size={48} className="mx-auto mb-4 text-slate-400" />
          <h3 className="text-xl font-bold text-white mb-2">
            No Properties Found
          </h3>
          <p className="text-slate-400 mb-6">
            {searchTerm.trim() !== "" || filters.city || filters.country
              ? "No properties match your search criteria. Try different filters."
              : "There are no available properties at the moment. Please check back later."}
          </p>
          {(searchTerm.trim() !== "" || filters.city || filters.country) && (
            <Button variant="secondary" onClick={clearFilters}>
              Clear Filters
            </Button>
          )}
        </Card>
      ) : (
        <div>
          {/* Map View (when viewMode is map) */}
          {viewMode === "map" && (
            <Card className="p-0 overflow-hidden mb-6">
              <div className="relative h-[600px] bg-slate-800">
                <PropertyMap property={mapCenterProperty} />

                {/* Property markers overlay */}
                <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-lg p-4 rounded-xl border border-white/20 max-w-xs">
                  <h3 className="text-white font-medium mb-2">
                    Properties on Map
                  </h3>
                  <p className="text-slate-300 text-sm mb-4">
                    Click on a property to view details
                  </p>
                  <div className="max-h-64 overflow-y-auto space-y-2">
                    {filteredProperties.slice(0, 5).map((property) => (
                      <div
                        key={property.id}
                        className="flex items-center p-2 hover:bg-white/5 rounded-lg cursor-pointer"
                        onClick={() => handlePropertyClick(property)}
                      >
                        <MapPin
                          size={16}
                          className="text-orange-500 mr-2 flex-shrink-0"
                        />
                        <div className="truncate">
                          <p className="text-white text-sm truncate">
                            {property.address}
                          </p>
                          <p className="text-slate-400 text-xs">
                            {property.city}
                          </p>
                        </div>
                      </div>
                    ))}
                    {filteredProperties.length > 5 && (
                      <p className="text-center text-slate-400 text-xs pt-2 border-t border-white/10">
                        +{filteredProperties.length - 5} more properties
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Grid View */}
          {viewMode === "grid" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map((property) => (
                <div
                  key={property.id}
                  className="bg-white/5 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/10 shadow-xl hover:border-orange-500/30 transition-all duration-300 cursor-pointer hover:shadow-orange-500/5 hover:translate-y-[-2px]"
                  onClick={() => handlePropertyClick(property)}
                >
                  <div className="relative h-48 bg-slate-800">
                    <PropertyMap property={property} />
                    {property?.status === 'available' ? (
                      <div className="absolute top-4 right-4 bg-green-500/20 text-green-500 px-3 py-1 rounded-full text-sm backdrop-blur-md">
                        Available
                      </div>
                    ) : property?.status === 'pending' ? (
                      <div className="absolute top-4 right-4 bg-yellow-500/20 text-yellow-500 px-3 py-1 rounded-full text-sm backdrop-blur-md">
                        Pending
                      </div>
                    ) : (
                      <div className="absolute top-4 right-4 bg-red-500/20 text-red-500 px-3 py-1 rounded-full text-sm backdrop-blur-md">
                        Sold
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <div className="flex items-center mb-3">
                      <Home size={20} className="text-orange-500 mr-2" />
                      <h3 className="text-xl font-bold text-white truncate">
                        {property.address}
                      </h3>
                    </div>

                    <div className="flex items-start mb-4">
                      <MapPin
                        size={16}
                        className="text-slate-400 mr-2 mt-0.5"
                      />
                      <p className="text-slate-400">
                        {property.city}, {property.postal_code},{" "}
                        {property.country}
                      </p>
                    </div>

                    {property.description && (
                      <p className="text-slate-300 mb-4 mt-10 line-clamp-2">
                        {property.description}
                      </p>
                    )}

                    <Button variant="primary" className="w-full mt-2">
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* List View */}
          {viewMode === "list" && (
            <div className="space-y-4">
              {filteredProperties.map((property) => (
                <div
                  key={property.id}
                  className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 shadow-lg hover:border-orange-500/30 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col md:flex-row"
                  onClick={() => handlePropertyClick(property)}
                >
                  <div className="md:w-1/3 h-48 md:h-auto relative">
                    <PropertyMap property={property} />
                  </div>

                  <div className="p-6 md:w-2/3 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-bold text-white">
                          {property.address}
                        </h3>
                        <div className="bg-green-500/20 text-green-500 px-3 py-1 rounded-full text-sm">
                          Available
                        </div>
                      </div>

                      <div className="flex items-start mb-3">
                        <MapPin
                          size={16}
                          className="text-slate-400 mr-2 mt-0.5"
                        />
                        <p className="text-slate-400">
                          {property.city}, {property.postal_code},{" "}
                          {property.country}
                        </p>
                      </div>

                      {property.description && (
                        <p className="text-slate-300 mb-4 line-clamp-2">
                          {property.description}
                        </p>
                      )}
                    </div>

                    <div className="flex justify-end">
                      <Button variant="primary">View Details</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchApartments;
