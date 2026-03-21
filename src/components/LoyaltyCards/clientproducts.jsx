import React from 'react';

const ClientProducts = ({ tickets }) => {
  // 1. Protección inicial si tickets es null o undefined
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
        <h3 className="text-xl font-bold text-gray-800">Historial de Compras</h3>
        <span className="text-sm text-gray-500">{tickets.length} tickets encontrados</span>
      </div>

      {tickets.map((ticket) => (
        <div key={ticket.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
          <div className="bg-gray-50 px-5 py-3 flex justify-between items-center border-b border-gray-200">
            <div className="flex flex-col">
              <span className="text-xs font-black text-gray-400 uppercase tracking-tighter">Folio</span>
              <span className="text-sm font-bold text-gray-700">#{ticket.folio || 'N/A'}</span>
            </div>
            <div className="text-center">
              <span className="text-xs font-black text-gray-400 uppercase tracking-tighter">Fecha</span>
              <p className="text-sm font-medium text-gray-600">
                {ticket.created_at ? new Date(ticket.created_at).toLocaleDateString() : 'Sin fecha'}
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs font-black text-gray-400 uppercase tracking-tighter">Total Pago</span>
              {/* SOLUCIÓN AL ERROR: Usamos el operador || 0 antes del toFixed */}
              <p className="text-lg font-black text-blue-700">
                ${(Number(ticket.total) || 0).toFixed(2)}
              </p>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-white text-gray-400 border-b">
                <tr>
                  <th className="px-5 py-3 font-black uppercase text-[10px]">Producto / Promoción</th>
                  <th className="px-5 py-3 font-black uppercase text-[10px] text-center">Cant.</th>
                  <th className="px-5 py-3 font-black uppercase text-[10px] text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {(ticket.ticket_details || []).map((detail) => {
                  const promoInfo = detail.medicaments?.promotion?.[0];
                  // Protección para el precio de venta unitario
                  const price = Number(detail.price_at_sale) || 0;
                  const qty = Number(detail.quantity) || 0;

                  return (
                    <tr key={detail.id} className="hover:bg-blue-50/30 transition">
                      <td className="px-5 py-4">
                        <div className="flex flex-col">
                          <div className="flex items-center">
                            <span className="font-bold text-gray-800">
                              {detail.medicaments?.name || 'Producto desconocido'}
                            </span>
                            {renderPromoBadge(promoInfo)}
                          </div>
                          <span className="text-[11px] text-gray-400 font-mono mt-0.5">
                            {detail.barcode}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded font-bold">
                          {qty}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <span className="font-bold text-gray-900">
                          ${(price * qty).toFixed(2)}
                        </span>
                        <div className="text-[10px] text-gray-400">
                          ${price.toFixed(2)} c/u
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ClientProducts;