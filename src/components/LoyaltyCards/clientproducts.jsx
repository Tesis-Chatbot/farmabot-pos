const ClientProducts = ({ tickets }) => {
  if (!tickets || tickets.length === 0) {
    return <div className="text-center p-10 text-gray-400">Este cliente no tiene compras registradas.</div>;
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-gray-700">Historial de Compras</h3>
      {tickets.map((ticket) => (
        <div key={ticket.id} className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
          <div className="bg-gray-50 px-4 py-2 flex justify-between items-center border-b">
            <span className="text-sm font-semibold text-gray-600">
              Folio: {ticket.folio || 'N/A'} - {new Date(ticket.created_at).toLocaleDateString()}
            </span>
            <span className="text-blue-700 font-bold">${ticket.total.toFixed(2)} MXN</span>
          </div>
          
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="px-4 py-2">Barcode</th>
                <th className="px-4 py-2">Cant.</th>
                <th className="px-4 py-2 text-right">Precio Unit.</th>
              </tr>
            </thead>
            <tbody>
              {ticket.ticket_details.map((detail) => (
                <tr key={detail.id} className="border-t hover:bg-gray-50 transition">
                  <td className="px-4 py-3 font-mono">{detail.barcode}</td>
                  <td className="px-4 py-3 text-center">{detail.quantity}</td>
                  <td className="px-4 py-3 text-right font-semibold">${detail.price_at_sale}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default ClientProducts;