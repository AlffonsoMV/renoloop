import React, { useState, useEffect } from 'react';
import { Bell, CheckCheck, Clock, AlertCircle, CheckCircle, Trash2 } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { supabase } from '../lib/supabase';

interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  is_read: boolean;
  created_at: string;
}

const NotificationsPage = () => {
  const { user } = useAuthStore();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        setNotifications(data || []);
      } catch (err) {
        setError('Failed to load notifications. Please try again.');
        console.error('Error fetching notifications:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchNotifications();
    
    // Set up real-time subscription for new notifications
    const subscription = supabase
      .channel('notifications_page')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'notifications',
        filter: `user_id=eq.${user?.id}` 
      }, (payload) => {
        // Add new notification to the list
        const newNotification = payload.new as Notification;
        setNotifications(prev => [newNotification, ...prev]);
      })
      .subscribe();
    
    return () => {
      subscription.unsubscribe();
    };
  }, [user]);
  
  const handleMarkAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      setNotifications(notifications.map(n => 
        n.id === id ? { ...n, is_read: true } : n
      ));
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };
  
  const handleMarkAllAsRead = async () => {
    if (!user || notifications.length === 0) return;
    
    setActionLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user.id)
        .eq('is_read', false);
      
      if (error) throw error;
      
      // Update local state
      setNotifications(notifications.map(n => ({ ...n, is_read: true })));
      setSuccess('All notifications marked as read.');
    } catch (err) {
      setError('Failed to mark notifications as read. Please try again.');
      console.error('Error marking all notifications as read:', err);
    } finally {
      setActionLoading(false);
    }
  };
  
  const handleDeleteAll = async () => {
    if (!user || notifications.length === 0) return;
    
    setActionLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      // Update local state
      setNotifications([]);
      setSuccess('All notifications deleted.');
    } catch (err) {
      setError('Failed to delete notifications. Please try again.');
      console.error('Error deleting all notifications:', err);
    } finally {
      setActionLoading(false);
    }
  };
  
  const handleDeleteNotification = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      setNotifications(notifications.filter(n => n.id !== id));
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  };
  
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCheck size={20} className="text-green-500" />;
      case 'warning':
        return <AlertCircle size={20} className="text-yellow-500" />;
      case 'error':
        return <AlertCircle size={20} className="text-red-500" />;
      case 'info':
      default:
        return <Clock size={20} className="text-blue-500" />;
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };
  
  const getUnreadCount = () => {
    return notifications.filter(n => !n.is_read).length;
  };
  
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Notifications</h1>
          <p className="text-slate-400">Manage your notifications and alerts</p>
        </div>
        
        <div className="flex space-x-4">
          {getUnreadCount() > 0 && (
            <Button 
              variant="secondary" 
              onClick={handleMarkAllAsRead}
              isLoading={actionLoading}
              disabled={actionLoading}
            >
              <CheckCircle size={18} className="mr-2" />
              Mark All as Read
            </Button>
          )}
          
          {notifications.length > 0 && (
            <Button 
              variant="outline" 
              className="text-red-500 border-red-500/20 hover:bg-red-500/10"
              onClick={handleDeleteAll}
              isLoading={actionLoading}
              disabled={actionLoading}
            >
              <Trash2 size={18} className="mr-2" />
              Delete All
            </Button>
          )}
        </div>
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
      
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin h-12 w-12 border-4 border-orange-500 border-t-transparent rounded-full"></div>
        </div>
      ) : notifications.length === 0 ? (
        <Card className="text-center py-12">
          <Bell size={48} className="mx-auto mb-4 text-slate-400" />
          <h3 className="text-xl font-bold text-white mb-2">No Notifications</h3>
          <p className="text-slate-400 mb-6">You don't have any notifications yet.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <Card 
              key={notification.id} 
              className={`hover:border-orange-500/30 transition-colors ${!notification.is_read ? 'bg-orange-500/5 border-orange-500/20' : ''}`}
            >
              <div className="flex items-start">
                <div className="mr-4 p-2 rounded-full bg-slate-800">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-xl font-bold text-white">{notification.title}</h3>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-slate-500">{formatDate(notification.created_at)}</span>
                      <div className="flex space-x-2">
                        {!notification.is_read && (
                          <button 
                            className="p-1 text-slate-400 hover:text-white rounded-full hover:bg-white/5"
                            onClick={() => handleMarkAsRead(notification.id)}
                            title="Mark as read"
                          >
                            <CheckCircle size={18} />
                          </button>
                        )}
                        <button 
                          className="p-1 text-slate-400 hover:text-red-500 rounded-full hover:bg-white/5"
                          onClick={() => handleDeleteNotification(notification.id)}
                          title="Delete notification"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                  <p className="text-slate-300">{notification.message}</p>
                  {!notification.is_read && (
                    <div className="mt-4">
                      <span className="inline-block px-3 py-1 bg-orange-500/20 text-orange-500 text-xs rounded-full">
                        New
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
