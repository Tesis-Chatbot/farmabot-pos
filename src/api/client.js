import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // FastAPI url
  headers: {
    "Content-Type": "application/json",
  },
});

async function getMedicament() {
  const response = await fetch(`${API_URL}/medicamentos`);
  const datos = await response.json();
  console.log(datos);
  return datos;
}



export default api;
