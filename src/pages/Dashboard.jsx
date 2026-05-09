import React, { useState, useEffect } from "react";
import {
  BarChart3, MessageSquare, Users, Clock, MapPin,
  FileDown, Table as TableIcon, TrendingUp, ChevronRight,
} from "lucide-react";
import { getAnalyticsSummary, getHourlyUsage } from "../api/analytics";

export default function ReportsDashboard() {
  const [summary, setSummary] = useState(null);
  const [hourlyData, setHourlyData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [summaryRes, hourlyRes] = await Promise.all([
          getAnalyticsSummary(),
          getHourlyUsage(),
        ]);
        setSummary(summaryRes);
        setHourlyData(hourlyRes);
      } catch (error) {
        console.error("Error al cargar datos reales:", error);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-black text-slate-400 uppercase tracking-widest">Sincronizando con FarmaBot...</p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      label: "Consultas Totales",
      value: summary?.total_interactions?.toLocaleString() || "0",
      icon: MessageSquare,
      color: "bg-blue-500",
    },
    {
      label: "Usuarios Únicos",
      value: summary?.unique_users?.toLocaleString() || "0",
      icon: Users,
      color: "bg-purple-500",
    },
    {
      label: "Tiempo Promedio (Vinculación)",
      value: `${summary?.avg_ticket_binding_time || 0}s`,
      icon: Clock,
      color: "bg-emerald-500",
    },
    {
      label: "Estado del Sistema",
      value: "Activo",
      icon: TrendingUp,
      color: "bg-orange-500",
    },
  ];

  // Máximo para calcular escala de barras
  const maxUsage = Math.max(...hourlyData.map((d) => d.cantidad), 1);

  return (
    <div className="min-h-screen bg-[#f8fafc] p-8 font-sans text-slate-900">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-black italic tracking-tight">
            REPORTES <span className="text-blue-600">CHATBOT</span>
          </h1>
          <p className="text-slate-500 font-medium">Análisis en tiempo real de interacciones con Supabase.</p>
        </div>

        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
            <TableIcon size={18} /> Excel
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 transition-all shadow-xl shadow-blue-200">
            <FileDown size={18} /> Generar PDF
          </button>
        </div>
      </header>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((s, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5">
            <div className={`${s.color} p-4 rounded-2xl text-white shadow-lg`}>
              <s.icon size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{s.label}</p>
              <h3 className="text-2xl font-black">{s.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* GRÁFICO DE BARRAS DINÁMICO */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
          <h3 className="text-xl font-black flex items-center gap-2 mb-8">
            <BarChart3 className="text-blue-600" /> Actividad por Hora (Mensajes)
          </h3>
          <div className="h-64 flex items-end justify-between gap-2 px-4 border-b border-slate-100">
            {hourlyData.map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                <div className="w-full bg-blue-500/5 rounded-t-xl relative flex items-end justify-center h-full">
                  <div
                    className="w-full bg-blue-600 rounded-t-xl transition-all duration-1000 ease-out group-hover:bg-blue-400"
                    style={{ height: `${(h.cantidad / maxUsage) * 100}%` }}
                  >
                    <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-all">
                      {h.cantidad}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-black text-slate-400 mt-2">{h.hora}</span>
              </div>
            ))}
          </div>
        </div>

        {/* SUCURSALES (DATOS SEMI-ESTÁTICOS O FILTRADOS) */}
        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
          <h3 className="text-xl font-black mb-8 flex items-center gap-2">
            <MapPin className="text-blue-600" /> Rendimiento Sucursales
          </h3>
          <div className="space-y-6">
            {["Sucursal Centro", "Sucursal Norte", "Sucursal Sur"].map((name, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm font-bold mb-2">
                  <span>{name}</span>
                  <span className="text-blue-600">{[45, 30, 25][i]}%</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500" style={{ width: `${[45, 30, 25][i]}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}