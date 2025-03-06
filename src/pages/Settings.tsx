import React, { useState, useEffect } from 'react';
import { User, Lock, Bell, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useAuthStore } from '../store/authStore';
import { profileService, Profile } from '../services/supabaseService';

const Settings = () => {
  const { user, logout, refreshUserData } = useAuthStore();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Form state
  const [name, setName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [applicationUpdates, setApplicationUpdates] = useState(true);
  const [propertyUpdates, setPropertyUpdates] = useState(true);
  
  const fetchProfile = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const profileData = await profileService.getCurrentProfile();
      
      if (profileData) {
        setProfile(profileData);
        setName(profileData.name || '');
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
  
  const handleRefreshUserData = async () => {
    setIsRefreshing(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Refresh user data from Supabase Auth
      await refreshUserData();
      
      // Refresh profile data from database
      await fetchProfile();
      
      setSuccess('User data refreshed successfully.');
    } catch (err) {
      setError('Failed to refresh user data. Please try again.');
      console.error('User data refresh error:', err);
    } finally {
      setIsRefreshing(false);
    }
  };
  
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profile) return;
    
    setIsSaving(true);
    setError(null);
    setSuccess(null);
    
    try {
      const updatedProfile = await profileService.updateProfile({
        name,
      });
      
      if (updatedProfile) {
        setProfile(updatedProfile);
        setSuccess('Profile updated successfully.');
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (err) {
      setError('Failed to update profile. Please try again.');
      console.error('Profile update error:', err);
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }
    
    setIsSaving(true);
    setError(null);
    setSuccess(null);
    
    try {
      // In a real app, you would call an API to change the password
      // For this demo, we'll just simulate a successful password change
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess('Password changed successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError('Failed to change password. Please try again.');
      console.error('Password change error:', err);
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleSaveNotificationSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSaving(true);
    setError(null);
    setSuccess(null);
    
    try {
      // In a real app, you would call an API to save notification settings
      // For this demo, we'll just simulate a successful save
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess('Notification settings saved successfully.');
    } catch (err) {
      setError('Failed to save notification settings. Please try again.');
      console.error('Notification settings error:', err);
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleDeleteAccount = async () => {
    // In a real app, you would call an API to delete the account
    // For this demo, we'll just log out the user
    try {
      await logout();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };
  
  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-orange-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="text-slate-400">Manage your account settings and preferences</p>
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
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <div className="flex items-center mb-6">
              <div className="bg-blue-500/20 p-2 rounded-full mr-4">
                <User size={24} className="text-blue-500" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Profile Information</h2>
                <p className="text-slate-400">Update your personal information</p>
              </div>
            </div>
            
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
                  Full Name
                </label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="bg-slate-800/50 text-slate-400"
                />
                <p className="text-xs text-slate-500 mt-1">Email address cannot be changed</p>
              </div>
              
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-slate-300 mb-2">
                  Account Type
                </label>
                <Input
                  id="role"
                  type="text"
                  value={profile?.role === 'property-owner' ? 'Property Owner' : profile?.role === 'administrator' ? 'Administrator' : 'Tenant'}
                  disabled
                  className="bg-slate-800/50 text-slate-400"
                />
                <p className="text-xs text-slate-500 mt-1">Account type cannot be changed</p>
              </div>
              
              <div className="pt-4">
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isSaving}
                  disabled={isSaving}
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </Card>
          
          <Card>
            <div className="flex items-center mb-6">
              <div className="bg-purple-500/20 p-2 rounded-full mr-4">
                <Lock size={24} className="text-purple-500" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Password</h2>
                <p className="text-slate-400">Update your password</p>
              </div>
            </div>
            
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-slate-300 mb-2">
                  Current Password
                </label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter your current password"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-slate-300 mb-2">
                  New Password
                </label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter your new password"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300 mb-2">
                  Confirm New Password
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your new password"
                  required
                />
              </div>
              
              <div className="pt-4">
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isSaving}
                  disabled={isSaving}
                >
                  Change Password
                </Button>
              </div>
            </form>
          </Card>
          
          <Card>
            <div className="flex items-center mb-6">
              <div className="bg-amber-500/20 p-2 rounded-full mr-4">
                <Bell size={24} className="text-amber-500" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Notification Settings</h2>
                <p className="text-slate-400">Manage your notification preferences</p>
              </div>
            </div>
            
            <form onSubmit={handleSaveNotificationSettings} className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-white/5">
                <div>
                  <h3 className="text-white font-medium">Email Notifications</h3>
                  <p className="text-slate-400 text-sm">Receive notifications via email</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={emailNotifications}
                    onChange={() => setEmailNotifications(!emailNotifications)}
                  />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between py-3 border-b border-white/5">
                <div>
                  <h3 className="text-white font-medium">Application Updates</h3>
                  <p className="text-slate-400 text-sm">Receive updates about your applications</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={applicationUpdates}
                    onChange={() => setApplicationUpdates(!applicationUpdates)}
                  />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between py-3">
                <div>
                  <h3 className="text-white font-medium">Property Updates</h3>
                  <p className="text-slate-400 text-sm">Receive updates about your properties</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={propertyUpdates}
                    onChange={() => setPropertyUpdates(!propertyUpdates)}
                  />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                </label>
              </div>
              
              <div className="pt-4">
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isSaving}
                  disabled={isSaving}
                >
                  Save Preferences
                </Button>
              </div>
            </form>
          </Card>
        </div>
        
        <div>
          <Card>
            <h2 className="text-xl font-bold text-white mb-4">Account Actions</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-white font-medium mb-2">Refresh User Data</h3>
                <p className="text-slate-400 text-sm mb-4">
                  If your name or role has been updated in the database but is not showing correctly, 
                  click this button to refresh your user data and display the latest information.
                  <span className="block mt-2 text-amber-400">
                    Note: After refreshing your data, you may need to reload the page to see the changes in the navigation bar.
                  </span>
                </p>
                <Button
                  variant="primary"
                  className="flex items-center"
                  onClick={handleRefreshUserData}
                  isLoading={isRefreshing}
                  disabled={isRefreshing}
                >
                  {!isRefreshing && <RefreshCw size={16} className="mr-2" />}
                  Refresh User Data
                </Button>
              </div>
              
              <div className="pt-4 border-t border-white/5">
                <h3 className="text-white font-medium mb-2">Delete Account</h3>
                <p className="text-slate-400 text-sm mb-4">
                  Permanently delete your account and all associated data. This action cannot be undone.
                </p>
                <Button
                  variant="outline"
                  className="text-red-500 border-red-500/20 hover:bg-red-500/10"
                  onClick={handleDeleteAccount}
                >
                  Delete Account
                </Button>
              </div>
              
              <div className="pt-4 border-t border-white/5">
                <h3 className="text-white font-medium mb-2">Export Data</h3>
                <p className="text-slate-400 text-sm mb-4">
                  Download a copy of your personal data.
                </p>
                <Button variant="secondary">
                  Export Data
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;
