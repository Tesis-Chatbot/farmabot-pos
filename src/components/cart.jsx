import CartItem from "./CartItem";

export default function Cart({ cart, onRemove, onUpdateQty }) {
  return (
    <div
      className="
        bg-white rounded-xl shadow
        p-4 h-full flex flex-col
      "
    >
      <h2 className="text-xl font-bold mb-4">Carrito</h2>

      <div className="flex-1 overflow-y-auto space-y-2">
        {cart.map((item) => (
          <CartItem
            key={item.id}
            item={item}
            onRemove={onRemove}
            onUpdateQty={onUpdateQty}
          />
        ))}
      </div>
    </div>
  );
}
