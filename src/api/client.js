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

export const getMedicaments = async () => {
  try {
    const response = await api.get("/medicamentos");
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

export default api;
