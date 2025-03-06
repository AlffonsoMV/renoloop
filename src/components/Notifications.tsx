import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Bell, CheckCircle, Clock, AlertCircle, X } from 'lucide-react';
import { notificationService, Notification } from '../services/supabaseService';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';
import Button from './ui/Button';

const Notifications: React.FC = () => {
  const { user } = useAuthStore();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const unreadCount = notifications.filter(n => !n.is_read).length;
  
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) return;
      
      setIsLoading(true);
      
      try {
        const data = await notificationService.getNotifications(5);
        setNotifications(data);
      } catch (err) {
        console.error('Error fetching notifications:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchNotifications();
    
    // Set up real-time subscription for new notifications
    const subscription = supabase
      .channel('notifications_dropdown')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'notifications',
        filter: `user_id=eq.${user?.id}` 
      }, (payload: { new: Notification }) => {
        // Add new notification to the list
        const newNotification = payload.new;
        setNotifications(prev => [newNotification, ...prev.slice(0, 4)]);
      })
      .subscribe();
    
    return () => {
      subscription.unsubscribe();
    };
  }, [user]);
  
  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      
      // Update local state
      setNotifications(notifications.map(n => 
        n.id === id ? { ...n, is_read: true } : n
      ));
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };
  
  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      
      // Update local state
      setNotifications(notifications.map(n => ({ ...n, is_read: true })));
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    }
  };
  
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'warning':
        return <AlertCircle size={16} className="text-yellow-500" />;
      case 'error':
        return <AlertCircle size={16} className="text-red-500" />;
      case 'info':
      default:
        return <Clock size={16} className="text-blue-500" />;
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / 60000);
    const diffHours = Math.round(diffMs / 3600000);
    const diffDays = Math.round(diffMs / 86400000);
    
    if (diffMins < 60) {
      return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };
  
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="relative text-slate-400 hover:text-white cursor-pointer transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-slate-800 border border-white/10 rounded-xl shadow-lg z-50">
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <h3 className="text-white font-medium">Notifications</h3>
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <button
                  className="text-xs text-slate-400 hover:text-white"
                  onClick={handleMarkAllAsRead}
                >
                  Mark all as read
                </button>
              )}
              <Link to="/dashboard/notifications" onClick={() => setIsOpen(false)}>
                <button className="text-xs text-orange-500 hover:text-orange-400">
                  View all
                </button>
              </Link>
            </div>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center p-4">
                <div className="animate-spin h-5 w-5 border-2 border-orange-500 border-t-transparent rounded-full"></div>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-4 text-center">
                <p className="text-slate-400">No notifications yet</p>
              </div>
            ) : (
              <div>
                {notifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`p-4 border-b border-white/5 hover:bg-white/5 transition-colors ${!notification.is_read ? 'bg-orange-500/5' : ''}`}
                  >
                    <div className="flex items-start">
                      <div className="mr-3 mt-0.5">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h4 className="text-white text-sm font-medium">{notification.title}</h4>
                          {!notification.is_read && (
                            <button 
                              className="text-slate-400 hover:text-white p-1"
                              onClick={() => handleMarkAsRead(notification.id)}
                            >
                              <X size={14} />
                            </button>
                          )}
                        </div>
                        <p className="text-slate-400 text-xs mt-1">{notification.message}</p>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-slate-500 text-xs">
                            {formatDate(notification.created_at || '')}
                          </span>
                          {!notification.is_read && (
                            <span className="inline-block px-2 py-0.5 bg-orange-500/20 text-orange-500 text-xs rounded-full">
                              New
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="p-3 border-t border-white/10">
            <Link to="/dashboard/notifications" onClick={() => setIsOpen(false)}>
              <Button variant="secondary" fullWidth>
                View All Notifications
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;
