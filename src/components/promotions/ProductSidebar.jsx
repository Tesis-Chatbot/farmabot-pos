import { Search, Tag } from "lucide-react";

export const ProductSidebar = ({ 
  products, 
  filteredProducts, 
  setFilteredProducts, 
  selectedProduct, 
  setSelectedProduct 
}) => {

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = products.filter((p) =>
      p.name.toLowerCase().includes(term) || 
      p.barcode.toString().includes(term)
    );
    setFilteredProducts(filtered);
  };

  return (
    <div className="w-96 bg-white border-r border-slate-200 flex flex-col shadow-sm">
      {/* Cabecera de Búsqueda */}
      <div className="p-6 border-b border-slate-100 bg-white sticky top-0 z-10">
        <h1 className="text-xl font-black flex items-center gap-2 mb-4 italic">
          <Tag className="text-blue-600" /> PANEL DE{" "}
          <span className="text-blue-600">OFERTAS</span>
        </h1>
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Nombre o código de barras..."
            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
            onChange={handleSearch}
          />
        </div>
      </div>

      {/* Lista de Productos */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((p) => (
            <button
              key={p.barcode}
              onClick={() => setSelectedProduct(p)}
              className={`w-full text-left p-4 rounded-2xl transition-all border-2 ${
                selectedProduct?.barcode === p.barcode
                  ? "border-blue-600 bg-blue-50 shadow-md"
                  : "border-transparent hover:bg-slate-50"
              }`}
            >
              <p className="font-bold text-slate-800 truncate">{p.name}</p>
              <div className="flex justify-between mt-1 items-center">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-tighter">
                  {p.barcode}
                </span>
                <span className="font-black text-blue-600">${p.price}</span>
              </div>
            </button>
          ))
        ) : (
          <div className="text-center p-8 text-slate-400 text-sm italic">
            No se encontraron productos
          </div>
        )}
      </div>
    </div>
  );
};