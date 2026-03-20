import { useState, useEffect } from "react";
import { supabase } from "./client";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (uuid) => {
    try {
      const { data, error } = await supabase
        .from("users") // Tu tabla en public
        .select("*")
        .eq("uuid", uuid)
        .single();

      if (error) throw error;
      setUser(data);
    } catch (error) {
      console.error("Error cargando perfil:", error.message);
      setUser(null);
    }
  };

  useEffect(() => {
    // 1. Verificar sesión inicial
    const initializeAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        await fetchProfile(session.user.id);
      }
      setLoading(false);
    };

    initializeAuth();

    // 2. Escuchar cambios de estado (Login/Logout)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setLoading(true);
        if (session) {
          await fetchProfile(session.user.id);
        } else {
          setUser(null);
        }
        setLoading(false);
      },
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    // No hace falta hacer nada más, onAuthStateChange detectará el cambio
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return { user, login, logout, loading };
};
