import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/sidebar"; // Importación correcta
import POS from "./pages/POS";
import TarjetasCliente from "./pages/TarjetasCliente";

export default function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-[#f8fafc]">
        {/* El Sidebar se renderiza aquí para todas las rutas */}
        <Sidebar /> 
        
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<POS />} />
            <Route path="/inventario" element={<div className="p-6">Pantalla de Inventario</div>} />
            <Route path="/clientes" element={<TarjetasCliente />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
} 