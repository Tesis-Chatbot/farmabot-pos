import { useState } from "react";
import { useAuthContext } from "../context/AuthContext"; // Importa tu context

export default function useCart() {
  const [cart, setCart] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { user } = useAuthContext();

  const API_URL = import.meta.env.VITE_API_URL;

  const addProduct = (product) => {
    setCart((prev) => {
      const existing = prev.find((p) => p.id === product.id);
      if (existing) {
        return prev.map((p) =>
          p.id === product.id ? { ...p, qty: p.qty + 1 } : p,
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const removeProduct = (id) => {
    setCart((prev) => prev.filter((p) => p.id !== id));
  };

  const updateQty = (id, qty) => {
    if (qty < 1) return;
    setCart((prev) => prev.map((p) => (p.id === id ? { ...p, qty } : p)));
  };

  const clearCart = () => setCart([]);

  const total = cart.reduce((sum, p) => sum + p.price * p.qty, 0);

  /**
   * Checkout dinámico basado en la sesión del cajero
   */
  const checkout = async (cardNumber = null) => {
    if (cart.length === 0) throw new Error("El carrito está vacío");

    setIsProcessing(true);

    try {
      // PRIORIDAD DE SUCURSAL:
      // 1. store_id del objeto user en AuthContext
      // 2. Si no hay usuario (admin o sesión rota), busca en URL
      // 3. Fallback a 1
      const params = new URLSearchParams(window.location.search);
      const currentStoreId = user?.store_id || params.get("store_id") || 1;

      const saleData = {
        card_number: cardNumber || null,
        total: total,
        store_id: parseInt(currentStoreId),
        items: cart.map((item) => ({
          barcode: item.barcode,
          quantity: item.qty,
          price: item.price,
        })),
      };

      console.log(`✅ Venta procesada por: ${user?.full_name || 'Desconocido'}`);
      console.log(`📍 Sucursal detectada de AuthContext: ${currentStoreId}`);

      const response = await fetch(`${API_URL}/ventas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(saleData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Error al procesar la venta");
      }

      const result = await response.json();
      clearCart();
      return result; 

    } catch (error) {
      console.error("Checkout Error:", error);
      throw error;
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
    isProcessing,
  };
}