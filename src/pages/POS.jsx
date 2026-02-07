import { useState, useEffect } from "react";
import useCart from "../hooks/useCart";
import ProductSearch from "../components/productSearch";
import ProductList from "../components/productList";
import Cart from "../components/cart";
import Checkout from "../components/checkout";

export default function POS() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Extraemos todo lo necesario del hook
  const { 
    cart, addProduct, removeProduct, updateQty, 
    total, checkout, isProcessing 
  } = useCart();

  const API_URL = import.meta.env.VITE_API_URL;

  // Función para buscar y refrescar stock
  const handleSearch = async (query = "") => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/medicamentos`);
      if (!res.ok) throw new Error("Error en API");
      const data = await res.json();
      const filtered = data.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.barcode.includes(query)
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
    const cardNumber = prompt("Ingrese número de tarjeta (opcional):");
    try {
      const result = await checkout(cardNumber);
      alert(`¡Venta Exitosa! Folio: ${result.ticket_id}`);
      handleSearch(""); // Refrescamos el stock visualmente
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 h-full bg-[#f8fafc]">
      {/* SECCIÓN IZQUIERDA: PRODUCTOS */}
      <div className="lg:col-span-2 p-6 border-r border-gray-200 overflow-y-auto">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Caja de Farmacia</h1>
          <p className="text-sm text-gray-500">Módulo de ventas y dispensación</p>
        </header>

        <ProductSearch onSearch={handleSearch} />

        <div className="mt-6">
          {loading ? (
            <div className="text-center py-20 text-gray-400">Consultando base de datos...</div>
          ) : (
            <ProductList products={products} onAdd={addProduct} />
          )}
        </div>
      </div>

      {/* SECCIÓN DERECHA: CARRITO */}
      <div className="bg-white p-6 flex flex-col h-screen sticky top-0 shadow-xl">
        <div className="flex-1 overflow-y-auto">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span>🛒</span> Carrito de Venta
          </h2>
          <Cart cart={cart} onRemove={removeProduct} onUpdateQty={updateQty} />
        </div>
        
        <div className="mt-auto pt-4 border-t border-gray-100">
          <div className="flex justify-between mb-4 font-semibold text-lg">
            <span className="text-gray-600">Total:</span>
            <span className="text-blue-600">${total.toFixed(2)}</span>
          </div>
          <Checkout 
            total={total} 
            onCheckout={handleFinalizeSale} 
            disabled={isProcessing} // Evita doble clic mientras procesa
          />
        </div>
      </div>
    </div>
  );
}