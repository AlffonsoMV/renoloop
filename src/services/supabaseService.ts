import { supabase } from '../lib/supabase';

// Profile types
export interface Profile {
  id: string;
  name: string;
  role: 'property-owner' | 'tenant' | 'administrator';
  created_at?: string;
  updated_at?: string;
}

// Property types
export interface Property {
  id: string;
  owner_id: string;
  address: string;
  city: string;
  postal_code: string;
  country: string;
  description?: string;
  status: 'pending' | 'approved' | 'renovating' | 'available' | 'occupied';
  building_age?: string;
  current_epc?: string;
  has_heating_issues?: boolean;
  has_insulation_issues?: boolean;
  has_ventilation_issues?: boolean;
  created_at?: string;
  updated_at?: string;
}

// Application types
export interface Application {
  id: string;
  property_id: string;
  tenant_id: string;
  status: 'pending' | 'approved' | 'rejected';
  message?: string;
  created_at?: string;
  updated_at?: string;
}

// Profile services
export const profileService = {
  // Get the current user's profile
  async getCurrentProfile(): Promise<Profile | null> {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) return null;
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();
    
    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
    
    return data;
  },
  
  // Update the current user's profile
  async updateProfile(profile: Partial<Profile>): Promise<Profile | null> {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) return null;
    
    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...profile,
        updated_at: new Date().toISOString(),
      })
      .eq('id', session.user.id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating profile:', error);
      return null;
    }
    
    // Create a notification for the user
    if (data) {
      try {
        await notificationService.addNotification({
          user_id: session.user.id,
          title: 'Profile Updated',
          message: 'Your profile information has been successfully updated.',
          type: 'success',
        });
      } catch (err) {
        console.error('Error creating notification for profile update:', err);
        // Don't fail the profile update if notification fails
      }
    }
    
    return data;
  },
};

// Property services
export const propertyService = {
  // Create a new property
  async createProperty(
    property: Omit<Property, "id" | "owner_id" | "created_at" | "updated_at">
  ): Promise<Property | null> {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      throw new Error("You must be logged in to create a property");
    }

    // Check if user has a profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, role")
      .eq("id", session.user.id)
      .single();

    if (profileError) {
      console.error("Error fetching profile:", profileError);
      throw new Error(`Profile check failed: ${profileError.message}`);
    }

    if (!profile) {
      throw new Error(
        "User profile not found. Please complete your profile first."
      );
    }

    if (profile.role !== "property-owner") {
      throw new Error("Only property owners can create properties.");
    }

    const { data, error } = await supabase
      .from("properties")
      .insert({
        ...property,
        owner_id: session.user.id,
        status: "pending",
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating property:", error);
      throw new Error(`Failed to create property: ${error.message}`);
    }

    // Create a notification for the property owner
    if (data) {
      try {
        await notificationService.addNotification({
          user_id: session.user.id,
          title: "Property Registration Submitted",
          message: `Your property at ${data.address} has been registered and is pending approval. We'll notify you once it's approved.`,
          type: "info",
        });
      } catch (err) {
        console.error("Error creating notification for property owner:", err);
        // Don't fail the property creation if notification fails
      }
    }

    return data;
  },

  // Delete a property
  async deleteProperty(id: string): Promise<boolean> {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) return false;

    // Get property details before deleting
    const { data: property } = await supabase
      .from("properties")
      .select("address")
      .eq("id", id)
      .eq("owner_id", session.user.id)
      .single();

    if (!property) {
      console.error("Property not found or not owned by user");
      return false;
    }

    const { error } = await supabase
      .from("properties")
      .delete()
      .eq("id", id)
      .eq("owner_id", session.user.id);

    if (error) {
      console.error("Error deleting property:", error);
      return false;
    }

    // Create a notification for the property owner
    try {
      await notificationService.addNotification({
        user_id: session.user.id,
        title: "Property Deleted",
        message: `Your property at ${property.address} has been successfully deleted.`,
        type: "info",
      });
    } catch (err) {
      console.error("Error creating notification for property deletion:", err);
      // Don't fail the property deletion if notification fails
    }

    return true;
  },

  // Get properties owned by the current user
  async getMyProperties(): Promise<Property[]> {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) return [];

    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("owner_id", session.user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching properties:", error);
      return [];
    }

    return data || [];
  },

  // Get available properties (for tenants)
  async getAvailableProperties(role: string | undefined): Promise<Property[]> {
    if (role !== "administrator") {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching available properties:", error);
        return [];
      }

      return data || [];
    }

    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("status", "available")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching available properties:", error);
      return [];
    }

    return data || [];
  },

  // Get a specific property by ID
  async getPropertyById(id: string): Promise<Property | null> {
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching property:", error);
      return null;
    }

    return data;
  },

  // Update a property
  async updateProperty(
    id: string,
    property: Partial<Property>
  ): Promise<Property | null> {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) return null;

    const { data, error } = await supabase
      .from("properties")
      .update({
        ...property,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating property:", error);
      return null;
    }

    // Create a notification for the property owner
    if (data) {
      try {
        await notificationService.addNotification({
          user_id: session.user.id,
          title: "Property Updated",
          message: `Your property at ${data.address} has been successfully updated.`,
          type: "success",
        });
      } catch (err) {
        console.error("Error creating notification for property update:", err);
        // Don't fail the property update if notification fails
      }
    }

    return data;
  },
};

// Application services
export const applicationService = {
  // Create a new application
  async createApplication(application: Omit<Application, 'id' | 'tenant_id' | 'status' | 'created_at' | 'updated_at'>): Promise<Application | null> {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) return null;
    
    const { data, error } = await supabase
      .from('applications')
      .insert({
        ...application,
        tenant_id: session.user.id,
        status: 'pending',
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating application:', error);
      return null;
    }
    
    // Create a notification for the property owner
    if (data) {
      try {
        // First get the property to find the owner
        const property = await propertyService.getPropertyById(data.property_id);
        
        if (property) {
          // Get user profile to include name in notification
          const { data: profileData } = await supabase
            .from('profiles')
            .select('name')
            .eq('id', session.user.id)
            .single();
          
          const applicantName = profileData?.name || 'A tenant';
          
          // Create notification for property owner
          await notificationService.addNotification({
            user_id: property.owner_id,
            title: 'New Application Received',
            message: `${applicantName} has submitted an application for your property at ${property.address}.`,
            type: 'info',
          });
        }
      } catch (err) {
        console.error('Error creating notification for property owner:', err);
        // Don't fail the application creation if notification fails
      }
    }
    
    return data;
  },
  
  // Get applications submitted by the current user (for tenants)
  async getMyApplications(): Promise<Application[]> {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) return [];
    
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .eq('tenant_id', session.user.id)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching applications:', error);
      return [];
    }
    
    return data || [];
  },
  
  // Get applications for properties owned by the current user (for property owners)
  async getApplicationsForMyProperties(): Promise<Application[]> {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) return [];
    
    // First get the user's properties
    const { data: properties, error: propertiesError } = await supabase
      .from('properties')
      .select('id')
      .eq('owner_id', session.user.id);
    
    if (propertiesError || !properties.length) {
      console.error('Error fetching properties:', propertiesError);
      return [];
    }
    
    // Then get applications for those properties
    const propertyIds = properties.map(p => p.id);
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .in('property_id', propertyIds)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching applications:', error);
      return [];
    }
    
    return data || [];
  },
  
  // Update an application status (for property owners)
  async updateApplicationStatus(id: string, status: 'approved' | 'rejected'): Promise<Application | null> {
    const { data, error } = await supabase
      .from('applications')
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating application:', error);
      return null;
    }
    
    // Create a notification for the tenant
    if (data) {
      const notificationTitle = status === 'approved' 
        ? 'Application Approved' 
        : 'Application Rejected';
      
      const notificationMessage = status === 'approved'
        ? 'Your application has been approved! You can now proceed with the next steps.'
        : 'Your application has been rejected. Please check your email for more details.';
      
      const notificationType = status === 'approved' ? 'success' : 'error';
      
      // Add notification
      await notificationService.addNotification({
        user_id: data.tenant_id,
        title: notificationTitle,
        message: notificationMessage,
        type: notificationType,
      });
    }
    
    return data;
  },
};

// Notification types
export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  is_read: boolean;
  created_at?: string;
}

// Notification services
export const notificationService = {
  // Add a new notification
  async addNotification(notification: Omit<Notification, 'id' | 'is_read' | 'created_at'>): Promise<Notification | null> {
    const { data, error } = await supabase
      .from('notifications')
      .insert({
        ...notification,
        is_read: false,
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating notification:', error);
      return null;
    }
    
    return data;
  },
  
  // Get notifications for the current user
  async getNotifications(limit: number = 10): Promise<Notification[]> {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) return [];
    
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
    
    return data || [];
  },
  
  // Mark a notification as read
  async markAsRead(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id);
    
    if (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }
    
    return true;
  },
  
  // Mark all notifications as read
  async markAllAsRead(): Promise<boolean> {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) return false;
    
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', session.user.id)
      .eq('is_read', false);
    
    if (error) {
      console.error('Error marking all notifications as read:', error);
      return false;
    }
    
    return true;
  },
  
  // Delete a notification
  async deleteNotification(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting notification:', error);
      return false;
    }
    
    return true;
  },
  
  // Delete all notifications
  async deleteAllNotifications(): Promise<boolean> {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) return false;
    
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('user_id', session.user.id);
    
    if (error) {
      console.error('Error deleting all notifications:', error);
      return false;
    }
    
    return true;
  },
};
