import React, { useEffect, useState } from 'react';
import { Navigate, Link, Routes, Route } from 'react-router-dom';
import { Building2, User, LogOut, Home, FileText, Settings as SettingsIcon, Bell, HelpCircle, Search, Users as UsersIcon, MessageCircle, Leaf } from 'lucide-react';
import EnvironmentalImpactStats from '../components/EnvironmentalImpactStats';
import Notifications from '../components/Notifications';
import MyProperties from './MyProperties';
import Applications from './Applications';
import Settings from './Settings';
import NotificationsPage from './NotificationsPage';
import AddProperty from './AddProperty';
import EditProperty from './EditProperty';
import PropertyDetail from './PropertyDetail';
import Housing from './Housing';
import SearchApartments from './SearchApartments';
import Chat from './Chat';
import Users from './Users';
import Reports from './Reports';
import { useAuthStore } from '../store/authStore';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { propertyService, applicationService, Property, Application } from '../services/supabaseService';

const Dashboard = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  
  // Fetch dashboard data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch data based on user role
        if (user?.role === 'property-owner') {
          const [propertiesData, applicationsData] = await Promise.all([
            propertyService.getMyProperties(),
            applicationService.getApplicationsForMyProperties(),
          ]);
          
          setProperties(propertiesData);
          setApplications(applicationsData);
        } else {
          const [availableProperties, myApplications] = await Promise.all([
            propertyService.getAvailableProperties(),
            applicationService.getMyApplications(),
          ]);
          
          setProperties(availableProperties);
          setApplications(myApplications);
        }
      } catch (err) {
        setError('Failed to load dashboard data. Please try again.');
        console.error('Dashboard data fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [user?.role]);
  
  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };
  
  return !isAuthenticated ? (
    <Navigate to="/login" />
  ) : (
    <div className="min-h-screen bg-slate-900">
      {/* Loading or Error State */}
      {isLoading && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="text-center">
            <div className="animate-spin h-12 w-12 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-white">Loading dashboard data...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="max-w-7xl mx-auto px-4 pt-24">
          <div className="bg-red-500/10 text-red-500 p-4 rounded-xl mb-6 flex items-center">
            <span className="mr-2">⚠️</span>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-slate-800 border-r border-white/10 z-10">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-8">
            <div className="p-2 rounded-xl">
              <img src="/src/assets/images/logo.png" alt="Logo" width="40" />
            </div>
            <span
              className="text-lg font-bold text-white tracking-tight"
              style={{ fontFamily: "TAN Headline" }}
            >
              RENOLOOP
            </span>
          </div>

          <nav className="space-y-1">
            {/* Dashboard - Common for all users */}
            <Link
              to="/dashboard"
              className={`flex items-center space-x-3 ${
                location.pathname === "/dashboard"
                  ? "bg-orange-500/20 text-white"
                  : "text-slate-400 "
              } p-3 rounded-xl hover:bg-white/5 transition-colors`}
            >
              <Home size={20} />
              <span>Dashboard</span>
            </Link>

            {/* Property Owner Section */}
            {user?.role === "property-owner" && (
              <>
                <div className="pt-4 pb-2">
                  <p className="text-xs uppercase text-slate-500 font-semibold px-3">
                    Property Management
                  </p>
                </div>
                <Link
                  to="/dashboard/properties"
                  className="flex items-center space-x-3 text-slate-400 hover:text-white p-3 rounded-xl hover:bg-white/5 transition-colors"
                >
                  <Building2 size={20} />
                  <span>My Properties</span>
                </Link>
                <Link
                  to="/dashboard/properties/add"
                  className="flex items-center space-x-3 text-slate-400 hover:text-white p-3 rounded-xl hover:bg-white/5 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                  <span>Add Property</span>
                </Link>
                <Link
                  to="/dashboard/applications"
                  className="flex items-center space-x-3 text-slate-400 hover:text-white p-3 rounded-xl hover:bg-white/5 transition-colors"
                >
                  <FileText size={20} />
                  <span>Applications</span>
                </Link>
              </>
            )}

            {/* Tenant Section */}
            {user?.role === "tenant" && (
              <>
                <div className="pt-4 pb-2">
                  <p className="text-xs uppercase text-slate-500 font-semibold px-3">
                    Housing
                  </p>
                </div>
                <Link
                  to="/dashboard/housing"
                  className="flex items-center space-x-3 text-slate-400 hover:text-white p-3 rounded-xl hover:bg-white/5 transition-colors"
                >
                  <Home size={20} />
                  <span>Housing Options</span>
                </Link>
                <Link
                  to="/dashboard/search"
                  className="flex items-center space-x-3 text-slate-400 hover:text-white p-3 rounded-xl hover:bg-white/5 transition-colors"
                >
                  <Search size={20} />
                  <span>Search Apartments</span>
                </Link>
                <Link
                  to="/dashboard/applications"
                  className="flex items-center space-x-3 text-slate-400 hover:text-white p-3 rounded-xl hover:bg-white/5 transition-colors"
                >
                  <FileText size={20} />
                  <span>My Applications</span>
                </Link>
              </>
            )}

            {/* Administrator Section */}
            {user?.role === "administrator" && (
              <>
                <div className="pt-4 pb-2">
                  <p className="text-xs uppercase text-slate-500 font-semibold px-3">
                    Administration
                  </p>
                </div>
                <Link
                  to="/dashboard/properties"
                  className="flex items-center space-x-3 text-slate-400 hover:text-white p-3 rounded-xl hover:bg-white/5 transition-colors"
                >
                  <Building2 size={20} />
                  <span>All Properties</span>
                </Link>
                <Link
                  to="/dashboard/applications"
                  className="flex items-center space-x-3 text-slate-400 hover:text-white p-3 rounded-xl hover:bg-white/5 transition-colors"
                >
                  <FileText size={20} />
                  <span>All Applications</span>
                </Link>
                <Link
                  to="/dashboard/users"
                  className="flex items-center space-x-3 text-slate-400 hover:text-white p-3 rounded-xl hover:bg-white/5 transition-colors"
                >
                  <UsersIcon size={20} />
                  <span>Manage Users</span>
                </Link>
                <Link
                  to="/dashboard/search"
                  className="flex items-center space-x-3 text-slate-400 hover:text-white p-3 rounded-xl hover:bg-white/5 transition-colors"
                >
                  <Search size={20} />
                  <span>Search Apartments</span>
                </Link>
                <Link
                  to="/dashboard/reports"
                  className="flex items-center space-x-3 text-slate-400 hover:text-white p-3 rounded-xl hover:bg-white/5 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path>
                    <path d="M22 12A10 10 0 0 0 12 2v10z"></path>
                  </svg>
                  <span>Reports & Analytics</span>
                </Link>
              </>
            )}

            {/* Common Section for all users */}
            <div className="pt-4 pb-2">
              <p className="text-xs uppercase text-slate-500 font-semibold px-3">
                Account
              </p>
            </div>

            <Link
              to="/dashboard/notifications"
              className="flex items-center space-x-3 text-slate-400 hover:text-white p-3 rounded-xl hover:bg-white/5 transition-colors"
            >
              <Bell size={20} />
              <span>Notifications</span>
            </Link>

            <Link
              to="/dashboard/settings"
              className="flex items-center space-x-3 text-slate-400 hover:text-white p-3 rounded-xl hover:bg-white/5 transition-colors"
            >
              <SettingsIcon size={20} />
              <span>Settings</span>
            </Link>

            <Link
              to="/dashboard/help"
              className="flex items-center space-x-3 text-slate-400 hover:text-white p-3 rounded-xl hover:bg-white/5 transition-colors"
            >
              <HelpCircle size={20} />
              <span>Help & Support</span>
            </Link>

            <Link
              to="/dashboard/chat"
              className="flex items-center space-x-3 text-slate-400 hover:text-white p-3 rounded-xl hover:bg-white/5 transition-colors"
            >
              <MessageCircle size={20} />
              <span>AI Assistant</span>
            </Link>
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6">
          <Button variant="outline" fullWidth onClick={handleLogout}>
            <LogOut size={18} className="mr-2" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            <p className="text-slate-400">Welcome back, {user?.name}</p>
          </div>

          <div className="flex items-center space-x-4">
            <Notifications />

            <div className="flex items-center space-x-3 bg-white/5 p-2 rounded-xl border border-white/10">
              <div className="bg-orange-500 h-8 w-8 rounded-full flex items-center justify-center text-white font-medium">
                {user?.name.charAt(0)}
              </div>
              <span className="text-white">{user?.name}</span>
            </div>
          </div>
        </div>

        <Routes>
          <Route
            path="/"
            element={
              <div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <Card className="bg-gradient-to-br from-orange-500/20 to-amber-500/20 border-orange-500/30">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-white">
                        Account Status
                      </h3>
                      <div className="bg-green-500/20 text-green-500 px-3 py-1 rounded-full text-sm">
                        Active
                      </div>
                    </div>
                    <p className="text-slate-300 mb-4">
                      Your account is fully set up and ready to use.
                    </p>
                    <div className="flex justify-end">
                      <Link
                        to="/dashboard/settings"
                        className="text-orange-500 hover:text-orange-400 transition-colors text-sm flex items-center"
                      >
                        View Details
                      </Link>
                    </div>
                  </Card>

                  {user?.role === "property-owner" && (
                    <>
                      <Card>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-xl font-bold text-white">
                            Properties
                          </h3>
                          <div className="bg-blue-500/20 text-blue-500 px-3 py-1 rounded-full text-sm">
                            {properties.length} Active
                          </div>
                        </div>
                        <p className="text-slate-300 mb-4">
                          Register your properties to start the renovation
                          process.
                        </p>
                        <div className="flex justify-end">
                          <Link
                            to="/dashboard/properties/add"
                            className="text-orange-500 hover:text-orange-400 transition-colors text-sm flex items-center"
                          >
                            Add Property
                          </Link>
                        </div>
                      </Card>

                      <Card>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-xl font-bold text-white">
                            Applications
                          </h3>
                          <div className="bg-amber-500/20 text-amber-500 px-3 py-1 rounded-full text-sm">
                            {applications.length} Pending
                          </div>
                        </div>
                        <p className="text-slate-300 mb-4">
                          Review applications for your properties.
                        </p>
                        <div className="flex justify-end">
                          <Link
                            to="/dashboard/applications"
                            className="text-orange-500 hover:text-orange-400 transition-colors text-sm flex items-center"
                          >
                            View Applications
                          </Link>
                        </div>
                      </Card>
                    </>
                  )}

                  {user?.role === "tenant" && (
                    <>
                      <Card>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-xl font-bold text-white">
                            Housing Applications
                          </h3>
                          <div className="bg-blue-500/20 text-blue-500 px-3 py-1 rounded-full text-sm">
                            {applications.length} Active
                          </div>
                        </div>
                        <p className="text-slate-300 mb-4">
                          Browse available properties and submit applications.
                        </p>
                        <div className="flex justify-end">
                          <Link
                            to="/dashboard/housing"
                            className="text-orange-500 hover:text-orange-400 transition-colors text-sm flex items-center"
                          >
                            Browse Housing
                          </Link>
                        </div>
                      </Card>

                      <Card>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-xl font-bold text-white">
                            Available Properties
                          </h3>
                          <div className="bg-amber-500/20 text-amber-500 px-3 py-1 rounded-full text-sm">
                            {properties.length} Available
                          </div>
                        </div>
                        <p className="text-slate-300 mb-4">
                          Explore housing options that match your preferences.
                        </p>
                        <div className="flex justify-end">
                          <Link
                            to="/dashboard/search"
                            className="text-orange-500 hover:text-orange-400 transition-colors text-sm flex items-center"
                          >
                            Search Apartments
                          </Link>
                        </div>
                      </Card>
                    </>
                  )}

                  {user?.role === "administrator" && (
                    <>
                      <Card>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-xl font-bold text-white">
                            Properties
                          </h3>
                          <div className="bg-blue-500/20 text-blue-500 px-3 py-1 rounded-full text-sm">
                            {properties.length} Total
                          </div>
                        </div>
                        <p className="text-slate-300 mb-4">
                          Manage and approve properties in the system.
                        </p>
                        <div className="flex justify-end">
                          <Link
                            to="/dashboard/properties"
                            className="text-orange-500 hover:text-orange-400 transition-colors text-sm flex items-center"
                          >
                            Manage Properties
                          </Link>
                        </div>
                      </Card>

                      <Card>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-xl font-bold text-white">
                            Applications
                          </h3>
                          <div className="bg-amber-500/20 text-amber-500 px-3 py-1 rounded-full text-sm">
                            {applications.length} Pending
                          </div>
                        </div>
                        <p className="text-slate-300 mb-4">
                          Review and manage all applications in the system.
                        </p>
                        <div className="flex justify-end">
                          <Link
                            to="/dashboard/applications"
                            className="text-orange-500 hover:text-orange-400 transition-colors text-sm flex items-center"
                          >
                            View Applications
                          </Link>
                        </div>
                      </Card>
                    </>
                  )}
                </div>

                {/* Environmental Impact Stats */}
                <div className="mb-8">
                  <EnvironmentalImpactStats />
                </div>

                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-4">
                    Recent Activity
                  </h2>
                  <Card>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-4 p-4 border-b border-white/5">
                        <div className="bg-blue-500/20 p-2 rounded-lg">
                          <User className="text-blue-500" size={20} />
                        </div>
                        <div className="flex-1">
                          <p className="text-white">Account Created</p>
                          <p className="text-slate-400 text-sm">
                            Your account was successfully created.
                          </p>
                        </div>
                        <div className="text-slate-500 text-sm">Just now</div>
                      </div>

                      <div className="flex items-start space-x-4 p-4 border-b border-white/5">
                        <div className="bg-green-500/20 p-2 rounded-lg">
                          <Leaf className="text-green-500" size={20} />
                        </div>
                        <div className="flex-1">
                          <p className="text-white">Environmental Impact</p>
                          <p className="text-slate-400 text-sm">
                            RenoLoop has reduced CO₂ emissions by 1,250 tons
                            this year through property renovations.
                          </p>
                        </div>
                        <div className="text-slate-500 text-sm">Today</div>
                      </div>

                      <div className="flex items-start space-x-4 p-4">
                        <div className="bg-orange-500/20 p-2 rounded-lg">
                          <LogOut className="text-orange-500" size={20} />
                        </div>
                        <div className="flex-1">
                          <p className="text-white">Welcome to RenoLoop</p>
                          <p className="text-slate-400 text-sm">
                            Thank you for joining our platform. Start by
                            exploring the dashboard.
                          </p>
                        </div>
                        <div className="text-slate-500 text-sm">Just now</div>
                      </div>
                    </div>
                  </Card>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">
                    Next Steps
                  </h2>
                  <Card>
                    <div className="space-y-4">
                      {user?.role === "property-owner" ? (
                        <>
                          <div className="flex items-center space-x-4 p-4 border-b border-white/5">
                            <div className="h-10 w-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold">
                              1
                            </div>
                            <div className="flex-1">
                              <p className="text-white font-medium">
                                Register Your Property
                              </p>
                              <p className="text-slate-400">
                                Add details about your property to begin the
                                renovation process.
                              </p>
                            </div>
                            <Link to="/dashboard/properties/add">
                              <Button variant="primary">Start</Button>
                            </Link>
                          </div>

                          <div className="flex items-center space-x-4 p-4 border-b border-white/5">
                            <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-white font-bold">
                              2
                            </div>
                            <div className="flex-1">
                              <p className="text-white font-medium">
                                Complete Funding Application
                              </p>
                              <p className="text-slate-400">
                                Apply for renovation funding and financial
                                support.
                              </p>
                            </div>
                            <Button variant="secondary" disabled>
                              Locked
                            </Button>
                          </div>

                          <div className="flex items-center space-x-4 p-4">
                            <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-white font-bold">
                              3
                            </div>
                            <div className="flex-1">
                              <p className="text-white font-medium">
                                Schedule Property Assessment
                              </p>
                              <p className="text-slate-400">
                                Our experts will evaluate your property's
                                renovation needs.
                              </p>
                            </div>
                            <Button variant="secondary" disabled>
                              Locked
                            </Button>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center space-x-4 p-4 border-b border-white/5">
                            <div className="h-10 w-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold">
                              1
                            </div>
                            <div className="flex-1">
                              <p className="text-white font-medium">
                                Complete Your Profile
                              </p>
                              <p className="text-slate-400">
                                Add personal details and housing preferences to
                                your profile.
                              </p>
                            </div>
                            <Link to="/dashboard/profile">
                              <Button variant="primary">Start</Button>
                            </Link>
                          </div>

                          <div className="flex items-center space-x-4 p-4 border-b border-white/5">
                            <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-white font-bold">
                              2
                            </div>
                            <div className="flex-1">
                              <p className="text-white font-medium">
                                Browse Available Properties
                              </p>
                              <p className="text-slate-400">
                                Explore housing options that match your
                                preferences.
                              </p>
                            </div>
                            <Link to="/dashboard/housing">
                              <Button variant="secondary">Browse</Button>
                            </Link>
                          </div>

                          <div className="flex items-center space-x-4 p-4">
                            <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-white font-bold">
                              3
                            </div>
                            <div className="flex-1">
                              <p className="text-white font-medium">
                                Submit Housing Application
                              </p>
                              <p className="text-slate-400">
                                Apply for housing in properties that interest
                                you.
                              </p>
                            </div>
                            <Button variant="secondary" disabled>
                              Locked
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  </Card>
                </div>
              </div>
            }
          />
          <Route path="/properties" element={<MyProperties />} />
          <Route path="/properties/add" element={<AddProperty />} />
          <Route path="/properties/edit/:id" element={<EditProperty />} />
          <Route path="/properties/:id" element={<PropertyDetail />} />
          <Route path="/applications" element={<Applications />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/housing" element={<Housing />} />
          <Route path="/search" element={<SearchApartments />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/users" element={<Users />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;
