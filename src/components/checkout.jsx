export default function Checkout({ total, onCheckout }) {
  const tax = total * 0.16;
  const finalTotal = total + tax;

  return (
    <div className="mt-auto pt-6 border-t border-gray-100">
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-gray-500 text-sm">
          <span>Subtotal</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-500 text-sm">
          <span>IVA (16%)</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-xl font-bold text-gray-900 pt-2">
          <span>Total</span>
          <span>${finalTotal.toFixed(2)}</span>
        </div>
      </div>

      <button
        onClick={onCheckout}
        className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-[0.98]"
      >
        Procesar Transacción
      </button>
    </div>
  );
}