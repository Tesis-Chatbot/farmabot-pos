import { useState, useEffect } from "react";
import useCart from "../hooks/useCart";
import ProductSearch from "../components/productSearch";
import ProductList from "../components/productList";
import {
  ShoppingBag,
  Store,
  Loader2,
  CreditCard,
  Search,
  PackageSearch, // Icono corregido
} from "lucide-react";

import Cart from "../components/cart";
import Checkout from "../components/checkout";

export default function POS() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const {
    cart,
    addProduct,
    removeProduct,
    updateQty,
    total,
    checkout,
    isProcessing,
  } = useCart();

  const API_URL = import.meta.env.VITE_API_URL;

  // Función para obtener productos y filtrar
  const handleSearch = async (query = "") => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/medicamentos`);
      if (!res.ok) throw new Error("Error en API");
      const data = await res.json();
      const filtered = data.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.barcode.includes(query),
      );
      setProducts(filtered);
    } catch (error) {
      console.error("Error cargando productos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch("");
  }, []);

  const handleFinalizeSale = async () => {
    const cardNumber = prompt(
      "Ingrese número de tarjeta de lealtad (opcional):",
    );
    try {
      const result = await checkout(cardNumber);
      alert(`✅ Venta Exitosa\nFolio: ${result.ticket_id || result.folio}`);
      handleSearch(""); // Refrescar stock tras venta
    } catch (error) {
      alert(`❌ Error: ${error.message}`);
    }
  };

  return (
    <div className="flex h-screen bg-[#f1f5f9] overflow-hidden">
      {/* SECCIÓN IZQUIERDA: CATÁLOGO */}
      <div className="flex-1 flex flex-col min-w-0 border-r border-slate-200">
        {/* Header Superior */}
        <header className="bg-white border-b border-slate-200 p-6 flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2 text-blue-600 mb-1">
              <Store size={20} className="font-bold" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Sucursal Central
              </span>
            </div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">
              Terminal de Ventas
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:block text-right mr-4">
              <p className="text-xs text-slate-400 font-medium">
                Estado del Sistema
              </p>
              <p className="text-sm text-green-500 font-bold flex items-center justify-end gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                En Línea
              </p>
            </div>
          </div>
        </header>

        {/* Buscador y Filtros */}
        <div className="p-6 bg-white shadow-sm">
          <ProductSearch onSearch={handleSearch} />
        </div>

        {/* Lista de Productos o Estados de Carga */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-200">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
              <Loader2 className="animate-spin mb-4 text-blue-500" size={48} />
              <p className="font-medium animate-pulse">
                Sincronizando inventario...
              </p>
            </div>
          ) : products.length > 0 ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <ProductList products={products} onAdd={addProduct} />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 border-2 border-dashed border-slate-200 rounded-3xl">
              <div className="bg-slate-100 p-4 rounded-full mb-4 text-slate-300">
                <PackageSearch size={48} />
              </div>
              <p className="text-lg font-bold text-slate-500">
                No se encontraron medicamentos
              </p>
              <p className="text-sm">
                Intenta buscar por nombre o código de barras
              </p>
            </div>
          )}
        </div>
      </div>

      {/* SECCIÓN DERECHA: PANEL DE COBRO (Sidebar) */}
      <div className="w-[420px] bg-white flex flex-col shadow-2xl z-10">
        {/* Resumen del Carrito Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
            <ShoppingBag className="text-blue-600" size={22} />
            Orden Actual
          </h2>
          <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md shadow-blue-200">
            {cart.reduce((acc, item) => acc + item.quantity, 0)} productos
          </span>
        </div>

        {/* Lista de Items en Carrito - Componente externo */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          <Cart cart={cart} onRemove={removeProduct} onUpdateQty={updateQty} />
        </div>

        {/* Footer de Pago - Componente externo Checkout */}
        <div className="p-4 border-t border-slate-100 bg-white">
          <Checkout
            total={total}
            onCheckout={handleFinalizeSale}
            disabled={isProcessing || cart.length === 0}
          />

          <p className="text-[10px] text-center text-slate-400 mt-4 uppercase tracking-widest font-bold">
            Transacción Protegida • FarmaBot v2.0
          </p>
        </div>
      </div>
    </div>
  );
}
