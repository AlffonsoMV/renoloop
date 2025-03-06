import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Building2, MapPin, Edit, Trash2, AlertCircle, CheckCircle, XCircle, Clock, Thermometer, Wind, Shield } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { propertyService, applicationService, Property, Application } from '../services/supabaseService';
import { useAuthStore } from '../store/authStore';
import { PropertyMap } from "../components/PropertyMap";
import RenovationProgress from '../components/RenovationProgress';

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [property, setProperty] = useState<Property | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [userApplication, setUserApplication] = useState<Application | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [applicationMessage, setApplicationMessage] = useState('');
  
  const isOwner = property && user && property.owner_id === user.id;
  
  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        navigate('/dashboard');
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch property details
        const propertyData = await propertyService.getPropertyById(id);
        
        if (!propertyData) {
          throw new Error('Property not found');
        }
        
        setProperty(propertyData);
        
        // If user is property owner, fetch applications for this property
        if (user?.role === 'property-owner' && propertyData.owner_id === user.id) {
          const allApplications = await applicationService.getApplicationsForMyProperties();
          const propertyApplications = allApplications.filter(app => app.property_id === id);
          setApplications(propertyApplications);
        } 
        // If user is tenant, check if they have already applied
        else if (user?.role === 'tenant') {
          const myApplications = await applicationService.getMyApplications();
          const existingApplication = myApplications.find(app => app.property_id === id);
          
          if (existingApplication) {
            setUserApplication(existingApplication);
          }
        }
      } catch (err) {
        setError('Failed to load property details. Please try again.');
        console.error('Property detail fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [id, navigate, user]);

  
  
  const handleDeleteProperty = async () => {
    if (!property) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const success = await propertyService.deleteProperty(property.id);
      
      if (success) {
        navigate('/dashboard/properties');
      } else {
        throw new Error('Failed to delete property');
      }
    } catch (err) {
      setError('Failed to delete property. Please try again.');
      console.error('Property delete error:', err);
      setShowDeleteConfirm(false);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleApply = async () => {
    if (!property || !user || user.role !== 'tenant') return;
    
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    
    try {
      const application = await applicationService.createApplication({
        property_id: property.id,
        message: applicationMessage,
      });
      
      if (application) {
        setUserApplication(application);
        setSuccess('Your application has been submitted successfully.');
        setApplicationMessage('');
      } else {
        throw new Error('Failed to submit application');
      }
    } catch (err) {
      setError('Failed to submit application. Please try again.');
      console.error('Application submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { bg: 'bg-yellow-500/20', text: 'text-yellow-500', icon: <Clock size={16} className="mr-2" />, label: 'Pending Approval' },
      approved: { bg: 'bg-blue-500/20', text: 'text-blue-500', icon: <CheckCircle size={16} className="mr-2" />, label: 'Approved' },
      renovating: { bg: 'bg-purple-500/20', text: 'text-purple-500', icon: <Building2 size={16} className="mr-2" />, label: 'Under Renovation' },
      available: { bg: 'bg-green-500/20', text: 'text-green-500', icon: <CheckCircle size={16} className="mr-2" />, label: 'Available' },
      occupied: { bg: 'bg-orange-500/20', text: 'text-orange-500', icon: <XCircle size={16} className="mr-2" />, label: 'Occupied' },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    
    return (
      <div className={`${config.bg} ${config.text} px-3 py-1 rounded-full text-sm inline-flex items-center`}>
        {config.icon}
        <span>{config.label}</span>
      </div>
    );
  };
  
  
  const getApplicationStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { bg: 'bg-yellow-500/20', text: 'text-yellow-500', icon: <Clock size={16} className="mr-2" />, label: 'Pending' },
      approved: { bg: 'bg-green-500/20', text: 'text-green-500', icon: <CheckCircle size={16} className="mr-2" />, label: 'Approved' },
      rejected: { bg: 'bg-red-500/20', text: 'text-red-500', icon: <XCircle size={16} className="mr-2" />, label: 'Rejected' },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    
    return (
      <div className={`${config.bg} ${config.text} px-3 py-1 rounded-full text-sm inline-flex items-center`}>
        {config.icon}
        <span>{config.label}</span>
      </div>
    );
  };
  
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
        <Button variant="secondary" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </div>
    );
  }
  
  
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">{property.address}</h1>
          <div className="flex items-center text-slate-400">
            <MapPin size={16} className="mr-1" />
            <span>
              {property.city}, {property.postal_code}, {property.country}
            </span>
          </div>
        </div>

        {isOwner && (
          <div className="flex space-x-4">
            <Link to={`/dashboard/properties/edit/${property.id}`}>
              <Button variant="secondary">
                <Edit size={18} className="mr-2" />
                Edit
              </Button>
            </Link>

            <Button
              variant="outline"
              className="text-red-500 border-red-500/20 hover:bg-red-500/10"
              onClick={() => setShowDeleteConfirm(true)}
            >
              <Trash2 size={18} className="mr-2" />
              Delete
            </Button>
          </div>
        )}
      </div>

      {success && (
        <div className="bg-green-500/10 text-green-500 p-4 rounded-xl mb-6 flex items-center">
          <CheckCircle size={20} className="mr-2" />
          <span>{success}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-2 space-y-6">
          {/* Property Map */}
          
          <Card className="p-0 overflow-hidden">
            <PropertyMap property={property} />
          </Card>
          
          {/* Renovation Progress - only shown for properties in renovation */}
          {property.status === 'renovating' && (
            <RenovationProgress property={property} />
          )}

          {/* Property Details */}
          <Card>
            <h2 className="text-xl font-bold text-white mb-4">
              Property Details
            </h2>

            <div className="mb-6">
              <div className="flex items-center mb-2">
                <div className="w-32 text-slate-400">Status</div>
                <div>{getStatusBadge(property.status)}</div>
              </div>

              <div className="flex items-center mb-2">
                <div className="w-32 text-slate-400">Address</div>
                <div className="text-white">{property.address}</div>
              </div>

              <div className="flex items-center mb-2">
                <div className="w-32 text-slate-400">City</div>
                <div className="text-white">{property.city}</div>
              </div>

              <div className="flex items-center mb-2">
                <div className="w-32 text-slate-400">Postal Code</div>
                <div className="text-white">{property.postal_code}</div>
              </div>

              <div className="flex items-center mb-2">
                <div className="w-32 text-slate-400">Country</div>
                <div className="text-white">{property.country}</div>
              </div>
              
              {property.building_age && (
                <div className="flex items-center mb-2">
                  <div className="w-32 text-slate-400">Building Age</div>
                  <div className="text-white">{property.building_age}</div>
                </div>
              )}
              
              {property.current_epc && (
                <div className="flex items-center mb-2">
                  <div className="w-32 text-slate-400">EPC Rating</div>
                  <div className="text-white">
                    {property.current_epc === 'unknown' ? 'Not Assessed' : (
                      <span className={`px-2 py-1 rounded-md ${
                        property.current_epc === 'A' ? 'bg-green-500/20 text-green-500' :
                        property.current_epc === 'B' ? 'bg-green-400/20 text-green-400' :
                        property.current_epc === 'C' ? 'bg-green-300/20 text-green-300' :
                        property.current_epc === 'D' ? 'bg-yellow-500/20 text-yellow-500' :
                        property.current_epc === 'E' ? 'bg-orange-500/20 text-orange-500' :
                        property.current_epc === 'F' ? 'bg-red-400/20 text-red-400' :
                        'bg-red-500/20 text-red-500'
                      }`}>
                        {property.current_epc}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {property.description && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-white mb-2">
                  Description
                </h3>
                <p className="text-slate-300">{property.description}</p>
              </div>
            )}
            
            {/* Environmental Issues Section */}
            {(property.has_heating_issues || property.has_insulation_issues || property.has_ventilation_issues) && (
              <div>
                <h3 className="text-lg font-medium text-white mb-3">
                  Environmental Issues
                </h3>
                <div className="space-y-3">
                  {property.has_heating_issues && (
                    <div className="flex items-start bg-red-500/10 p-3 rounded-lg">
                      <Thermometer className="text-red-500 mr-3 mt-0.5" size={18} />
                      <div>
                        <h4 className="text-white font-medium">Heating System Issues</h4>
                        <p className="text-slate-300 text-sm">This property has an inadequate or inefficient heating system that needs renovation.</p>
                      </div>
                    </div>
                  )}
                  
                  {property.has_insulation_issues && (
                    <div className="flex items-start bg-orange-500/10 p-3 rounded-lg">
                      <Shield className="text-orange-500 mr-3 mt-0.5" size={18} />
                      <div>
                        <h4 className="text-white font-medium">Insulation Issues</h4>
                        <p className="text-slate-300 text-sm">This property has poor insulation in walls, roof, or windows that needs improvement.</p>
                      </div>
                    </div>
                  )}
                  
                  {property.has_ventilation_issues && (
                    <div className="flex items-start bg-blue-500/10 p-3 rounded-lg">
                      <Wind className="text-blue-500 mr-3 mt-0.5" size={18} />
                      <div>
                        <h4 className="text-white font-medium">Ventilation Issues</h4>
                        <p className="text-slate-300 text-sm">This property has inadequate ventilation or air quality issues that need addressing.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </Card>
        </div>

        <Card>
          <h2 className="text-xl font-bold text-white mb-4">
            {isOwner ? "Property Actions" : "Apply for Housing"}
          </h2>

          {isOwner ? (
            <div className="space-y-4">
              <p className="text-slate-300 mb-4">
                Manage your property and view applications from potential
                tenants.
              </p>

              <Link
                to={`/dashboard/properties/edit/${property.id}`}
                className="block w-full"
              >
                <Button variant="primary" fullWidth>
                  <Edit size={18} className="mr-2" />
                  Edit Property
                </Button>
              </Link>

              <Link to="/dashboard/applications" className="block w-full">
                <Button variant="secondary" fullWidth>
                  View Applications ({applications.length})
                </Button>
              </Link>
            </div>
          ) : user?.role === "tenant" ? (
            userApplication ? (
              <div>
                <div className="bg-slate-800/50 p-4 rounded-xl mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-white font-medium">Your Application</h3>
                    {getApplicationStatusBadge(userApplication.status)}
                  </div>

                  <p className="text-slate-400 text-sm mb-2">
                    Submitted on{" "}
                    {new Date(
                      userApplication.created_at || ""
                    ).toLocaleDateString()}
                  </p>

                  {userApplication.message && (
                    <div className="mt-2">
                      <p className="text-slate-300">
                        {userApplication.message}
                      </p>
                    </div>
                  )}
                </div>

                {userApplication.status === "pending" && (
                  <p className="text-slate-300">
                    Your application is currently under review. We'll notify you
                    when there's an update.
                  </p>
                )}

                {userApplication.status === "approved" && (
                  <div>
                    <p className="text-green-500 mb-4">
                      Congratulations! Your application has been approved.
                    </p>
                    <p className="text-slate-300">
                      The property owner will contact you with next steps.
                    </p>
                  </div>
                )}

                {userApplication.status === "rejected" && (
                  <p className="text-slate-300">
                    Unfortunately, your application was not selected. You can
                    browse other available properties.
                  </p>
                )}
              </div>
            ) : (
              <div>
                <p className="text-slate-300 mb-4">
                  Interested in this property? Submit an application to express
                  your interest.
                </p>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Application Message (Optional)
                  </label>
                  <textarea
                    value={applicationMessage}
                    onChange={(e) => setApplicationMessage(e.target.value)}
                    placeholder="Introduce yourself and explain why you're interested in this property..."
                    className="w-full bg-white/5 backdrop-blur-lg text-white px-4 py-3 rounded-xl border border-white/10 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 min-h-[120px]"
                  />
                </div>

                <Button
                  variant="primary"
                  onClick={handleApply}
                  isLoading={isSubmitting}
                  fullWidth
                >
                  Submit Application
                </Button>
              </div>
            )
            ) : user?.role === "administrator" ? (
                <p className="text-slate-300">
                  As an administrator, you can manage properties and applications.
              </p>
            ) : (
            <p className="text-slate-300">
              You need to be logged in as a tenant to apply for this property.
            </p>
          )}
        </Card>
      </div>

      {isOwner && applications.length > 0 && (
        <Card>
          <h2 className="text-xl font-bold text-white mb-4">
            Applications ({applications.length})
          </h2>

          <div className="space-y-4">
            {applications.slice(0, 3).map((application) => (
              <div
                key={application.id}
                className="p-4 bg-slate-800/50 rounded-xl"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-white font-medium">
                    Application from Tenant #
                    {application.tenant_id.substring(0, 8)}
                  </h3>
                  {getApplicationStatusBadge(application.status)}
                </div>

                <p className="text-slate-400 text-sm mb-2">
                  Submitted on{" "}
                  {new Date(application.created_at || "").toLocaleDateString()}
                </p>

                {application.message && (
                  <div className="mt-2">
                    <p className="text-slate-300">{application.message}</p>
                  </div>
                )}
              </div>
            ))}

            {applications.length > 3 && (
              <div className="text-center">
                <Link
                  to="/dashboard/applications"
                  className="text-orange-500 hover:text-orange-400 transition-colors"
                >
                  View all {applications.length} applications
                </Link>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-800 border border-white/10 rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-4">
              Confirm Deletion
            </h3>
            <p className="text-slate-300 mb-6">
              Are you sure you want to delete this property? This action cannot
              be undone.
            </p>
            <div className="flex space-x-4">
              <Button
                variant="outline"
                fullWidth
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                className="bg-red-500 hover:bg-red-600"
                fullWidth
                onClick={handleDeleteProperty}
                isLoading={isSubmitting}
              >
                Delete Property
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetail;
