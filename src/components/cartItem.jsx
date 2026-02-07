// CartItem.jsx
export default function CartItem({ item, onRemove, onUpdateQty }) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-50">
      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-xs text-gray-400">
        💊
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold text-gray-800 leading-none">{item.name}</p>
        <p className="text-xs text-gray-500 mt-1">${item.price.toFixed(2)} unit.</p>
      </div>
      <div className="flex items-center bg-gray-100 rounded-lg p-1">
        <button onClick={() => onUpdateQty(item.id, item.qty - 1)} className="px-2 text-lg">-</button>
        <span className="px-2 text-sm font-bold w-8 text-center">{item.qty}</span>
        <button onClick={() => onUpdateQty(item.id, item.qty + 1)} className="px-2 text-lg">+</button>
      </div>
      <button onClick={() => onRemove(item.id)} className="text-gray-300 hover:text-red-500 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
}