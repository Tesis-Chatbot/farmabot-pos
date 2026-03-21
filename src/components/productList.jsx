import { Tag, Package, Plus, Info } from "lucide-react";

export default function ProductList({ products, onAdd }) {
  if (products.length === 0) {
    return (
      <p className="text-gray-500 text-center py-10">No se encontraron medicamentos.</p>
    );
  }

  // Función para parsear el valor (0.15 -> 15%)
  const formatPromoValue = (valor) => {
    const num = parseFloat(valor);
    if (!isNaN(num) && num < 1) {
      return `${Math.round(num * 100)}%`;
    }
    return valor; // Si es "3+1" o similar, lo deja igual
  };

  // Función para elegir el icono de Lucide
  const getPromoIcon = (tipo) => {
    const t = tipo.toLowerCase();
    if (t.includes("porcentaje") || t.includes("descuento")) return <Tag size={14} />;
    if (t.includes("3+1") || t.includes("multicompra") || t.includes("+")) return <Package size={14} />;
    return <Info size={14} />;
  };

  return (
    <div className="flex flex-col gap-3">
      {products.map((p) => (
        <div
          key={p.id}
          className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all flex items-center justify-between"
        >
          {/* LADO IZQUIERDO: Información */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-600">
                {p.brand || "Genérico"}
              </span>
            </div>

            <h3 className="font-bold text-gray-800 text-lg leading-tight">
              {p.name}
            </h3>
            
            <div className="flex flex-wrap items-center gap-3 mt-1">
              <p className="text-xs text-blue-600 italic">{p.lab}</p>
              <span className={`text-xs font-semibold ${p.stock > 0 ? "text-green-600" : "text-red-500"}`}>
                Stock: {p.stock}
              </span>
            </div>

            {/* SECCIÓN DE PROMOCIONES (Sin animación y con parseo) */}
            {p.promociones && p.promociones.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {p.promociones.map((promo) => (
                  <div 
                    key={promo.id}
                    className="flex items-center gap-1.5 bg-red-50 border border-red-100 text-red-700 px-2 py-1 rounded-lg text-[11px] font-bold"
                  >
                    <span className="text-red-500">{getPromoIcon(promo.tipo)}</span>
                    <span className="uppercase">{promo.tipo}:</span>
                    <span className="bg-red-600 text-white px-1.5 rounded">
                      {formatPromoValue(promo.valor)}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* BARCODE ABAJO DE TODO */}
            <div className="mt-3 flex items-center gap-1 text-gray-400">
              <span className="text-[10px] font-mono tracking-widest uppercase">EAN-13:</span>
              <span className="text-[10px] font-mono font-bold tracking-tighter">{p.barcode}</span>
            </div>
          </div>

          {/* LADO DERECHO: Precio y Botón */}
          <div className="flex items-center gap-6">
            <div className="text-right">
              <span className="block text-2xl font-black text-gray-900">
                ${Number(p.price).toFixed(2)}
              </span>
              <span className="text-[10px] text-gray-400 block uppercase">Precio Unitario</span>
            </div>

            <button
              onClick={() => onAdd(p)}
              disabled={p.stock <= 0}
              className="bg-[#1e293b] text-white h-12 w-12 rounded-xl hover:bg-blue-600 transition-all active:scale-90 disabled:bg-gray-100 disabled:text-gray-400 flex items-center justify-center shadow-lg"
            >
              <Plus size={24} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}