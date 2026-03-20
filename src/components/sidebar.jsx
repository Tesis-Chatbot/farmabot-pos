import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../api/useAuth";

const menuItems = [
  { icon: "🏪", label: "Caja", path: "/", roles: ["admin", "cajero"] },
  { icon: "👥", label: "Clientes", path: "/clientes", roles: ["admin", "cajero"] },
  { icon: "📊", label: "Reportes", path: "/reportes", roles: ["admin"] }, // Solo admin
  { icon: "⚙️", label: "Chatbot", path: "/chatbot", roles: ["admin", "cajero"] },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <aside className="w-20 lg:w-64 bg-[#1e293b] text-white flex flex-col h-screen sticky top-0 z-50 transition-all duration-300">
      {/* LOGO */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center font-bold shadow-lg shadow-blue-500/20">
          F
        </div>
        <span className="hidden lg:block font-bold text-xl tracking-tight">
          FarmaBot
        </span>
      </div>

      {/* NAVEGACIÓN DINÁMICA SEGÚN ROL */}
      <nav className="flex-1 mt-4">
        {menuItems.map((item) => {
          // Si la ruta requiere admin y el usuario es cajero, no la mostramos
          if (item.roles && !item.roles.includes(user?.role)) return null;

          return (
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-4 px-6 py-4 cursor-pointer transition-all duration-200
                ${isActive 
                  ? "bg-blue-600 border-r-4 border-white text-white" 
                  : "hover:bg-gray-800 text-gray-400"}
              `}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="hidden lg:block font-medium">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* FOOTER DEL USUARIO DINÁMICO */}
      <div className="p-4 border-t border-gray-700 bg-[#1a2232]">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-blue-400 border-2 border-gray-600 overflow-hidden flex-shrink-0">
            {/* Avatar dinámico basado en el nombre del usuario */}
            <img 
              src={`https://ui-avatars.com/api/?name=${user?.name}+${user?.lastname1}&background=3b82f6&color=fff`} 
              alt="User Avatar" 
            />
          </div>
          <div className="hidden lg:block overflow-hidden">
            <p className="text-sm font-bold truncate text-gray-100">
              {/* Mostramos Nombre + Apellido1 de tu DB */}
              {user?.name} {user?.lastname1}
            </p>
            <p className="text-[11px] text-blue-400 font-medium uppercase tracking-wider">
              {user?.role}
            </p>
          </div>
        </div>

        {/* BOTÓN DE CERRAR SESIÓN */}
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-2 py-2 text-xs font-semibold text-gray-400 hover:text-red-400 transition-colors group"
        >
          <span className="text-lg group-hover:scale-110 transition-transform">🚪</span>
          <span className="hidden lg:block">Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}