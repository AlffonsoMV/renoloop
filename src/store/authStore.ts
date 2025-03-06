import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { supabase } from '../lib/supabase';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'property-owner' | 'tenant' | 'administrator';
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  register: (email: string, password: string, name: string, role: 'property-owner' | 'tenant' | 'administrator') => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
  refreshUserData: () => Promise<void>;
}

// Helper function to clear auth storage
const clearAuthStorage = () => {
  localStorage.removeItem('auth-storage');
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      register: async (email, password, name, role) => {
        set({ isLoading: true, error: null });
        
        try {
          // Register user with Supabase Auth
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                name,
                role,
              },
            },
          });
          
          if (error) throw error;
          
          if (data.user) {
            // Update auth state
            set({
              user: {
                id: data.user.id,
                email: data.user.email || '',
                name: data.user.user_metadata.name || '',
                role: data.user.user_metadata.role || 'property-owner',
              },
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            // Email confirmation might be required
            set({
              isLoading: false,
              error: 'Please check your email to confirm your registration',
            });
          }
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Registration failed', 
            isLoading: false 
          });
        }
      },

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        
        try {
          // Sign in with Supabase Auth
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          
          if (error) throw error;
          
          if (data.user) {
            // Update auth state
            set({
              user: {
                id: data.user.id,
                email: data.user.email || '',
                name: data.user.user_metadata.name || '',
                role: data.user.user_metadata.role || 'property-owner',
              },
              isAuthenticated: true,
              isLoading: false,
            });
          }
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Login failed', 
            isLoading: false 
          });
        }
      },

      logout: async () => {
        set({ isLoading: true });
        
        try {
          // Sign out from Supabase Auth
          const { error } = await supabase.auth.signOut();
          
          if (error) throw error;
          
          // Update auth state
          set({
            user: null,
            isAuthenticated: false,
            error: null,
            isLoading: false,
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Logout failed', 
            isLoading: false 
          });
        }
      },

      checkSession: async () => {
        set({ isLoading: true });
        
        try {
          // Get current session from Supabase Auth
          const { data, error } = await supabase.auth.getSession();
          
          if (error) throw error;
          
          if (data.session) {
            const user = data.session.user;
            
            // Get the latest user data from the profiles table
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', user.id)
              .single();
              
            if (profileError) {
              console.error('Error fetching profile during session check:', profileError);
            }
            
            // Update auth state with the latest user data
            // Use profile data if available, otherwise use user metadata
            const updatedUser = {
              id: user.id,
              email: user.email || '',
              name: profileData?.name || user.user_metadata.name || '',
              role: profileData?.role || user.user_metadata.role || 'property-owner',
            };
            
            // Update auth state
            set({
              user: updatedUser,
              isAuthenticated: true,
              isLoading: false,
            });
            
            console.log('Session checked, user data:', updatedUser);
          } else {
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
            });
          }
        } catch (error) {
          console.error('Error checking session:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Session check failed', 
            isLoading: false,
            user: null,
            isAuthenticated: false,
          });
        }
      },
      
      refreshUserData: async () => {
        set({ isLoading: true, error: null });
        
        try {
          // First, get the current session
          const { data: sessionData } = await supabase.auth.getSession();
          
          if (!sessionData.session) {
            throw new Error('No active session found');
          }
          
          // Refresh the session to get the latest user metadata
          const { data, error } = await supabase.auth.refreshSession();
          
          if (error) throw error;
          
          if (data.session) {
            const user = data.session.user;
            
            // Get the latest user data from the profiles table
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', user.id)
              .single();
              
            if (profileError) {
              console.error('Error fetching profile:', profileError);
            }
            
            // Update auth state with the latest user data
            // Use profile data if available, otherwise use user metadata
            const updatedUser = {
              id: user.id,
              email: user.email || '',
              name: profileData?.name || user.user_metadata.name || '',
              role: profileData?.role || user.user_metadata.role || 'property-owner',
            };
            
            // Force a complete state update to ensure reactivity
            set(state => ({
              ...state,
              user: updatedUser,
              isAuthenticated: true,
              isLoading: false,
            }));
            
            // Clear the persisted state to force a fresh load on page refresh
            clearAuthStorage();
            
            // Log the updated user data for debugging
            console.log('User data refreshed:', updatedUser);
          } else {
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
            });
          }
        } catch (error) {
          console.error('Error refreshing user data:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to refresh user data', 
            isLoading: false 
          });
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        user: state.user,
        isAuthenticated: state.isAuthenticated
      }),
    }
  )
);
