// src/api/useAuth.js
import { useState, useEffect } from "react";
import { supabase } from "./client";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (id) => {
    if (!id) return null;
    try {
      const { data, error } = await supabase
        .from("users")
        .select(
          `
        id,
        name,
        lastname1,
        lastname2,
        role_id,
        roles (
          role
        )
      `,
        )
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        return {
          ...data,
          role: data.roles?.role || "cajero",
        };
      }

      return null;
    } catch (error) {
      console.error("Error en fetchProfile:", error.message);
      return null;
    }
  };

  useEffect(() => {
    let isMounted = true;

    const initialize = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session && isMounted) {
          const profile = await fetchProfile(session.user.id);
          setUser(profile);
        }
      } catch (err) {
        console.error("Error inicializando auth:", err);
      } finally {
        if (isMounted) setLoading(false); // Cerramos carga pase lo que pase
      }
    };

    initialize();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // Log para debuggear en consola
        console.log("Evento Auth:", event);

        if (session) {
          const profile = await fetchProfile(session.user.id);
          if (isMounted) {
            setUser(profile);
            setLoading(false);
          }
        } else {
          if (isMounted) {
            setUser(null);
            setLoading(false);
          }
        }
      },
    );

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return { user, login, logout, loading };
};
