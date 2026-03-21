import React from 'react';
import { Gift, ShoppingBag, Star, CheckCircle2, Timer, Award } from 'lucide-react';

const LoyaltySummary = ({ resumen }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-blue-50 mb-8">
      {/* Título con Icono de Lucide */}
      <h3 className="text-xl font-extrabold text-blue-900 mb-6 flex items-center gap-3">
        <div className="bg-blue-50 p-2 rounded-lg flex items-center justify-center">
          <Gift className="text-blue-600" size={24} />
        </div>
        Beneficios y Regalos Acumulados
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {resumen.map((item, index) => {
          const progreso = (item.acumulado_total % item.meta_para_regalo) || 0;
          const porcentaje = (progreso / item.meta_para_regalo) * 100;
          const esRegaloListo = item.unidades_faltantes === 0 || (item.acumulado_total > 0 && progreso === 0);

          return (
            <div key={index} className="relative p-5 rounded-2xl border border-gray-100 bg-white hover:border-blue-200 hover:shadow-md transition-all duration-300 group">
              
              <div className="flex justify-between items-start mb-4">
                <div className="flex flex-col">
                  <h4 className="font-black text-gray-800 text-lg leading-tight group-hover:text-blue-700 transition-colors">
                    {item.nombre}
                  </h4>
                  <span className="text-[10px] text-gray-400 font-mono mt-1 tracking-widest uppercase">
                    Promoción Activa
                  </span>
                </div>
                <span className="bg-blue-600 text-white text-[11px] font-black px-3 py-1 rounded-full shadow-sm">
                  {item.texto_promo}
                </span>
              </div>

              {/* Barra de Progreso */}
              <div className="relative w-full bg-gray-100 rounded-full h-4 mb-4 overflow-hidden border border-gray-50">
                <div 
                  className={`h-full transition-all duration-1000 ease-out relative ${
                    esRegaloListo ? 'bg-gradient-to-r from-green-400 to-green-600' : 'bg-gradient-to-r from-blue-400 to-blue-600'
                  }`}
                  style={{ width: `${esRegaloListo ? 100 : porcentaje}%` }}
                >
                  {/* Animación Shimmer (clase global del CSS) */}
                  <div className="absolute top-0 left-0 w-full h-full opacity-30 animate-shimmer"></div>
                </div>
              </div>

              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2 text-gray-500 font-medium">
                  <ShoppingBag size={16} className="text-gray-400" />
                  <span>Comprados: <b className="text-gray-900">{item.acumulado_total}</b></span>
                </div>
                
                <div className={`flex items-center gap-1.5 font-black ${esRegaloListo ? 'text-green-600' : 'text-orange-500'}`}>
                  {esRegaloListo ? (
                    <CheckCircle2 size={18} />
                  ) : (
                    <Timer size={18} />
                  )}
                  <span>{esRegaloListo ? '¡REGALABLE!' : `Faltan ${item.unidades_faltantes}`}</span>
                </div>
              </div>

              {/* Historial de Premios */}
              {item.regalos_ganados > 0 && (
                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs text-gray-400 uppercase font-bold tracking-tighter">Historial de premios</span>
                  <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-lg">
                    <Award size={14} strokeWidth={3} />
                    <span className="text-sm font-black">{item.regalos_ganados} Canjeados</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LoyaltySummary;