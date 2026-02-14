const ClientCard = ({ cliente }) => {
  return (
    <div className="bg-white border-l-4 border-blue-500 shadow-md rounded-lg p-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            {cliente.name} {cliente.last_name_p} {cliente.last_name_m}
          </h2>
          <p className="text-gray-500 font-mono italic">#{cliente.card}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-400 font-semibold">ESTADO</p>
          <span className={`text-xs font-bold px-2 py-1 rounded ${cliente.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {cliente.active ? 'ACTIVO' : 'INACTIVO'}
          </span>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-gray-400">Teléfono</p>
          <p className="font-medium">{cliente.phone_number}</p>
        </div>
      </div>
    </div>
  );
};

export default ClientCard;