import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Building2, User, CheckCircle, XCircle, Clock, AlertCircle, Search, Filter } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { applicationService, propertyService, Application, Property } from '../services/supabaseService';
import { useAuthStore } from '../store/authStore';

const Applications = () => {
  const { user } = useAuthStore();
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);
  const [properties, setProperties] = useState<Record<string, Property>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  const isPropertyOwner = user?.role === 'property-owner';
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch applications based on user role
        const applicationsData = isPropertyOwner
          ? await applicationService.getApplicationsForMyProperties()
          : await applicationService.getMyApplications();
        
        setApplications(applicationsData);
        
        // Fetch property details for each application
        const propertyIds = [...new Set(applicationsData.map(app => app.property_id))];
        const propertiesMap: Record<string, Property> = {};
        
        for (const propertyId of propertyIds) {
          const property = await propertyService.getPropertyById(propertyId);
          if (property) {
            propertiesMap[propertyId] = property;
          }
        }
        
        setProperties(propertiesMap);
      } catch (err) {
        setError('Failed to load applications. Please try again.');
        console.error('Applications fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [isPropertyOwner, user?.role]);
  
  useEffect(() => {
    let filtered = [...applications];
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(application => application.status === statusFilter);
    }
    
    // Apply search filter
    if (searchTerm.trim() !== '') {
      const searchTermLower = searchTerm.toLowerCase();
      filtered = filtered.filter(application => {
        const property = properties[application.property_id];
        if (!property) return false;
        
        return (
          property.address.toLowerCase().includes(searchTermLower) ||
          property.city.toLowerCase().includes(searchTermLower) ||
          property.postal_code.toLowerCase().includes(searchTermLower) ||
          property.country.toLowerCase().includes(searchTermLower) ||
          (application.message && application.message.toLowerCase().includes(searchTermLower))
        );
      });
    }
    
    setFilteredApplications(filtered);
  }, [searchTerm, statusFilter, applications, properties]);
  
  const handleUpdateStatus = async (id: string, status: 'approved' | 'rejected') => {
    if (!isPropertyOwner) return;
    
    setIsUpdating(true);
    setError(null);
    setSuccess(null);
    
    try {
      const updatedApplication = await applicationService.updateApplicationStatus(id, status);
      
      if (updatedApplication) {
        // Update the application in the list
        setApplications(applications.map(app => 
          app.id === id ? updatedApplication : app
        ));
        
        setSuccess(`Application ${status === 'approved' ? 'approved' : 'rejected'} successfully.`);
      } else {
        throw new Error(`Failed to ${status} application`);
      }
    } catch (err) {
      setError(`Failed to update application status. Please try again.`);
      console.error('Application status update error:', err);
    } finally {
      setIsUpdating(false);
    }
  };
  
  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { bg: string; text: string; icon: JSX.Element; label: string }> = {
      pending: { bg: 'bg-yellow-500/20', text: 'text-yellow-500', icon: <Clock size={16} className="mr-2" />, label: 'Pending' },
      approved: { bg: 'bg-green-500/20', text: 'text-green-500', icon: <CheckCircle size={16} className="mr-2" />, label: 'Approved' },
      rejected: { bg: 'bg-red-500/20', text: 'text-red-500', icon: <XCircle size={16} className="mr-2" />, label: 'Rejected' },
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    
    return (
      <div className={`${config.bg} ${config.text} px-3 py-1 rounded-full text-xs inline-flex items-center`}>
        {config.icon}
        <span>{config.label}</span>
      </div>
    );
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };
  
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">
          {isPropertyOwner ? 'Property Applications' : 'My Applications'}
        </h1>
        <p className="text-slate-400">
          {isPropertyOwner 
            ? 'Review and manage applications for your properties' 
            : 'Track the status of your housing applications'}
        </p>
      </div>
      
      {error && (
        <div className="bg-red-500/10 text-red-500 p-4 rounded-xl mb-6 flex items-center">
          <AlertCircle size={20} className="mr-2" />
          <span>{error}</span>
        </div>
      )}
      
      {success && (
        <div className="bg-green-500/10 text-green-500 p-4 rounded-xl mb-6 flex items-center">
          <CheckCircle size={20} className="mr-2" />
          <span>{success}</span>
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
              placeholder="Search applications..."
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
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin h-12 w-12 border-4 border-orange-500 border-t-transparent rounded-full"></div>
        </div>
      ) : filteredApplications.length === 0 ? (
        <Card className="text-center py-12">
          <FileText size={48} className="mx-auto mb-4 text-slate-400" />
          <h3 className="text-xl font-bold text-white mb-2">No Applications Found</h3>
          <p className="text-slate-400 mb-6">
            {applications.length === 0 
              ? isPropertyOwner 
                ? 'You haven\'t received any applications yet.' 
                : 'You haven\'t submitted any applications yet.'
              : 'No applications match your search criteria.'}
          </p>
          {applications.length === 0 && !isPropertyOwner && (
            <Link to="/dashboard/housing">
              <Button variant="primary">
                Browse Available Properties
              </Button>
            </Link>
          )}
          {applications.length > 0 && (
            <Button variant="secondary" onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
            }}>
              Clear Filters
            </Button>
          )}
        </Card>
      ) : (
        <div className="space-y-6">
          {filteredApplications.map((application) => {
            const property = properties[application.property_id];
            if (!property) return null;
            
            return (
              <Card key={application.id} className="hover:border-orange-500/30 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div className="flex items-center">
                    <div className="bg-orange-500/20 p-2 rounded-lg mr-4">
                      <Building2 className="text-orange-500" size={20} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{property.address}</h3>
                      <p className="text-slate-400">{property.city}, {property.postal_code}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-slate-400 text-sm">
                      Submitted on {formatDate(application.created_at || '')}
                    </div>
                    {getStatusBadge(application.status)}
                  </div>
                </div>
                
                {isPropertyOwner && (
                  <div className="flex items-center space-x-4 mb-4 p-3 bg-slate-800/50 rounded-lg">
                    <div className="bg-blue-500/20 p-2 rounded-full">
                      <User className="text-blue-500" size={16} />
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">Tenant #{application.tenant_id.substring(0, 8)}</p>
                    </div>
                  </div>
                )}
                
                {application.message && (
                  <div className="mb-4">
                    <h4 className="text-white font-medium mb-2">Application Message:</h4>
                    <p className="text-slate-300 bg-slate-800/50 p-3 rounded-lg">{application.message}</p>
                  </div>
                )}
                
                <div className="flex justify-between items-center">
                  <Link to={`/dashboard/properties/${property.id}`}>
                    <Button variant="secondary">
                      View Property
                    </Button>
                  </Link>
                  
                  {isPropertyOwner && application.status === 'pending' && (
                    <div className="flex space-x-3">
                      <Button 
                        variant="outline" 
                        className="text-red-500 border-red-500/20 hover:bg-red-500/10"
                        onClick={() => handleUpdateStatus(application.id, 'rejected')}
                        isLoading={isUpdating}
                        disabled={isUpdating}
                      >
                        <XCircle size={18} className="mr-2" />
                        Reject
                      </Button>
                      
                      <Button 
                        variant="primary"
                        onClick={() => handleUpdateStatus(application.id, 'approved')}
                        isLoading={isUpdating}
                        disabled={isUpdating}
                      >
                        <CheckCircle size={18} className="mr-2" />
                        Approve
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Applications;
