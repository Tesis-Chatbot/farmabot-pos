import React from 'react';

const LoyaltySummary = ({ resumen }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-blue-100 mb-8">
      <h3 className="text-xl font-bold text-blue-800 mb-4 flex items-center gap-2">
        🎁 Beneficios y Regalos
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {resumen.map((item, index) => {
          // Calculamos el porcentaje para la barra de progreso
          // Si ya completó la meta, mostramos 100%, si no, el progreso actual
          const progreso = (item.acumulado_total % item.meta_para_regalo) || 0;
          const porcentaje = (progreso / item.meta_para_regalo) * 100;

          return (
            <div key={index} className="p-4 rounded-lg border border-gray-100 bg-gray-50 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-gray-700 leading-tight">{item.nombre}</h4>
                <span className="bg-blue-100 text-blue-700 text-[10px] uppercase font-black px-2 py-1 rounded">
                  {item.texto_promo}
                </span>
              </div>

              {/* Barra de Progreso */}
              <div className="w-full bg-gray-200 rounded-full h-3 mb-2 overflow-hidden">
                <div 
                  className="bg-green-500 h-full transition-all duration-700 ease-out"
                  style={{ width: `${item.acumulado_total > 0 && progreso === 0 ? 100 : porcentaje}%` }}
                ></div>
              </div>

              <div className="flex justify-between text-xs">
                <p className="text-gray-500">
                  Total comprado: <b>{item.acumulado_total}</b>
                </p>
                <p className={`${item.unidades_faltantes === 0 ? 'text-green-600' : 'text-orange-600'} font-bold`}>
                  {item.unidades_faltantes === 0 
                    ? '¡Regalo disponible!' 
                    : `Faltan ${item.unidades_faltantes} unidades`}
                </p>
              </div>

              {item.regalos_ganados > 0 && (
                <div className="mt-2 pt-2 border-t border-gray-200">
                  <span className="text-sm text-green-700 font-semibold">
                    ⭐ Regalos acumulados: {item.regalos_ganados}
                  </span>
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