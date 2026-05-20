import axios from "axios";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  timeout: 8000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    try {
      const storageKey = `sb-${new URL(supabaseUrl).hostname.split(".")[0]}-auth-token`;
      const sessionData = localStorage.getItem(storageKey);

      if (sessionData) {
        const parsed = JSON.parse(sessionData);
        const token = parsed?.access_token;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (err) {
      console.error("Error al recuperar token en interceptor:", err);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

/**
 * PASO 1: Registra las credenciales y el perfil humano del usuario
 */
export const createAccount = async (userData) => {
  const { email, password, name, lastname1, lastname2, role_id } = userData;

  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) throw authError;
    if (!authData?.user)
      throw new Error("No se generó la instancia de autenticación.");

    const { data: insertedUser, error: userError } = await supabase
      .from("users")
      .insert({
        name,
        lastname1,
        lastname2: lastname2 || null,
        uuid: authData.user.id,
        role_id: parseInt(role_id), // 1 = Admin, 2 = Cajero
      })
      .select()
      .single();

    if (userError) throw userError;
    return { success: true, data: insertedUser };
  } catch (error) {
    console.error("Error al crear cuenta:", error.message);
    throw error;
  }
};

/**
 * MÓDULO UNIFICADO: Registra la cuenta humana y asigna inmediatamente los datos del cajero.
 * Mantiene la compatibilidad con el componente unificado 'RegisterCashier.jsx'.
 */
export const registerCashier = async (userData) => {
  const { store_id, pos_terminal, employee_code } = userData;

  try {
    // 1. Delegamos la creación de la cuenta humana (Paso 1) forzando role_id a 2 (Cajero)
    const accountResult = await createAccount({ ...userData, role_id: 2 });
    const internalUserId = accountResult.data.id;

    // 2. Insertamos la configuración técnica de hardware (Paso 2)
    const { error: cashierError } = await supabase
      .from("cashiers")
      .insert({
        user_id: internalUserId,
        store_id: parseInt(store_id),
        pos_terminal: parseInt(pos_terminal),
        employee_code
      });

    if (cashierError) throw cashierError;

    return { success: true, message: "Cajero registrado exitosamente" };
  } catch (error) {
    console.error("Error en flujo secuencial de registro:", error.message);
    throw error;
  }
};

/**
 * Obtiene la lista de cajeros registrados con sus perfiles de usuario correspondientes
 */
export const getCashiersList = async () => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select(`
        id,
        name,
        lastname1,
        lastname2,
        uuid,
        role_id,
        cashiers (
          id,
          employee_code,
          pos_terminal,
          store_id
        )
      `);
      // .eq("role_id", 2); <--- COMENTA ESTA LÍNEA TEMPORALMENTE

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error al obtener lista de personal:", error.message);
    throw error;
  }
};

/**
 * Actualiza los datos operativos del cajero y los datos humanos de su perfil
 */
/**
 * Actualiza los datos humanos del usuario y realiza un upsert (inserta o actualiza)
 * en la tabla de datos operativos del cajero.
 */
export const updateCashier = async (cashierId, userId, updatedData) => {
  try {
    // 1. Actualizar datos humanos en public.users
    const { error: userError } = await supabase
      .from("users")
      .update({
        name: updatedData.name,
        lastname1: updatedData.lastname1,
        lastname2: updatedData.lastname2 || null
      })
      .eq("id", userId);

    if (userError) throw userError;

    // 2. Preparar el objeto para la tabla cashiers
    const cashierPayload = {
      user_id: userId,
      store_id: parseInt(updatedData.store_id),
      pos_terminal: parseInt(updatedData.pos_terminal),
      employee_code: updatedData.employee_code
    };

    // Si ya tenía un registro en cashiers, le pasamos el ID para que lo reemplace
    if (cashierId) {
      cashierPayload.id = cashierId;
    }

    // .upsert() insertará si el registro no existe, o lo actualizará si coincide el ID
    const { error: cashierError } = await supabase
      .from("cashiers")
      .upsert(cashierPayload);

    if (cashierError) throw cashierError;

    return { success: true };
  } catch (error) {
    console.error("Error al procesar cambios del cajero:", error.message);
    throw error;
  }
};

export const getMedicaments = async (storeId) => {
  try {
    const response = await api.get(`/medicamentos?store_id=${storeId}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener medicamentos:", error);
    throw error;
  }
};

export const getClientByCard = async (cardNumber) => {
  if (!cardNumber) throw new Error("Número de tarjeta requerido");

  try {
    const response = await api.get(`/clientes/${cardNumber}`);
    return response.data;
  } catch (error) {
    if (error.code === "ECONNABORTED") {
      throw new Error("El servidor tardó demasiado en responder (Timeout).");
    }
    console.error(
      "Error al obtener cliente:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

export const getPromotionTypes = async () => {
  try {
    const response = await api.get("/promotion_types");
    return response.data;
  } catch (error) {
    console.error("Error al obtener tipos de promoción:", error);
    throw error;
  }
};

export const upsertPromotion = async (promoData) => {
  try {
    const response = await api.post("/promociones", promoData);
    return response.data;
  } catch (error) {
    console.error(
      "Error al gestionar promoción:",
      error.response?.data?.detail || error.message,
    );
    throw error;
  }
};

export const getActivePromotions = async () => {
  try {
    const response = await api.get("/promociones/activas");
    return response.data;
  } catch (error) {
    console.error("Error al obtener promociones activas:", error);
    throw error;
  }
};

export const postSale = async (saleData) => {
  try {
    const response = await api.post("/ventas", saleData);
    return response.data;
  } catch (error) {
    const errorMsg = error.response?.data?.detail || "Error en la transacción";
    console.error("Error en Venta:", errorMsg);
    throw new Error(errorMsg);
  }
};

export default api;