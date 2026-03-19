import { useState, useEffect } from 'react';
import { supabase } from '../api/client';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Verificar sesión actual al cargar
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await fetchProfile(session.user.id);
      }
      setLoading(false);
    };

    getSession();

    // 2. Escuchar cambios (login/logout)
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        await fetchProfile(session.user.id);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => authListener.subscription.unsubscribe();
  }, []);

  const fetchProfile = async (uuid) => {
    const { data, error } = await supabase
      .from('users') // Tu tabla en public
      .select('*')
      .eq('uuid', uuid)
      .single();
    
    if (!error) setUser(data);
  };

  const login = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const logout = () => supabase.auth.signOut();

  return { user, login, logout, loading };
};