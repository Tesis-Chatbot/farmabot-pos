import CartItem from "./CartItem";
import { ShoppingCart } from "lucide-react";

export default function Cart({ cart, onRemove, onUpdateQty }) {
  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-300 py-20">
        <ShoppingCart size={48} className="mb-4 opacity-20" />
        <p className="text-sm font-medium italic">No hay productos en la orden</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full space-y-3 animate-in fade-in duration-300">
      {cart.map((item) => (
        <div 
          key={item.id} 
          className="bg-white border border-slate-100 rounded-xl p-1 hover:border-blue-200 transition-colors shadow-sm"
        >
          <CartItem
            item={item}
            onRemove={onRemove}
            onUpdateQty={onUpdateQty}
          />
        </div>
      ))}
    </div>
  );
}