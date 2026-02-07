export default function ProductList({ products, onAdd }) {
  if (products.length === 0) {
    return (
      <p className="text-gray-500 text-center py-10">
        No se encontraron medicamentos.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {products.map((p) => (
        <div
          key={p.id}
          className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col"
        >
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-bold uppercase px-2 py-1 rounded bg-blue-100 text-blue-600">
              {p.brand || "Genérico"}
            </span>
            <span
              className={`text-xs font-mono ${p.stock > 0 ? "text-gray-400" : "text-red-500 font-bold"}`}
            >
              Stock: {p.stock}
            </span>
          </div>

          <h3 className="font-bold text-gray-800 leading-tight h-10 overflow-hidden">
            {p.name}
          </h3>
          <p className="text-xs text-blue-600 italic mb-3">{p.lab}</p>

          <div className="flex justify-between items-center mt-auto">
            <span className="text-lg font-bold text-gray-900">
              ${Number(p.price).toFixed(2)}
            </span>

            <button
              onClick={() => onAdd(p)}
              disabled={p.stock <= 0}
              className="bg-[#1e293b] text-white p-2 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-1"
              title={p.stock <= 0 ? "Sin existencias" : "Agregar al carrito"}
            >
              <span className="text-xs font-medium px-1">Agregar</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
