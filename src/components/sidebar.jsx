import { NavLink } from "react-router-dom";

// Definimos las rutas de tu sistema de farmacia
const menuItems = [
  { icon: "🏪", label: "Caja", path: "/" },
  { icon: "📦", label: "Inventario", path: "/inventario" },
  { icon: "👥", label: "Clientes", path: "/clientes" },
  { icon: "📊", label: "Reportes", path: "/reportes" },
  { icon: "⚙️", label: "Configuración", path: "/config" },
];

export default function Sidebar() {
  return (
    <aside className="w-20 lg:w-64 bg-[#1e293b] text-white flex flex-col h-screen sticky top-0 z-50 transition-all duration-300">
      {/* LOGO / NOMBRE DE LA APP */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center font-bold shadow-lg shadow-blue-500/20">
          F
        </div>
        <span className="hidden lg:block font-bold text-xl tracking-tight text-white">
          FarmaBot
        </span>
      </div>

      {/* NAVEGACIÓN PRINCIPAL */}
      <nav className="flex-1 mt-4">
        {menuItems.map((item) => (
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
        ))}
      </nav>

      {/* FOOTER DEL USUARIO (Basado en tus datos de tesis) */}
      <div className="p-6 border-t border-gray-700 bg-[#1a2232]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-400 border-2 border-gray-600 overflow-hidden flex-shrink-0">
            <img 
              src="https://ui-avatars.com/api/?name=Leonardo+Pantoja&background=3b82f6&color=fff" 
              alt="User Avatar" 
            />
          </div>
          <div className="hidden lg:block overflow-hidden">
            <p className="text-sm font-bold truncate text-gray-100">
              Leonardo Pantoja
            </p>
            <p className="text-[11px] text-blue-400 font-medium uppercase tracking-wider">
              Cajero
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}