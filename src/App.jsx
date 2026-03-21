import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/sidebar";
import POS from "./pages/POS";
import TarjetasCliente from "./pages/TarjetasCliente";
import Login from "./pages/Login"; // Asegúrate de crear este archivo
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { useAuth } from "./api/useAuth";

export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Cargando sistema...</div>;
  }

  return (
    <Router>
      <div className="flex min-h-screen bg-[#f8fafc]">
        {/* El Sidebar solo se muestra si hay un usuario logueado */}
        {user && <Sidebar />} 
        
        <main className="flex-1">
          <Routes>
            {/* Ruta Pública: Login */}
            <Route 
              path="/login" 
              element={!user ? <Login /> : <Navigate to="/" />} 
            />

            {/* Rutas Protegidas (Requieren Login) */}
            <Route path="/" element={
              <ProtectedRoute>
                <POS />
              </ProtectedRoute>
            } />

            <Route path="/clientes" element={
              <ProtectedRoute>
                <TarjetasCliente />
              </ProtectedRoute>
            } />

            {/* Ruta Solo para Admins */}
            <Route path="/inventario" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <div className="p-6">
                  <h1 className="text-2xl font-bold">Panel de Inventario</h1>
                  <p>Solo el administrador puede ver esto.</p>
                </div>
              </ProtectedRoute>
            } />

            {/* Redirección por defecto si la ruta no existe */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}