import axios from "axios";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// --- CONFIGURACIÓN DE AXIOS ---
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor opcional: Inyecta el token de Supabase en cada petición de Axios a FastAPI
api.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  return config;
});

// --- TUS FUNCIONES EXISTENTES ---
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
  try {
    const response = await api.get(`/clientes/${cardNumber}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener cliente:", error);
    throw error;
  }
};

export default api;