import { useState, useEffect } from "react";
import { getMedicaments, upsertPromotion } from "../services/client";
import { ProductSidebar } from "./ProductSidebar";
import { PromoTypeSelector } from "./PromoTypeSelector";
import { DynamicInputs } from "./DynamicInputs";
import { Save, Package } from "lucide-react";

export default function PromotionsManager() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [form, setForm] = useState({
    promotion_type: 1, amount: 0, n_value: 3, m_value: 1, active: true
  });

  useEffect(() => {
    getMedicaments().then(setProducts);
  }, []);

  const handleInputChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const onSave = async () => {
    try {
      await upsertPromotion({ barcode: selectedProduct.barcode, ...form });
      alert("✅ Guardado con éxito");
    } catch (err) {
      alert("❌ Error al guardar");
    }
  };

  return (
    <div className="flex h-screen bg-[#f8fafc]">
      <ProductSidebar 
        products={products} 
        onSelect={setSelectedProduct} 
        selectedId={selectedProduct?.barcode} 
      />

      <main className="flex-1 flex items-center justify-center p-8">
        {selectedProduct ? (
          <div className="w-full max-w-xl bg-white rounded-[3rem] shadow-xl p-10 space-y-8 animate-in fade-in duration-300">
            <header>
              <h2 className="text-3xl font-black text-slate-800">{selectedProduct.name}</h2>
              <p className="text-slate-400">Precio base: ${selectedProduct.price}</p>
            </header>

            <PromoTypeSelector 
              selectedType={form.promotion_type} 
              onSelect={(id) => handleInputChange("promotion_type", id)} 
            />

            <DynamicInputs 
              type={form.promotion_type} 
              values={form} 
              onChange={handleInputChange} 
            />

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
              <span className="font-bold text-slate-600 text-sm">¿Oferta activa?</span>
              <button 
                onClick={() => handleInputChange("active", !form.active)}
                className={`w-14 h-8 rounded-full transition-all relative ${form.active ? "bg-green-500" : "bg-slate-300"}`}
              >
                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${form.active ? "left-7" : "left-1"}`} />
              </button>
            </div>

            <button 
              onClick={onSave}
              className="w-full py-6 bg-blue-600 text-white rounded-3xl font-black text-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-3"
            >
              <Save /> GUARDAR CAMBIOS
            </button>
          </div>
        ) : (
          <div className="text-slate-300 text-center uppercase tracking-widest font-black">
            <Package size={80} className="mx-auto mb-4 opacity-20" />
            Selecciona un producto
          </div>
        )}
      </main>
    </div>
  );
}