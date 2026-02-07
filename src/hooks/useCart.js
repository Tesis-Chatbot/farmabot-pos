import { useState } from "react";

export default function useCart() {
  const [cart, setCart] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  const addProduct = (product) => {
    setCart(prev => {
      const existing = prev.find(p => p.id === product.id);
      if (existing) {
        return prev.map(p =>
          p.id === product.id ? { ...p, qty: p.qty + 1 } : p
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const removeProduct = (id) => {
    setCart(prev => prev.filter(p => p.id !== id));
  };

  const updateQty = (id, qty) => {
    if (qty < 1) return;
    setCart(prev =>
      prev.map(p => (p.id === id ? { ...p, qty } : p))
    );
  };

  const clearCart = () => setCart([]);

  const total = cart.reduce((sum, p) => sum + p.price * p.qty, 0);

  /**
   * Lógica de Checkout encapsulada en el Hook
   */
  const checkout = async (cardNumber) => {
    if (cart.length === 0) throw new Error("El carrito está vacío");

    setIsProcessing(true);
    try {
      const saleData = {
        card_number: cardNumber || null,
        total: total,
        store_id: 1, // Sucursal simulada
        items: cart.map(item => ({
          barcode: item.barcode,
          quantity: item.qty, // Mapeo correcto para FastAPI
          price: item.price
        }))
      };

      const response = await fetch(`${API_URL}/ventas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(saleData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Error al procesar la venta");
      }

      const result = await response.json();
      clearCart();
      return result; // Contiene el ticket_id
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    cart,
    addProduct,
    removeProduct,
    updateQty,
    clearCart,
    total,
    checkout,
    isProcessing
  };
}