import { Navigate } from "react-router-dom";
import { AuthProvider, useAuthContext, ROLES } from "../../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuthContext();

  // 1. Mientras carga, no redirigimos a ningún lado
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <p className="text-slate-500 font-medium animate-pulse">
          Verificando acceso...
        </p>
      </div>
    );
  }

  // 2. Si terminó de cargar y NO hay usuario, al Login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 3. Si hay usuario pero no tiene el rol permitido, al Inicio (/)
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    console.warn(`Acceso denegado para el rol: ${user.role}`);
    return <Navigate to="/" replace />;
  }

  // 4. Si todo está ok, renderiza el componente (POS, Clientes, etc.)
  return children;
};

export default ProtectedRoute;
