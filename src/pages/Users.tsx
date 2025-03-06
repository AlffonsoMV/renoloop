import React, { useState, useEffect } from 'react';
import { User as UserIcon, Check, X, Shield, Edit, Trash2, Search, Filter, AlertCircle } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import { Profile } from '../services/supabaseService';

const Users = () => {
  const { user } = useAuthStore();
  const [users, setUsers] = useState<Profile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    role: 'tenant' as 'property-owner' | 'tenant' | 'administrator',
  });
  
  // Check if current user is administrator
  useEffect(() => {
    if (user?.role !== 'administrator') {
      setError('You do not have permission to access this page.');
      setIsLoading(false);
      return;
    }
    
    fetchUsers();
  }, [user]);
  
  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real application, this would be a proper admin API endpoint
      // For this demo, we're using a direct Supabase query
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setUsers(data || []);
      setFilteredUsers(data || []);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Apply filters when search term or role filter changes
  useEffect(() => {
    let filtered = [...users];
    
    // Apply search filter
    if (searchTerm.trim() !== '') {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(searchLower) ||
        user.id.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply role filter
    if (roleFilter) {
      filtered = filtered.filter(user => user.role === roleFilter);
    }
    
    setFilteredUsers(filtered);
  }, [searchTerm, roleFilter, users]);
  
  const handleEditUser = (user: Profile) => {
    setSelectedUser(user);
    setEditForm({
      name: user.name,
      role: user.role as 'property-owner' | 'tenant' | 'administrator',
    });
    setIsEditing(true);
  };
  
  const handleSaveEdit = async () => {
    if (!selectedUser) return;
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: editForm.name,
          role: editForm.role,
          updated_at: new Date().toISOString(),
        })
        .eq('id', selectedUser.id);
      
      if (error) throw error;
      
      // Update local state
      setUsers(prevUsers => 
        prevUsers.map(u => 
          u.id === selectedUser.id 
            ? { ...u, name: editForm.name, role: editForm.role } 
            : u
        )
      );
      
      setIsEditing(false);
      setSelectedUser(null);
    } catch (err) {
      console.error('Error updating user:', err);
      setError('Failed to update user. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // In a real application, this would be a proper admin API endpoint
      // For this demo, we're using a direct Supabase query
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);
      
      if (error) throw error;
      
      // Update local state
      setUsers(prevUsers => prevUsers.filter(u => u.id !== userId));
      
      if (selectedUser?.id === userId) {
        setSelectedUser(null);
        setIsEditing(false);
      }
    } catch (err) {
      console.error('Error deleting user:', err);
      setError('Failed to delete user. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'administrator':
        return (
          <div className="bg-purple-500/20 text-purple-500 px-3 py-1 rounded-full text-sm inline-flex items-center">
            <Shield size={14} className="mr-1" />
            Administrator
          </div>
        );
      case 'property-owner':
        return (
          <div className="bg-blue-500/20 text-blue-500 px-3 py-1 rounded-full text-sm inline-flex items-center">
            <Check size={14} className="mr-1" />
            Property Owner
          </div>
        );
      case 'tenant':
        return (
          <div className="bg-green-500/20 text-green-500 px-3 py-1 rounded-full text-sm inline-flex items-center">
            <UserIcon size={14} className="mr-1" />
            Tenant
          </div>
        );
      default:
        return (
          <div className="bg-slate-500/20 text-slate-500 px-3 py-1 rounded-full text-sm inline-flex items-center">
            <X size={14} className="mr-1" />
            Unknown
          </div>
        );
    }
  };
  
  if (error && error.includes('permission')) {
    return (
      <div className="p-8">
        <Card className="text-center py-12">
          <AlertCircle size={48} className="mx-auto mb-4 text-red-500" />
          <h3 className="text-xl font-bold text-white mb-2">Access Denied</h3>
          <p className="text-slate-400 mb-6">
            You do not have permission to access this page. This page is only available to administrators.
          </p>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Manage Users</h1>
          <p className="text-slate-400">View and manage all users in the system</p>
        </div>
        
        <div>
          <Button variant="primary">
            <UserIcon size={18} className="mr-2" />
            Add New User
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card className="sticky top-8">
            <div className="mb-6">
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">
                  <Search size={20} />
                </div>
                <Input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-white">Filters</h3>
                <Button 
                  variant="outline" 
                  className="p-2 h-auto"
                  onClick={() => setRoleFilter('')}
                  disabled={!roleFilter}
                >
                  <Filter size={18} />
                </Button>
              </div>
              
              <div className="space-y-2">
                <button
                  className={`w-full p-3 rounded-xl text-left transition-colors ${
                    roleFilter === 'administrator' 
                      ? 'bg-purple-500/20 text-purple-500 border border-purple-500/30' 
                      : 'bg-white/5 text-slate-300 hover:bg-white/10'
                  }`}
                  onClick={() => setRoleFilter(roleFilter === 'administrator' ? '' : 'administrator')}
                >
                  <div className="flex items-center">
                    <Shield size={18} className="mr-2" />
                    <span>Administrators</span>
                  </div>
                </button>
                
                <button
                  className={`w-full p-3 rounded-xl text-left transition-colors ${
                    roleFilter === 'property-owner' 
                      ? 'bg-blue-500/20 text-blue-500 border border-blue-500/30' 
                      : 'bg-white/5 text-slate-300 hover:bg-white/10'
                  }`}
                  onClick={() => setRoleFilter(roleFilter === 'property-owner' ? '' : 'property-owner')}
                >
                  <div className="flex items-center">
                    <Check size={18} className="mr-2" />
                    <span>Property Owners</span>
                  </div>
                </button>
                
                <button
                  className={`w-full p-3 rounded-xl text-left transition-colors ${
                    roleFilter === 'tenant' 
                      ? 'bg-green-500/20 text-green-500 border border-green-500/30' 
                      : 'bg-white/5 text-slate-300 hover:bg-white/10'
                  }`}
                  onClick={() => setRoleFilter(roleFilter === 'tenant' ? '' : 'tenant')}
                >
                  <div className="flex items-center">
                    <UserIcon size={18} className="mr-2" />
                    <span>Tenants</span>
                  </div>
                </button>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-white mb-4">User Statistics</h3>
              <div className="space-y-4">
                <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Total Users</span>
                    <span className="text-white font-bold">{users.length}</span>
                  </div>
                </div>
                
                <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Property Owners</span>
                    <span className="text-white font-bold">
                      {users.filter(u => u.role === 'property-owner').length}
                    </span>
                  </div>
                </div>
                
                <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Tenants</span>
                    <span className="text-white font-bold">
                      {users.filter(u => u.role === 'tenant').length}
                    </span>
                  </div>
                </div>
                
                <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Administrators</span>
                    <span className="text-white font-bold">
                      {users.filter(u => u.role === 'administrator').length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          {isLoading ? (
            <Card className="flex items-center justify-center py-12">
              <div className="animate-spin h-12 w-12 border-4 border-orange-500 border-t-transparent rounded-full"></div>
            </Card>
          ) : error ? (
            <Card className="text-center py-12">
              <AlertCircle size={48} className="mx-auto mb-4 text-red-500" />
              <h3 className="text-xl font-bold text-white mb-2">Error Loading Users</h3>
              <p className="text-slate-400 mb-6">{error}</p>
              <Button 
                variant="primary" 
                onClick={fetchUsers}
              >
                Try Again
              </Button>
            </Card>
          ) : filteredUsers.length === 0 ? (
            <Card className="text-center py-12">
              <UserIcon size={48} className="mx-auto mb-4 text-slate-400" />
              <h3 className="text-xl font-bold text-white mb-2">No Users Found</h3>
              <p className="text-slate-400 mb-6">
                {searchTerm || roleFilter
                  ? 'No users match your search criteria. Try different filters.' 
                  : 'There are no users in the system yet.'}
              </p>
              {(searchTerm || roleFilter) && (
                <Button 
                  variant="secondary" 
                  onClick={() => {
                    setSearchTerm('');
                    setRoleFilter('');
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <Card 
                  key={user.id} 
                  className={`hover:border-orange-500/30 transition-colors ${
                    selectedUser?.id === user.id ? 'border-orange-500/50 bg-orange-500/5' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="bg-slate-700 h-12 w-12 rounded-full flex items-center justify-center text-white font-medium text-lg">
                        {user.name.charAt(0)}
                      </div>
                      
                      <div>
                        <h3 className="text-xl font-bold text-white">{user.name}</h3>
                        <p className="text-slate-400 text-sm mb-2">ID: {user.id.substring(0, 8)}...</p>
                        <div className="mb-2">
                          {getRoleBadge(user.role)}
                        </div>
                        <p className="text-slate-400 text-sm">
                          Joined: {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        className="p-2 h-auto w-auto"
                        onClick={() => handleEditUser(user)}
                      >
                        <Edit size={18} />
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="p-2 h-auto w-auto text-red-500 hover:bg-red-500/10 hover:border-red-500/30"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <Trash2 size={18} />
                      </Button>
                    </div>
                  </div>
                  
                  {isEditing && selectedUser?.id === user.id && (
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <h4 className="text-white font-medium mb-4">Edit User</h4>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">
                            Name
                          </label>
                          <Input
                            type="text"
                            value={editForm.name}
                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">
                            Role
                          </label>
                          <select
                            value={editForm.role}
                            onChange={(e) => setEditForm({ 
                              ...editForm, 
                              role: e.target.value as 'property-owner' | 'tenant' | 'administrator'
                            })}
                            className="w-full bg-white/5 backdrop-blur-lg text-white px-4 py-3 rounded-xl border border-white/10 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300"
                          >
                            <option value="tenant">Tenant</option>
                            <option value="property-owner">Property Owner</option>
                            <option value="administrator">Administrator</option>
                          </select>
                        </div>
                        
                        <div className="flex space-x-4">
                          <Button 
                            variant="outline" 
                            onClick={() => {
                              setIsEditing(false);
                              setSelectedUser(null);
                            }}
                          >
                            Cancel
                          </Button>
                          
                          <Button 
                            variant="primary"
                            onClick={handleSaveEdit}
                            disabled={!editForm.name.trim()}
                          >
                            Save Changes
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
      </div>
    </div>
  );
};

export default Users;
