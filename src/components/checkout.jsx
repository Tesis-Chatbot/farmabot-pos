import { CreditCard, ArrowRight } from "lucide-react";

export default function Checkout({ total, onCheckout, disabled }) {
  // Nota: Si el 'total' que recibes ya incluye IVA, ajusta la lógica. 
  // Aquí asumimos que el total es Subtotal.
  const tax = total * 0.16;
  const finalTotal = total + tax;

  return (
    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 shadow-inner">
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-slate-500 text-sm font-medium">
          <span>Subtotal base</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-slate-500 text-sm font-medium">
          <span>IVA (16%)</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        
        {/* Separador visual */}
        <div className="h-px bg-slate-200 my-2"></div>
        
        <div className="flex justify-between items-end pt-1">
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-widest font-bold text-slate-400">Total a Pagar</span>
            <span className="text-3xl font-black text-slate-900 tracking-tighter">
              ${finalTotal.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={onCheckout}
        disabled={disabled || total === 0}
        className={`
          w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all
          ${disabled || total === 0 
            ? "bg-slate-300 text-slate-500 cursor-not-allowed" 
            : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200 active:scale-[0.97] group"}
        `}
      >
        <CreditCard size={20} className="group-hover:rotate-12 transition-transform" />
        <span>Cobrar Orden</span>
        <ArrowRight size={18} className="ml-2 opacity-50 group-hover:translate-x-1 transition-transform" />
      </button>
      
    </div>
  );
}