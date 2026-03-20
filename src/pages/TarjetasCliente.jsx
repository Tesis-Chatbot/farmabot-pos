import React, { useState } from "react";
import { getClientByCard } from "../api/client";
import ClientCard from "../components/LoyaltyCards/clientcard";
import ClientProducts from "../components/LoyaltyCards/clientproducts";
import LoyaltySummary from "../components/LoyaltyCards/LoyaltySummary";

const TarjetasCliente = () => {
  const [cardNumber, setCardNumber] = useState("");
  const [clientData, setClientData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (cardNumber.length < 5) return; // Validación mínima

    setLoading(true);
    setError(null);

    try {
      const data = await getClientByCard(cardNumber);
      setClientData(data);
    } catch (err) {
      setClientData(null);
      setError("No se encontró la tarjeta o hay un problema de conexión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Gestión de Lealtad
      </h1>

      {/* Barra de Búsqueda */}
      <form onSubmit={handleSearch} className="flex gap-4 mb-10">
        <input
          type="number"
          className="flex-1 p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 outline-none transition"
          placeholder="Escanee o ingrese los 14 dígitos de la tarjeta..."
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 disabled:bg-gray-400 transition"
        >
          {loading ? "Buscando..." : "Buscar"}
        </button>
      </form>

      {/* Resultados */}
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-200">
          ⚠️ {error}
        </div>
      )}

      {clientData && (
        <div className="space-y-8 animate-in fade-in duration-500">
          <ClientCard cliente={clientData} />

          {clientData.resumen_lealtad &&
            clientData.resumen_lealtad.length > 0 && (
              <LoyaltySummary resumen={clientData.resumen_lealtad} />
            )}

          <ClientProducts tickets={clientData.tickets} />
        </div>
      )}
    </div>
  );
};

export default TarjetasCliente;
