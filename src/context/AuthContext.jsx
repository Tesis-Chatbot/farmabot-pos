import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../api/client";

const AuthContext = createContext();

export const ROLES = {
  ADMIN: "admin",
  CAJERO: "cajero",
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (authUuid) => {
    if (!authUuid) return null;
    try {
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select(
          `
        id, 
        uuid, 
        name, 
        lastname1, 
        lastname2, 
        role_id, 
        roles ( role )
      `,
        )
        .eq("uuid", authUuid)
        .maybeSingle();

      if (userError) throw userError;
      if (!userData) return null;
      const { data: cashierData, error: cashierError } = await supabase
        .from("cashiers")
        .select("store_id, employee_code, pos_terminal")
        .eq("user_id", userData.id)
        .maybeSingle();

      if (cashierError) {
        console.error("Error buscando en cashiers:", cashierError.message);
      }

      return {
        id: userData.id,
        uuid: userData.uuid,
        name: userData.name,
        full_name: `${userData.name} ${userData.lastname1 || ""}`.trim(),
        role: userData.roles?.role || ROLES.CAJERO,
        store_id: cashierData?.store_id || null,
        employee_code: cashierData?.employee_code || null,
        pos_terminal: cashierData?.pos_terminal || null,
      };
    } catch (error) {
      console.error("Error crítico en fetchProfile:", error.message);
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
          // session.user.id es el UUID de Auth
          const profile = await fetchProfile(session.user.id);
          setUser(profile);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    initialize();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          const profile = await fetchProfile(session.user.id);
          setUser(profile);
        } else {
          setUser(null);
        }
        setLoading(false);
      },
    );

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
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

export const useAuthContext = () => useContext(AuthContext);
