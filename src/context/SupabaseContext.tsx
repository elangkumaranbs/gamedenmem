import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';
import { useAuthStore } from '../store/authStore';

type SupabaseContextType = {
  supabase: SupabaseClient<Database> | null;
  loading: boolean;
};

const SupabaseContext = createContext<SupabaseContextType>({
  supabase: null,
  loading: true,
});

export const useSupabase = () => useContext(SupabaseContext);

export const SupabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [supabase, setSupabase] = useState<SupabaseClient<Database> | null>(null);
  const [loading, setLoading] = useState(true);
  const { setUser, setLoading: setAuthLoading } = useAuthStore();

  useEffect(() => {
    const initializeSupabase = async () => {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      if (supabaseUrl && supabaseAnonKey) {
        const client = createClient<Database>(supabaseUrl, supabaseAnonKey);
        setSupabase(client);

        // Get current session immediately
        try {
          const { data: { session }, error } = await client.auth.getSession();
          if (error) {
            // Check if the error is related to refresh token not found
            if (error.message?.includes('Refresh Token Not Found') || 
                error.message?.includes('refresh_token_not_found')) {
              // Clear invalid tokens by signing out
              await client.auth.signOut();
              setUser(null);
            } else {
              console.error('Error getting session:', error);
            }
          } else {
            setUser(session?.user ?? null);
          }
        } catch (error) {
          console.error('Session error:', error);
          // Also handle refresh token errors in catch block
          if (error instanceof Error && 
              (error.message?.includes('Refresh Token Not Found') || 
               error.message?.includes('refresh_token_not_found'))) {
            await client.auth.signOut();
          }
          setUser(null);
        }

        // Listen for auth changes
        const { data: { subscription } } = client.auth.onAuthStateChange(
          async (event, session) => {
            setUser(session?.user ?? null);
          }
        );

        setLoading(false);
        setAuthLoading(false);

        return () => subscription.unsubscribe();
      } else {
        console.error('Supabase credentials not found in environment variables');
        setLoading(false);
        setAuthLoading(false);
      }
    };

    initializeSupabase();
  }, [setUser, setAuthLoading]);

  return (
    <SupabaseContext.Provider value={{ supabase, loading }}>
      {children}
    </SupabaseContext.Provider>
  );
};