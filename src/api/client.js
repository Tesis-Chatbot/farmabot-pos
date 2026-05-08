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

// INTERCEPTOR CORREGIDO: Sin async/await para evitar bloqueos de red
api.interceptors.request.use(
  (config) => {
    try {
      // Buscamos la sesión directamente en el almacenamiento de Supabase
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
    // El log ahora debería aparecer justo antes de que veas la petición en Network
    console.log("🚀 Disparando petición a la API...");
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

/**
 * Obtiene el catálogo de tipos de promoción (1-4)
 * Útil para llenar un <select> en el formulario
 */
export const getPromotionTypes = async () => {
  try {
    const response = await api.get("/promotion_types"); // Asumiendo que tienes este endpoint simple
    return response.data;
  } catch (error) {
    console.error("Error al obtener tipos de promoción:", error);
    throw error;
  }
};

/**
 * Crea o actualiza una promoción para un medicamento específico.
 * Solo permite una promoción activa por barcode.
 * @param {Object} promoData { barcode, promotion_type, amount, active }
 */
export const upsertPromotion = async (promoData) => {
  try {
    console.log("Enviando promoción a la API...", promoData);
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

/**
 * Obtiene la lista de medicamentos que tienen promociones vigentes
 */
export const getActivePromotions = async () => {
  try {
    const response = await api.get("/promociones/activas");
    return response.data;
  } catch (error) {
    console.error("Error al obtener promociones activas:", error);
    throw error;
  }
};

/**
 * Procesa la venta final en el POS (Con stock y folio)
 * @param {Object} saleData { items, total, store_id, card_number }
 */
export const postSale = async (saleData) => {
  try {
    const response = await api.post("/ventas", saleData);
    return response.data;
  } catch (error) {
    const errorMsg = error.response?.data?.detail || "Error en la transacción";
    console.error("Error en Venta:", errorMsg);
    throw new Error(errorMsg); // Lanzamos el error con el mensaje de la API (ej: stock insuficiente)
  }
};

export default api;
