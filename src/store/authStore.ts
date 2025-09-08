import { create } from 'zustand';
import { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, supabase: any) => Promise<{ success: boolean; error?: string; errorType?: string }>;
  logout: (supabase: any) => Promise<void>;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false, // Start with false to reduce initial loading time
  
  login: async (email: string, password: string, supabase: any) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error);
        
        // Handle specific error types
        if (error.message === 'Email not confirmed') {
          return { 
            success: false, 
            error: 'Please check your email and click the confirmation link before signing in.',
            errorType: 'email_not_confirmed'
          };
        }
        
        if (error.message === 'Invalid login credentials') {
          return { 
            success: false, 
            error: 'Invalid email or password. Please check your credentials and try again.',
            errorType: 'invalid_credentials'
          };
        }
        
        return { 
          success: false, 
          error: error.message || 'Login failed. Please check your credentials.' 
        };
      }

      if (data.user) {
        set({ user: data.user, isAuthenticated: true });
        return { success: true };
      }

      return { 
        success: false, 
        error: 'Login failed. No user data received.' 
      };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'An unexpected error occurred during login.' 
      };
    }
  },

  logout: async (supabase: any) => {
    try {
      await supabase.auth.signOut();
      set({ user: null, isAuthenticated: false });
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  setUser: (user: User | null) => {
    set({ user, isAuthenticated: !!user, isLoading: false });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },
}));