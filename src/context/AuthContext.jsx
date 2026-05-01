import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../api/client";

const AuthContext = createContext();

// Constantes de roles para evitar errores de dedo en toda la app
export const ROLES = {
  ADMIN: "admin",
  CAJERO: "cajero",
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (authId) => {
    if (!authId) return null;
    try {
      const { data, error } = await supabase
        .from("users")
        .select(
          `
        id,
        uuid,
        name,
        role_id,
        roles (
          role
        )
      `,
        )
        .eq("uuid", authId)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        return {
          ...data,
          role: data.roles?.role || ROLES.CAJERO,
        };
      }

      console.warn("No se encontró el perfil para el UUID:", authId);
      return null;
    } catch (error) {
      console.error("Error en fetchProfile:", error.message);
      return null;
    }
  };

  // Efecto para manejar el estado de la sesión de forma global
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
        if (isMounted) setLoading(false);
      }
    };

    initialize();

    // Listener de cambios de autenticación (Login, Logout, Token refreshed)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
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

  // Función de login optimizada para actualizar el estado inmediatamente
  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    // Actualización imperativa del estado para forzar la redirección en App.jsx
    if (data?.user) {
      const profile = await fetchProfile(data.user.id);
      setUser(profile);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para consumir el contexto de forma sencilla
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext debe usarse dentro de un AuthProvider");
  }
  return context;
};
