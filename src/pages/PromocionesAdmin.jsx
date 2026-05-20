import { useState, useEffect } from "react";
import { getMedicaments, upsertPromotion } from "../api/client";
import { useAuthContext } from "../context/AuthContext";
import Modal from "../components/Modal";
import { 
  Package, 
  Save, 
  Loader2, 
  CheckCircle2, 
  AlertCircle 
} from "lucide-react";

import { ProductSidebar } from "../components/promotions/ProductSidebar";
import { PromoTypeSelector } from "../components/promotions/PromoTypeSelector";
import { DynamicInputs } from "../components/promotions/DynamicInputs";

export default function PromotionsAdmin() {
  const { user, loading: authLoading } = useAuthContext();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [promoForm, setPromoForm] = useState({
    promotion_type: 1,
    amount: 0,
    n_value: 3,
    m_value: 1,
    active: true,
  });

  const [statusModal, setStatusModal] = useState({
    show: false,
    type: "success",
    title: "",
    message: "",
  });

  useEffect(() => {
    if (!authLoading && user?.store_id) {
      loadData(user.store_id);
    }
  }, [user, authLoading]);

  const loadData = async (storeId) => {
    setLoading(true);
    try {
      const data = await getMedicaments(storeId);
      setProducts(data);
      setFilteredProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setPromoForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!selectedProduct || !user?.store_id) return;
    
    setIsSaving(true);
    try {
      await upsertPromotion({
        barcode: selectedProduct.barcode,
        store_id: user.store_id,
        ...promoForm,
      });

      const promoLabel = promoForm.promotion_type === 2 
        ? `${promoForm.n_value}+${promoForm.m_value}` 
        : promoForm.amount;

      setStatusModal({
        show: true,
        type: "success",
        title: "¡Configuración Guardada!",
        message: `La promoción (${promoLabel}) para ${selectedProduct.name} se ha aplicado correctamente.`,
      });
    } catch (err) {
      setStatusModal({
        show: true,
        type: "error",
        title: "Error al guardar",
        message: err.message || "No se pudo actualizar la promoción.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-blue-600" size={48} />
        <p className="ml-4 text-slate-600 font-bold uppercase tracking-widest">Sincronizando Sucursal...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#f8fafc] font-sans text-slate-900">
      <ProductSidebar 
        products={products}
        filteredProducts={filteredProducts}
        setFilteredProducts={setFilteredProducts}
        selectedProduct={selectedProduct}
        setSelectedProduct={setSelectedProduct}
      />

      <div className="flex-1 flex flex-col items-center justify-center p-8">
        {selectedProduct ? (
          <div className="w-full max-w-xl bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-10 bg-gradient-to-br from-white to-slate-50 border-b border-slate-100">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-widest">
                Configurando Producto
              </span>
              <h2 className="text-3xl font-black text-slate-800 mt-3">
                {selectedProduct.name}
              </h2>
              <p className="text-slate-400 font-medium">
                Precio de lista: <span className="text-slate-800 font-bold">${selectedProduct.price}</span>
              </p>
            </div>

            <div className="p-10 space-y-8">
              <PromoTypeSelector 
                selectedType={promoForm.promotion_type}
                onSelect={(id) => handleInputChange("promotion_type", id)}
              />

              <DynamicInputs 
                type={promoForm.promotion_type}
                values={promoForm}
                onChange={handleInputChange}
              />

              <button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full py-6 bg-blue-600 text-white rounded-[1.5rem] font-black text-xl shadow-2xl shadow-blue-200 hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center justify-center gap-4 disabled:bg-slate-300 disabled:shadow-none"
              >
                {isSaving ? <Loader2 className="animate-spin" /> : <Save />} 
                {isSaving ? "GUARDANDO..." : "GUARDAR CONFIGURACIÓN"}
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center text-slate-300 space-y-4">
            <div className="w-32 h-32 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package size={60} strokeWidth={1} />
            </div>
            <h3 className="text-2xl font-black uppercase tracking-[0.2em] text-slate-400">Sin Selección</h3>
            <p className="font-medium max-w-xs mx-auto">Elige un medicamento del panel izquierdo para empezar a crear ofertas.</p>
          </div>
        )}
      </div>

      {/* --- MODAL DE STATUS (Igual al POS) --- */}
      <Modal
        isOpen={statusModal.show}
        onClose={() => setStatusModal({ ...statusModal, show: false })}
        title={statusModal.title}
        icon={statusModal.type === "success" ? CheckCircle2 : AlertCircle}
      >
        <div className="text-center space-y-6 py-4">
          <div
            className={`mx-auto w-24 h-24 rounded-full flex items-center justify-center animate-bounce ${
              statusModal.type === "success" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
            }`}
          >
            {statusModal.type === "success" ? (
              <CheckCircle2 size={56} />
            ) : (
              <AlertCircle size={56} />
            )}
          </div>
          <p className="text-slate-600 font-bold text-lg px-4">
            {statusModal.message}
          </p>
          <button
            onClick={() => setStatusModal({ ...statusModal, show: false })}
            className={`w-full py-4 rounded-2xl font-black text-white transition-all shadow-lg ${
              statusModal.type === "success" 
                ? "bg-green-600 hover:bg-green-700 shadow-green-200" 
                : "bg-red-600 hover:bg-red-700 shadow-red-200"
            }`}
          >
            CONTINUAR
          </button>
        </div>
      </Modal>
    </div>
  );
}