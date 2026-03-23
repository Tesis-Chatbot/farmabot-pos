import { useState, useEffect } from "react";
import useCart from "../hooks/useCart";
import ProductSearch from "../components/productSearch";
import ProductList from "../components/productList";
import Cart from "../components/cart";
import Checkout from "../components/checkout";
import Modal from "../components/Modal";
import {
  ShoppingBag,
  Store,
  Loader2,
  CreditCard,
  Search,
  PackageSearch,
  CheckCircle2,
  AlertCircle,
  Coins
} from "lucide-react";

export default function POS() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // --- ESTADOS PARA MODALES Y FLUJO DE PAGO ---
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [loyaltyCard, setLoyaltyCard] = useState("");
  const [cashReceived, setCashReceived] = useState("");
  const [statusModal, setStatusModal] = useState({ 
    show: false, 
    type: 'success', 
    title: '', 
    message: '' 
  });

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

  // Cálculo de cambio en tiempo real
  const changeAmount = cashReceived ? parseFloat(cashReceived) - (total * 1.16) : 0;

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

  // Paso 1: Abrir modal de pago
  const handleOpenPayment = () => {
    if (cart.length === 0) return;
    setShowPaymentModal(true);
  };

  // Paso 2: Procesar venta final
  const handleFinalizeSale = async () => {
    setShowPaymentModal(false);
    try {
      const result = await checkout(loyaltyCard);
      
      // Reset de campos locales
      setLoyaltyCard("");
      setCashReceived("");

      setStatusModal({
        show: true,
        type: 'success',
        title: '¡Venta Exitosa!',
        message: `Folio: ${result.ticket_id || result.folio}. Cambio a entregar: $${changeAmount > 0 ? changeAmount.toFixed(2) : '0.00'}`
      });

      handleSearch(""); // Refrescar stock
    } catch (error) {
      setStatusModal({
        show: true,
        type: 'error',
        title: 'Error al procesar',
        message: error.message
      });
    }
  };

  return (
    <div className="flex h-screen bg-[#f1f5f9] overflow-hidden font-sans">
      
      {/* SECCIÓN IZQUIERDA: CATÁLOGO */}
      <div className="flex-1 flex flex-col min-w-0 border-r border-slate-200">
        <header className="bg-white border-b border-slate-200 p-6 flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2 text-blue-600 mb-1">
              <Store size={18} className="font-bold" />
              <span className="text-xs font-bold uppercase tracking-widest">Sucursal Principal</span>
            </div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight italic">FARMA<span className="text-blue-600">POS</span></h1>
          </div>
          <div className="flex items-center gap-4 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-bold text-slate-600">Sistema en Línea</span>
          </div>
        </header>

        <div className="p-6 bg-white/50 backdrop-blur-md">
          <ProductSearch onSearch={handleSearch} />
        </div>

        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
              <Loader2 className="animate-spin mb-4 text-blue-500" size={48} />
              <p className="font-bold animate-pulse">Sincronizando Inventario...</p>
            </div>
          ) : products.length > 0 ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <ProductList products={products} onAdd={addProduct} />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-300 border-2 border-dashed border-slate-200 rounded-[3rem] bg-white/30">
              <PackageSearch size={64} className="mb-4 opacity-20" />
              <p className="text-xl font-bold">No hay coincidencias</p>
              <p className="text-sm">Intenta con otro nombre o código</p>
            </div>
          )}
        </div>
      </div>

      {/* SECCIÓN DERECHA: PANEL DE CARRITO */}
      <div className="w-[420px] bg-white flex flex-col shadow-2xl z-10 border-l border-slate-200">
        <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
          <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
            <ShoppingBag className="text-blue-600" size={22} />
            Orden Actual
          </h2>
          <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-black shadow-lg shadow-blue-200">
            {cart.length} SKUs
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          <Cart cart={cart} onRemove={removeProduct} onUpdateQty={updateQty} />
        </div>

        <div className="p-6 bg-white border-t border-slate-100">
          <Checkout
            total={total}
            onCheckout={handleOpenPayment}
            disabled={isProcessing || cart.length === 0}
          />
        </div>
      </div>

      {/* --- MODAL DE PAGO Y LEALTAD --- */}
      <Modal 
        isOpen={showPaymentModal} 
        onClose={() => setShowPaymentModal(false)}
        title="Finalizar Venta"
        icon={CreditCard}
      >
        <div className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
            <p className="text-xs text-blue-600 font-bold uppercase mb-1">Total con IVA</p>
            <p className="text-3xl font-black text-blue-700">${(total * 1.16).toFixed(2)}</p>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-600 flex items-center gap-2">
              <Coins size={16} /> Efectivo Recibido
            </label>
            <input 
              type="number"
              placeholder="$0.00"
              className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 outline-none transition-all font-black text-xl text-blue-600"
              value={cashReceived}
              onChange={(e) => setCashReceived(e.target.value)}
            />
            {cashReceived && (
              <div className={`p-3 rounded-xl text-sm font-bold flex justify-between ${changeAmount >= 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                <span>Cambio:</span>
                <span>${changeAmount.toFixed(2)}</span>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-600 flex items-center gap-2">
              <CreditCard size={16} /> Tarjeta de Lealtad (Opcional)
            </label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text"
                placeholder="Escanea o escribe..."
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 outline-none transition-all font-bold"
                value={loyaltyCard}
                onChange={(e) => setLoyaltyCard(e.target.value)}
              />
            </div>
          </div>

          <button 
            onClick={handleFinalizeSale}
            disabled={cashReceived !== "" && changeAmount < 0}
            className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all active:scale-[0.98] disabled:bg-slate-300 disabled:shadow-none"
          >
            CONFIRMAR Y PAGAR
          </button>
        </div>
      </Modal>

      {/* --- MODAL DE STATUS (ÉXITO/ERROR) --- */}
      <Modal 
        isOpen={statusModal.show} 
        onClose={() => setStatusModal({ ...statusModal, show: false })}
        title={statusModal.title}
        icon={statusModal.type === 'success' ? CheckCircle2 : AlertCircle}
      >
        <div className="text-center space-y-6 py-4">
          <div className={`mx-auto w-24 h-24 rounded-full flex items-center justify-center animate-bounce ${statusModal.type === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
            {statusModal.type === 'success' ? <CheckCircle2 size={56} /> : <AlertCircle size={56} />}
          </div>
          <div>
            <p className="text-slate-600 font-bold text-lg px-4">{statusModal.message}</p>
          </div>
          <button 
            onClick={() => setStatusModal({ ...statusModal, show: false })}
            className={`w-full py-4 rounded-2xl font-black text-white transition-all shadow-lg ${statusModal.type === 'success' ? 'bg-green-600 hover:bg-green-700 shadow-green-200' : 'bg-red-600 hover:bg-red-700 shadow-red-200'}`}
          >
            CONTINUAR
          </button>
        </div>
      </Modal>

    </div>
  );
}