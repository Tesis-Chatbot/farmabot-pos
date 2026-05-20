import React, { useState, useEffect } from "react";
import { registerCashier, getCashiersList, updateCashier } from "../api/client";
import { 
  UserPlus, Loader2, Mail, Lock, User, Store, Cpu, Hash, 
  Eye, Edit3, X, RefreshCw, Check 
} from "lucide-react";

export default function RegisterCashier() {
  const [viewMode, setViewMode] = useState("register"); // "register" o "list"
  const [cashiers, setCashiers] = useState([]);
  const [editingId, setEditingId] = useState(null); // ID de public.cashiers (puede ser null si el usuario no tenía caja)
  const [editingUserId, setEditingUserId] = useState(null); // ID de public.users

  const [formData, setFormData] = useState({
    email: "", password: "", name: "", lastname1: "", lastname2: "",
    store_id: "", pos_terminal: "", employee_code: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingList, setLoadingList] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const loadCashiers = async () => {
    setLoadingList(true);
    try {
      const data = await getCashiersList();
      setCashiers(data);
    } catch (error) {
      console.error("No se pudo cargar la lista de personal:", error);
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    if (viewMode === "list") {
      loadCashiers();
      cancelEdit();
    }
  }, [viewMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMsg({ type: "", text: "" });

    try {
      if (editingUserId) {
        await updateCashier(editingId, editingUserId, formData);
        setMsg({ type: "success", text: "¡Información y asignación operativa actualizadas con éxito!" });
        cancelEdit();
        loadCashiers();
        setViewMode("list");
      } else {
        await registerCashier(formData);
        setMsg({ type: "success", text: "¡Empleado y credenciales de acceso creados correctamente!" });
        setFormData({
          email: "", password: "", name: "", lastname1: "", lastname2: "",
          store_id: "", pos_terminal: "", employee_code: ""
        });
      }
    } catch (error) {
      setMsg({ type: "error", text: error.message || "Ocurrió un error inesperado." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (userRecord) => {
    const cashierData = userRecord.cashiers && userRecord.cashiers.length > 0 ? userRecord.cashiers[0] : null;
    
    setEditingId(cashierData ? cashierData.id : null);
    setEditingUserId(userRecord.id);
    
    setFormData({
      email: "Oculto por seguridad",
      password: "Oculto",
      name: userRecord.name || "",
      lastname1: userRecord.lastname1 || "",
      lastname2: userRecord.lastname2 || "",
      store_id: cashierData ? cashierData.store_id : "",
      pos_terminal: cashierData ? cashierData.pos_terminal : "",
      employee_code: cashierData ? cashierData.employee_code : ""
    });
    setViewMode("register");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingUserId(null);
    setFormData({
      email: "", password: "", name: "", lastname1: "", lastname2: "",
      store_id: "", pos_terminal: "", employee_code: ""
    });
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-8 flex flex-col items-center justify-start font-sans text-slate-900">
      
      <div className="w-full max-w-3xl mb-6 bg-slate-200/60 p-1.5 rounded-2xl flex gap-2">
        <button 
          onClick={() => setViewMode("register")}
          className={`flex-1 py-3 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
            viewMode === "register" ? "bg-white text-blue-600 shadow-md" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <UserPlus size={16} /> {editingUserId ? "Modificando Información" : "Registrar Cajero"}
        </button>
        <button 
          onClick={() => setViewMode("list")}
          className={`flex-1 py-3 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
            viewMode === "list" ? "bg-white text-blue-600 shadow-md" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <Eye size={16} /> Ver Cajeros Registrados
        </button>
      </div>

      <div className="w-full max-w-3xl bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl relative">
        
        {editingUserId && (
          <button 
            onClick={cancelEdit}
            className="absolute top-8 right-8 p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-all flex items-center gap-1 text-xs font-bold uppercase"
          >
            <X size={14} /> Cancelar Edición
          </button>
        )}

        {msg.text && (
          <div className={`p-4 mb-6 rounded-2xl text-xs font-bold uppercase border ${
            msg.type === "success" ? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-700"
          }`}>
            {msg.text}
          </div>
        )}

        {viewMode === "register" && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <header className="mb-2">
              <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
                {editingUserId ? <Edit3 className="text-orange-500" /> : <UserPlus className="text-blue-600" />}
                {editingUserId ? "MODIFICAR PERFIL DEL" : "REGISTRAR NUEVO"}{" "}
                <span className={editingUserId ? "text-orange-500" : "text-blue-600"}>CAJERO</span>
              </h1>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">
                {editingUserId ? "Actualización de credenciales y ubicación física en sucursal" : "Alta de Personal y Asignación de Hardware"}
              </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className={`space-y-4 ${editingUserId ? "opacity-40 pointer-events-none" : ""}`}>
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b pb-2">Acceso de Seguridad</h3>
                
                <div>
                  <label className="text-xs font-black text-slate-500 uppercase block mb-1">Correo Electrónico</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-3 text-slate-300" size={18} />
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required={!editingUserId} disabled={!!editingUserId} placeholder="ejemplo@farmacia.com" className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none text-sm focus:border-blue-500 focus:bg-white transition-all font-medium text-slate-600"/>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-black text-slate-500 uppercase block mb-1">Contraseña Temporal</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-3 text-slate-300" size={18} />
                    <input type="password" name="password" value={formData.password} onChange={handleChange} required={!editingUserId} disabled={!!editingUserId} placeholder="••••••••" className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none text-sm focus:border-blue-500 focus:bg-white transition-all font-medium text-slate-600"/>
                  </div>
                </div>
                {editingUserId && <p className="text-[10px] text-orange-600 font-bold uppercase tracking-wider">* Las credenciales de autenticación no son editables desde este módulo por seguridad.</p>}
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b pb-2">Datos de Identidad</h3>
                
                <div>
                  <label className="text-xs font-black text-slate-500 uppercase block mb-1">Nombre(s)</label>
                  <div className="relative">
                    <User className="absolute left-4 top-3 text-slate-300" size={18} />
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Nombre completo" className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none text-sm focus:border-blue-500 focus:bg-white transition-all font-medium text-slate-600"/>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-black text-slate-500 uppercase block mb-1">Primer Apellido</label>
                    <input type="text" name="lastname1" value={formData.lastname1} onChange={handleChange} required placeholder="Paterno" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none text-sm focus:border-blue-500 focus:bg-white transition-all font-medium text-slate-600"/>
                  </div>
                  <div>
                    <label className="text-xs font-black text-slate-500 uppercase block mb-1">Segundo Apellido</label>
                    <input type="text" name="lastname2" value={formData.lastname2} onChange={handleChange} placeholder="Materno (Opcional)" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none text-sm focus:border-blue-500 focus:bg-white transition-all font-medium text-slate-600"/>
                  </div>
                </div>
              </div>

            </div>

            <div className="space-y-4 pt-4 border-t border-slate-50">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Asignación Operativa de Sucursal</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <label className="text-xs font-black text-slate-500 uppercase block mb-1">Sucursal (Store ID)</label>
                  <div className="relative">
                    <Store className="absolute left-4 top-3 text-slate-300" size={18} />
                    <input type="number" name="store_id" value={formData.store_id} onChange={handleChange} required min="1" max="14" placeholder="1 al 14" className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none text-sm focus:border-blue-500 focus:bg-white transition-all font-medium text-slate-600"/>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-black text-slate-500 uppercase block mb-1">Terminal POS ID</label>
                  <div className="relative">
                    <Cpu className="absolute left-4 top-3 text-slate-300" size={18} />
                    <input type="number" name="pos_terminal" value={formData.pos_terminal} onChange={handleChange} required placeholder="No. Terminal" className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none text-sm focus:border-blue-500 focus:bg-white transition-all font-medium text-slate-600"/>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-black text-slate-500 uppercase block mb-1">Código de Empleado</label>
                  <div className="relative">
                    <Hash className="absolute left-4 top-3 text-slate-300" size={18} />
                    <input type="text" name="employee_code" value={formData.employee_code} onChange={handleChange} required placeholder="EMP-XXXX" className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none text-sm focus:border-blue-500 focus:bg-white transition-all font-medium text-slate-600"/>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex items-center gap-2 px-8 py-4 text-white rounded-2xl font-black hover:scale-[1.02] active:scale-95 transition-all shadow-xl text-sm uppercase tracking-wide disabled:opacity-50 ${
                  editingUserId ? "bg-orange-500 shadow-orange-200 hover:bg-orange-600" : "bg-blue-600 shadow-blue-200 hover:bg-blue-700"
                }`}
              >
                {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : (editingUserId ? <Check size={18} /> : <UserPlus size={18} />)}
                {isSubmitting ? "Guardando Cambios..." : (editingUserId ? "Confirmar Modificación" : "Dar de Alta Empleado")}
              </button>
            </div>
          </form>
        )}

        {viewMode === "list" && (
          <div className="space-y-6">
            <header className="flex justify-between items-center border-b pb-4">
              <div>
                <h2 className="text-xl font-black tracking-tight">PERSONAL OPERATIVO REGISTRADO</h2>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">Modificación directa de perfiles activos</p>
              </div>
              <button onClick={loadCashiers} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-slate-50 rounded-xl transition-all">
                <RefreshCw size={18} className={loadingList ? "animate-spin" : ""} />
              </button>
            </header>

            {loadingList ? (
              <div className="py-12 flex justify-center items-center gap-2 text-slate-400 font-bold uppercase text-xs tracking-widest">
                <Loader2 size={20} className="animate-spin text-blue-600" /> Consultando Supabase...
              </div>
            ) : cashiers.length === 0 ? (
              <p className="text-center py-8 text-sm font-bold text-slate-400 uppercase">No hay ningún cajero registrado en el sistema aún.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b text-[10px] font-black text-slate-400 uppercase tracking-wider bg-slate-50/50">
                      <th className="py-3 px-4">Código</th>
                      <th className="py-3 px-4">Nombre Completo</th>
                      <th className="py-3 px-4 text-center">Sucursal</th>
                      <th className="py-3 px-4 text-center">Terminal POS</th>
                      <th className="py-3 px-4 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y text-sm font-medium text-slate-600">
                    {cashiers.map((u) => {
                      const cashierData = u.cashiers && u.cashiers.length > 0 ? u.cashiers[0] : null;

                      return (
                        <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-4 px-4 font-bold text-slate-900">
                            {cashierData ? cashierData.employee_code : <span className="text-red-400 italic text-xs">SIN ASIGNAR</span>}
                          </td>
                          <td className="py-4 px-4 uppercase text-xs font-black">
                            {u.name} {u.lastname1} {u.lastname2 || ""}
                          </td>
                          <td className="py-4 px-4 text-center font-bold">
                            {cashierData ? (
                              <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-xl">ID: {cashierData.store_id}</span>
                            ) : (
                              <span className="text-slate-400">-</span>
                            )}
                          </td>
                          <td className="py-4 px-4 text-center font-bold text-slate-500">
                            {cashierData ? `#${cashierData.pos_terminal}` : <span className="text-slate-400">-</span>}
                          </td>
                          <td className="py-4 px-4 text-right">
                            <button
                              onClick={() => handleEditClick(u)}
                              className="inline-flex items-center gap-1 px-3 py-2 bg-slate-100 text-slate-700 font-bold text-xs uppercase rounded-xl hover:bg-orange-50 hover:text-orange-600 transition-all shadow-sm"
                            >
                              <Edit3 size={14} /> Modificar
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}