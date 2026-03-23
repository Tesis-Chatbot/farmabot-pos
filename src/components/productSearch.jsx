import { useState } from "react";

export default function ProductSearch({ onSearch }) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
      <input
        type="text"
        placeholder="Buscar por nombre, código o laboratorio..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-1 p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
      >
        Buscar
      </button>
    </form>
  );
}
