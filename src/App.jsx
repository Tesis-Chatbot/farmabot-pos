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
    return (
      <div className="flex h-screen items-center justify-center bg-[#1e293b] text-white font-bold">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          Cargando sistema...
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="flex min-h-screen bg-[#f8fafc]">
        {user && <Sidebar />} 
        
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route 
              path="/login" 
              element={!user ? <Login /> : <Navigate to="/" />} 
            />

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

            <Route path="/reportes" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <div className="p-8">
                  <h1 className="text-2xl font-black text-gray-800">📊 Panel de Reportes</h1>
                  <p className="text-gray-500 mt-2">Bienvenido, administrador. Aquí verás las métricas.</p>
                </div>
              </ProtectedRoute>
            } />

            <Route path="/chatbot" element={
              <ProtectedRoute>
                <div className="p-8">
                  <h1 className="text-2xl font-black text-gray-800">🤖 Asistente Virtual</h1>
                  <p className="text-gray-500 mt-2">Configuración y entrenamiento del chatbot.</p>
                </div>
              </ProtectedRoute>
            } />

            <Route path="/inventario" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <div className="p-6">
                  <h1 className="text-2xl font-bold">Panel de Inventario</h1>
                </div>
              </ProtectedRoute>
            } />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}