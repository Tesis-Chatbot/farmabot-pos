import { useState, useEffect } from "react";
import { getMedicaments, upsertPromotion } from "../api/client";
import { Package } from "lucide-react";

// Importación de tus nuevos componentes
import { ProductSidebar } from "../components/promotions/ProductSidebar";
import { PromoTypeSelector } from "../components/promotions/PromoTypeSelector";
import { DynamicInputs } from "../components/promotions/DynamicInputs";
import { Save } from "lucide-react";

export default function PromotionsAdmin() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // Estado del Formulario unificado
  const [promoForm, setPromoForm] = useState({
    promotion_type: 1,
    amount: 0,
    n_value: 3,
    m_value: 1,
    active: true,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await getMedicaments();
      setProducts(data);
      setFilteredProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Función para actualizar campos específicos del form
  const handleInputChange = (field, value) => {
    setPromoForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!selectedProduct) return;
    try {
      await upsertPromotion({
        barcode: selectedProduct.barcode,
        ...promoForm,
      });
      alert(
        `✅ Promoción "${
          promoForm.promotion_type === 2 
            ? promoForm.n_value + "+" + promoForm.m_value 
            : promoForm.amount
        }" guardada correctamente.`
      );
    } catch (err) {
      alert("❌ Error: " + err.message);
    }
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] font-sans text-slate-900">
      
      {/* 1. PANEL IZQUIERDO: Reemplazado por ProductSidebar */}
      <ProductSidebar 
        products={products}
        filteredProducts={filteredProducts}
        setFilteredProducts={setFilteredProducts}
        selectedProduct={selectedProduct}
        setSelectedProduct={setSelectedProduct}
      />

      {/* PANEL DERECHO: CONTENEDOR PRINCIPAL */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        {selectedProduct ? (
          <div className="w-full max-w-xl bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in duration-300">
            
            {/* Cabecera del Producto */}
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
              
              {/* 2. TIPO DE PROMO: Reemplazado por PromoTypeSelector */}
              <PromoTypeSelector 
                selectedType={promoForm.promotion_type}
                onSelect={(id) => handleInputChange("promotion_type", id)}
              />

              {/* 3. VALORES DINÁMICOS: Reemplazado por DynamicInputs */}
              <DynamicInputs 
                type={promoForm.promotion_type}
                values={promoForm}
                onChange={handleInputChange}
              />

              {/* Botón Guardar */}
              <button
                onClick={handleSave}
                className="w-full py-6 bg-blue-600 text-white rounded-[1.5rem] font-black text-xl shadow-2xl shadow-blue-200 hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center justify-center gap-4"
              >
                <Save /> GUARDAR CONFIGURACIÓN
              </button>
            </div>
          </div>
        ) : (
          /* Estado Vacío */
          <div className="text-center text-slate-300 space-y-4">
            <div className="w-32 h-32 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package size={60} strokeWidth={1} />
            </div>
            <h3 className="text-2xl font-black uppercase tracking-[0.2em] text-slate-400">Sin Selección</h3>
            <p className="font-medium max-w-xs mx-auto">Elige un medicamento del panel izquierdo para empezar a crear ofertas.</p>
          </div>
        )}
      </div>
    </div>
  );
}