import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../api/useAuth";
import { ROLES } from "../context/AuthContext";
import { 
  LayoutDashboard, 
  Users, 
  BarChart3, 
  MessageSquareCode, 
  LogOut,
  Store,
  PillBottle 
} from "lucide-react";

const menuItems = [
  { icon: <Store />, label: "Caja", path: "/", roles: [ROLES.ADMIN, ROLES.CAJERO] },
  { icon: <Users size={22} />, label: "Clientes", path: "/clientes", roles: [ROLES.ADMIN, ROLES.CAJERO] },
  { icon: <PillBottle />, label: "Promociones", path: "/promociones", roles: [ROLES.ADMIN] },
  { icon: <BarChart3 size={22} />, label: "Reportes", path: "/reportes", roles: [ROLES.ADMIN] },
  { icon: <MessageSquareCode size={22} />, label: "Chatbot", path: "/chatbot", roles: [ROLES.ADMIN, ROLES.CAJERO] },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <aside className="w-20 lg:w-64 bg-[#1e293b] text-white flex flex-col h-screen sticky top-0 z-50 transition-all duration-300 shadow-2xl">
      {/* LOGO */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center font-black shadow-lg shadow-blue-500/30 text-white transform rotate-3">
          F
        </div>
        <span className="hidden lg:block font-black text-xl tracking-tight text-white">
          Farma<span className="text-blue-400">Bot</span>
        </span>
      </div>

      {/* NAVEGACIÓN DINÁMICA SEGÚN ROL */}
      <nav className="flex-1 mt-6 space-y-1">
        {menuItems.map((item) => {
          if (item.roles && !item.roles.includes(user?.role)) return null;

          return (
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-4 px-6 py-4 cursor-pointer transition-all duration-200 group
                ${isActive 
                  ? "bg-blue-600/10 border-r-4 border-blue-500 text-blue-400" 
                  : "hover:bg-gray-800/50 text-gray-400 hover:text-white"}
              `}
            >
              <div className="transition-transform duration-200 group-hover:scale-110">
                {item.icon}
              </div>
              <span className="hidden lg:block font-bold tracking-wide">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* FOOTER DEL USUARIO */}
      <div className="p-4 border-t border-gray-800 bg-[#1a2232]/50 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-6 p-2">
          <div className="w-10 h-10 rounded-full border-2 border-blue-500/30 p-0.5 overflow-hidden flex-shrink-0 shadow-inner">
            <img 
              className="w-full h-full rounded-full object-cover"
              src={`https://ui-avatars.com/api/?name=${user?.name}+${user?.lastname1}&background=2563eb&color=fff&bold=true`} 
              alt="User" 
            />
          </div>
          <div className="hidden lg:block overflow-hidden">
            <p className="text-xs font-black truncate text-gray-100 uppercase tracking-tighter">
              {user?.name} {user?.lastname1}
            </p>
            <p className="text-[10px] text-blue-500 font-black uppercase tracking-widest mt-0.5">
              {user?.role}
            </p>
          </div>
        </div>

        {/* BOTÓN DE CERRAR SESIÓN */}
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-500 hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-all group"
        >
          <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="hidden lg:block">Salir del Sistema</span>
        </button>
      </div>
    </aside>
  );
}