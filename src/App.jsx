import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/sidebar";
import POS from "./pages/POS";
import TarjetasCliente from "./pages/TarjetasCliente";
import Login from "./pages/Login";
import PromotionsAdmin from "./pages/PromocionesAdmin";
import ReportsDashboard from "./pages/Dashboard";
import Chatbot from "./pages/Chatbot";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { AuthProvider, useAuthContext, ROLES } from "./context/AuthContext";

function AppContent() {
  const { user, loading } = useAuthContext();
  console.log("Cambio de estado detectado:", { user, loading });
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#1e293b] text-white font-bold text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          Cargando sistema...
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      {user && <Sidebar />}
      <main className="flex-1 overflow-y-auto">
        <Routes>
          {/* Si ya hay usuario, no puede entrar al login */}
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />

          {/* Rutas Compartidas */}
          <Route path="/" element={<ProtectedRoute><POS /></ProtectedRoute>} />
          <Route path="/clientes" element={<ProtectedRoute><TarjetasCliente /></ProtectedRoute>} />
          <Route path="/chatbot" element={<ProtectedRoute><Chatbot /></ProtectedRoute>} />

          {/* Rutas Admin */}
          <Route path="/promociones" element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]}><PromotionsAdmin /></ProtectedRoute>} />
          <Route path="/reportes" element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]}><ReportsDashboard /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}