import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { Navigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import { propertyService, applicationService, Property, Application } from '../services/supabaseService';

const Reports = () => {
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch all properties and applications for reports
        const [propertiesData, applicationsData] = await Promise.all([
          propertyService.getAvailableProperties(),
          applicationService.getApplicationsForMyProperties(),
        ]);
        
        setProperties(propertiesData);
        setApplications(applicationsData);
      } catch (err) {
        setError('Failed to load report data. Please try again.');
        console.error('Reports data fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Calculate statistics
  const totalProperties = properties.length;
  const availableProperties = properties.filter(p => p.status === 'available').length;
  const pendingProperties = properties.filter(p => p.status === 'pending').length;
  const renovatingProperties = properties.filter(p => p.status === 'renovating').length;
  const occupiedProperties = properties.filter(p => p.status === 'occupied').length;
  
  const totalApplications = applications.length;
  const pendingApplications = applications.filter(a => a.status === 'pending').length;
  const approvedApplications = applications.filter(a => a.status === 'approved').length;
  const rejectedApplications = applications.filter(a => a.status === 'rejected').length;

  // Check if user is administrator
  if (user?.role !== 'administrator') {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-6">Reports & Analytics</h1>
      
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin h-12 w-12 border-4 border-orange-500 border-t-transparent rounded-full"></div>
        </div>
      ) : error ? (
        <div className="bg-red-500/10 text-red-500 p-4 rounded-xl mb-6">
          {error}
        </div>
      ) : (
        <div className="space-y-8">
          {/* Property Statistics */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Property Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <Card>
                <div className="text-center">
                  <p className="text-4xl font-bold text-white">{totalProperties}</p>
                  <p className="text-slate-400 mt-2">Total Properties</p>
                </div>
              </Card>
              <Card>
                <div className="text-center">
                  <p className="text-4xl font-bold text-green-500">{availableProperties}</p>
                  <p className="text-slate-400 mt-2">Available</p>
                </div>
              </Card>
              <Card>
                <div className="text-center">
                  <p className="text-4xl font-bold text-yellow-500">{pendingProperties}</p>
                  <p className="text-slate-400 mt-2">Pending</p>
                </div>
              </Card>
              <Card>
                <div className="text-center">
                  <p className="text-4xl font-bold text-blue-500">{renovatingProperties}</p>
                  <p className="text-slate-400 mt-2">Renovating</p>
                </div>
              </Card>
              <Card>
                <div className="text-center">
                  <p className="text-4xl font-bold text-purple-500">{occupiedProperties}</p>
                  <p className="text-slate-400 mt-2">Occupied</p>
                </div>
              </Card>
            </div>
          </div>

          {/* Application Statistics */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Application Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <div className="text-center">
                  <p className="text-4xl font-bold text-white">{totalApplications}</p>
                  <p className="text-slate-400 mt-2">Total Applications</p>
                </div>
              </Card>
              <Card>
                <div className="text-center">
                  <p className="text-4xl font-bold text-yellow-500">{pendingApplications}</p>
                  <p className="text-slate-400 mt-2">Pending</p>
                </div>
              </Card>
              <Card>
                <div className="text-center">
                  <p className="text-4xl font-bold text-green-500">{approvedApplications}</p>
                  <p className="text-slate-400 mt-2">Approved</p>
                </div>
              </Card>
              <Card>
                <div className="text-center">
                  <p className="text-4xl font-bold text-red-500">{rejectedApplications}</p>
                  <p className="text-slate-400 mt-2">Rejected</p>
                </div>
              </Card>
            </div>
          </div>

          {/* Monthly Activity Chart */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Monthly Activity</h2>
            <Card>
              <div className="h-64 flex items-center justify-center">
                <p className="text-slate-400">
                  Chart visualization will be implemented here
                </p>
              </div>
            </Card>
          </div>

          {/* Property Distribution by City */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Property Distribution by City</h2>
            <Card>
              <div className="h-64 flex items-center justify-center">
                <p className="text-slate-400">
                  Map visualization will be implemented here
                </p>
              </div>
            </Card>
          </div>

          {/* Recent Activity Table */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Recent System Activity</h2>
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left p-4 text-slate-400">Date</th>
                      <th className="text-left p-4 text-slate-400">User</th>
                      <th className="text-left p-4 text-slate-400">Action</th>
                      <th className="text-left p-4 text-slate-400">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-white/5 hover:bg-white/5">
                      <td className="p-4 text-white">2025-03-06</td>
                      <td className="p-4 text-white">John Doe</td>
                      <td className="p-4 text-white">Property Added</td>
                      <td className="p-4 text-white">123 Main St, New York</td>
                    </tr>
                    <tr className="border-b border-white/5 hover:bg-white/5">
                      <td className="p-4 text-white">2025-03-05</td>
                      <td className="p-4 text-white">Jane Smith</td>
                      <td className="p-4 text-white">Application Submitted</td>
                      <td className="p-4 text-white">For 456 Park Ave, Boston</td>
                    </tr>
                    <tr className="border-b border-white/5 hover:bg-white/5">
                      <td className="p-4 text-white">2025-03-04</td>
                      <td className="p-4 text-white">Admin User</td>
                      <td className="p-4 text-white">User Approved</td>
                      <td className="p-4 text-white">New property owner account</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
