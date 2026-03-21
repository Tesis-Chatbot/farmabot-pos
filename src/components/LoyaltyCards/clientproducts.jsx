import React from 'react';

const ClientProducts = ({ tickets }) => {
  // 1. Protección inicial robusta
  if (!tickets || !Array.isArray(tickets) || tickets.length === 0) {
    return (
      <div className="text-center p-10 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 text-gray-400">
        Este cliente no tiene compras registradas.
      </div>
    );
  }

  const renderPromoBadge = (promo) => {
    if (!promo) return null;
    const types = {
      1: { label: `-${parseFloat(promo.amount) * 100}%`, color: 'bg-green-100 text-green-700' },
      2: { label: `Acumula ${promo.amount}`, color: 'bg-blue-100 text-blue-700' },
      3: { label: 'Precio Fijo', color: 'bg-purple-100 text-purple-700' },
      4: { label: `-$${promo.amount}`, color: 'bg-orange-100 text-orange-700' },
    };
    const config = types[promo.promotion_type] || { label: 'Oferta', color: 'bg-gray-100 text-gray-600' };
    return (
      <span className={`ml-2 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${config.color}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-800 tracking-tight">Historial de Compras</h3>
        <span className="bg-gray-100 text-gray-500 text-xs px-3 py-1 rounded-full font-medium">
          {tickets.length} transacciones
        </span>
      </div>

      {tickets.map((ticket) => (
        <div key={ticket.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300">
          {/* Cabecera del Ticket */}
          <div className="bg-gray-50/50 px-5 py-4 flex justify-between items-center border-b border-gray-200">
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Folio Digital</span>
              <span className="text-sm font-bold text-gray-700">#{ticket.folio || 'S/F'}</span>
            </div>
            <div className="text-center">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Fecha de Venta</span>
              <p className="text-sm font-semibold text-gray-600">
                {ticket.created_at 
                  ? new Date(ticket.created_at).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' }) 
                  : 'N/A'}
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total del Ticket</span>
              <p className="text-xl font-black text-blue-700">
                ${(Number(ticket.total) || 0).toFixed(2)}
              </p>
            </div>
          </div>
          
          {/* Cuerpo del Ticket (Tabla de Productos) */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-white text-gray-400 border-b border-gray-100">
                <tr>
                  <th className="px-5 py-3 font-bold uppercase text-[10px] tracking-wider">Descripción del Producto</th>
                  <th className="px-5 py-3 font-bold uppercase text-[10px] tracking-wider text-center">Cant.</th>
                  <th className="px-5 py-3 font-bold uppercase text-[10px] tracking-wider text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {(ticket.ticket_details || []).map((detail, idx) => {
                  const promoInfo = detail.medicaments?.promotion?.[0];
                  const price = Number(detail.price_at_sale) || 0;
                  const qty = Number(detail.quantity) || 0;

                  return (
                    <tr key={`${ticket.id}-${idx}`} className="hover:bg-blue-50/20 transition-colors group">
                      <td className="px-5 py-4">
                        <div className="flex flex-col">
                          <div className="flex items-center">
                            <span className="font-bold text-gray-700 group-hover:text-blue-900 transition-colors">
                              {detail.medicaments?.name || 'Cargando producto...'}
                            </span>
                            {renderPromoBadge(promoInfo)}
                          </div>
                          <span className="text-[11px] text-gray-400 font-mono mt-0.5">
                            SKU: {detail.barcode}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className="inline-flex items-center justify-center bg-gray-50 border border-gray-100 text-gray-600 w-8 h-8 rounded-lg font-bold">
                          {qty}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <span className="font-bold text-gray-900 text-base">
                          ${(price * qty).toFixed(2)}
                        </span>
                        <div className="text-[10px] text-gray-400 font-medium">
                          ${price.toFixed(2)} p/u
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {/* Pie de Ticket (Opcional: Método de pago) */}
          {ticket.payment_method && (
            <div className="px-5 py-2 bg-gray-50/30 border-t border-gray-100">
              <span className="text-[9px] font-bold text-gray-400 uppercase">Método de pago: {ticket.payment_method}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ClientProducts;