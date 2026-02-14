import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: {
    "Content-Type": "application/json",
  },
});

// Función para obtener medicamentos usando la instancia
export const getMedicaments = async () => {
  try {
    const response = await api.get("/medicamentos");
    return response.data;
  } catch (error) {
    console.error("Error al obtener medicamentos:", error);
    throw error;
  }
};

// Función para obtener cliente usando la instancia
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