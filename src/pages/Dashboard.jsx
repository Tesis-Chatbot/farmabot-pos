import React, { useState, useEffect } from "react";
import { 
  getAnalyticsSummary, 
  getHourlyUsage, 
  downloadWeeklyReport 
} from "../api/analytics";
import { 
  BarChart3, 
  MessageSquare, 
  Users, 
  Clock, 
  MapPin, 
  FileDown, 
  Table as TableIcon, 
  TrendingUp, 
  Loader2 
} from "lucide-react";

export default function ReportsDashboard() {
  const [summary, setSummary] = useState(null);
  const [hourlyData, setHourlyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

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

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await downloadWeeklyReport();
    } catch (error) {
      alert("Error al generar el reporte semanal.");
    } finally {
      setIsDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-black text-slate-400 uppercase tracking-widest text-xs">Sincronizando con FarmaBot...</p>
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
      label: "Promedio Vinculación",
      value: `${summary?.avg_ticket_binding_time || 0} ms`,
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

  const branchData = [
    { name: "Sucursal Centro", usage: 40 },
    { name: "Sucursal Norte", usage: 25 },
    { name: "Sucursal Sur", usage: 20 },
    { name: "Sucursal Río", usage: 15 },
  ];

  const maxUsage = Math.max(...hourlyData.map((d) => d.cantidad), 1);

  return (
    <div className="min-h-screen bg-[#f8fafc] p-8 font-sans text-slate-900">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-black italic tracking-tight">
            REPORTES <span className="text-blue-600">CHATBOT</span>
          </h1>
          <p className="text-slate-500 font-medium">Análisis de rendimiento y sucursales.</p>
        </div>

        <div className="flex gap-3">
          {/* <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm text-sm">
            <TableIcon size={18} /> Excel
          </button> */}
          
          <button 
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 disabled:bg-blue-400 disabled:cursor-not-allowed text-sm"
          >
            {isDownloading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <FileDown size={18} />
            )}
            {isDownloading ? "Generando..." : "Generar PDF Semanal"}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((s, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5">
            <div className={`${s.color} p-4 rounded-2xl text-white shadow-lg`}>
              <s.icon size={24} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{s.label}</p>
              <h3 className="text-2xl font-black">{s.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
          <h3 className="text-xl font-black flex items-center gap-2 mb-8">
            <BarChart3 className="text-blue-600" /> Actividad por Hora
          </h3>
          <div className="h-64 flex items-end justify-between gap-1 px-2">
            {hourlyData.map((h, i) => {
              const barHeight = (h.cantidad / maxUsage) * 100;
              return (
                <div key={i} className="flex-1 flex flex-col items-center h-full group">
                  <div className="w-full flex items-end justify-center flex-1 relative bg-slate-50/50 rounded-t-lg">
                    <div
                      className="w-full bg-blue-600 rounded-t-lg transition-all duration-1000 ease-out group-hover:bg-blue-400 min-h-[2px]"
                      style={{ height: `${barHeight}%` }}
                    >
                      <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-all z-10 whitespace-nowrap">
                        {h.cantidad}
                      </span>
                    </div>
                  </div>
                  <span className="text-[9px] font-bold text-slate-400 mt-2">
                    {h.hora.split(':')[0]}h
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
          <h3 className="text-xl font-black mb-8 flex items-center gap-2">
            <MapPin className="text-blue-600" /> Rendimiento Sucursales
          </h3>
          <div className="space-y-6">
            {branchData.map((branch, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm font-bold mb-2">
                  <span>{branch.name}</span>
                  <span className="text-blue-600">{branch.usage}%</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 transition-all duration-1000" 
                    style={{ width: `${branch.usage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 p-4 bg-blue-50 rounded-2xl border border-blue-100 text-center">
            <p className="text-xs text-blue-700 font-bold leading-relaxed">
              * Datos calculados en base a las últimas 168 horas de operación.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}