import { Percent, Gift, DollarSign, RefreshCcw } from "lucide-react";

const TYPES = [
  { id: 1, label: "Porcentaje", icon: Percent },
  { id: 2, label: "Promo N + M", icon: Gift },
  { id: 3, label: "Precio Fijo", icon: DollarSign },
  { id: 4, label: "Monto Descuento", icon: DollarSign }
];

export const PromoTypeSelector = ({ selectedType, onSelect }) => (
  <div className="grid grid-cols-2 gap-3">
    {TYPES.map((type) => (
      <button
        key={type.id}
        onClick={() => onSelect(type.id)}
        className={`p-4 rounded-2xl border-2 flex items-center gap-3 font-bold transition-all ${
          selectedType === type.id 
          ? "border-blue-600 bg-blue-50 text-blue-700 shadow-sm" 
          : "border-slate-100 text-slate-400 hover:border-slate-200"
        }`}
      >
        <type.icon size={20} />
        <span className="text-xs">{type.label}</span>
      </button>
    ))}
  </div>
);