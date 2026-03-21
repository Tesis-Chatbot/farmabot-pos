import React, { useState, useEffect } from "react";
import { getClientByCard } from "../api/client";
import ClientCard from "../components/LoyaltyCards/clientcard";
import ClientProducts from "../components/LoyaltyCards/clientproducts";
import LoyaltySummary from "../components/LoyaltyCards/LoyaltySummary";
import { Search, Loader2, AlertCircle, CreditCard } from "lucide-react";

const TarjetasCliente = () => {
  const [cardNumber, setCardNumber] = useState("");
  const [clientData, setClientData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();

    // Reset de seguridad
    setClientData(null);
    setError(null);

    const cleanNumber = cardNumber.trim();
    if (cleanNumber.length < 5) {
      setError("Por favor, ingrese un número de tarjeta válido.");
      return;
    }

    setLoading(true);

    try {
      // Llamada a la API
      const data = await getClientByCard(cleanNumber);

      if (!data) {
        throw new Error("La API no devolvió datos para esta tarjeta.");
      }

      setClientData(data);
    } catch (err) {
      console.error("Error en búsqueda:", err);
      // Intentamos capturar el detalle de FastAPI si existe
      const errorMessage =
        err.response?.data?.detail || err.message || "Error desconocido";
      setError(errorMessage);
    } finally {
      // Garantizamos que el spinner se detenga pase lo que pase
      setLoading(false);
    }
  };

  // Limpiar el estado al entrar/salir de la pestaña
  useEffect(() => {
    setLoading(false);
    setError(null);
    setClientData(null);
    setCardNumber("");

    return () => {
      // Cleanup al desmontar
      setLoading(false);
    };
  }, []);

  return (
    <div className="container mx-auto p-6 max-w-5xl animate-in fade-in duration-500">
      <header className="mb-10">
        <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
          <CreditCard className="text-blue-600" size={32} />
          Gestión de Lealtad
        </h1>
        <p className="text-slate-500 mt-1">
          Consulta puntos, beneficios e historial del cliente.
        </p>
      </header>

      {/* Barra de Búsqueda */}
      <form onSubmit={handleSearch} className="relative flex gap-3 mb-10 group">
        <div className="relative flex-1">
          <Search
            className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${
              loading
                ? "text-blue-500 animate-pulse"
                : "text-slate-400 group-focus-within:text-blue-500"
            }`}
            size={20}
          />
          <input
            type="number"
            className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-lg font-medium"
            placeholder="Ingrese los dígitos de la tarjeta..."
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            disabled={loading}
          />
        </div>
        <button
          type="submit"
          disabled={loading || !cardNumber}
          className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2 min-w-[160px] justify-center"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              <span>Buscando...</span>
            </>
          ) : (
            "Buscar Cliente"
          )}
        </button>
      </form>

      {/* Errores */}
      {error && !loading && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-5 rounded-xl mb-8 flex items-start gap-4 animate-in slide-in-from-top-4">
          <AlertCircle className="flex-shrink-0 mt-0.5" size={20} />
          <div>
            <p className="font-bold">Hubo un problema</p>
            <p className="text-sm opacity-90">{error}</p>
          </div>
        </div>
      )}

      {/* Resultados */}
      {!loading && clientData && (
        <div className="space-y-8 animate-in zoom-in-95 duration-300">
          <ClientCard cliente={clientData} />

          {clientData.resumen_lealtad?.length > 0 && (
            <LoyaltySummary resumen={clientData.resumen_lealtad} />
          )}

          <ClientProducts tickets={clientData.tickets} />
        </div>
      )}

      {/* Pantalla Vacía */}
      {!loading && !clientData && !error && (
        <div className="text-center py-20 border-2 border-dashed border-slate-200 rounded-3xl">
          <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
            <Search size={32} />
          </div>
          <p className="text-slate-500 font-medium italic">
            Esperando lectura de tarjeta...
          </p>
        </div>
      )}
    </div>
  );
};

export default TarjetasCliente;
