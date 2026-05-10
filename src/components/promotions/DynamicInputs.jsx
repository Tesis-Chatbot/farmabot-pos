export const DynamicInputs = ({ type, values, onChange }) => {
  if (type === 2) {
    return (
      <div className="flex items-center justify-around bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
        <div className="text-center">
          <label className="text-[10px] font-black text-slate-400 uppercase block mb-2">Compra (N)</label>
          <input 
            type="number" 
            value={values.n_value}
            onChange={(e) => onChange("n_value", e.target.value)}
            className="w-20 p-3 bg-white border border-slate-200 rounded-xl text-center text-2xl font-black focus:border-blue-500 outline-none" 
          />
        </div>
        <span className="text-4xl font-black text-slate-200 mt-6">+</span>
        <div className="text-center">
          <label className="text-[10px] font-black text-slate-400 uppercase block mb-2">Gratis (M)</label>
          <input 
            type="number" 
            value={values.m_value}
            onChange={(e) => onChange("m_value", e.target.value)}
            className="w-20 p-3 bg-white border border-slate-200 rounded-xl text-center text-2xl font-black focus:border-blue-500 outline-none text-green-600" 
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
      <label className="text-xs font-bold text-slate-500 mb-2 block uppercase tracking-wider">
        {type === 1 ? "Porcentaje de descuento (%)" : "Valor de la promoción ($)"}
      </label>
      <div className="relative">
        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-2xl font-black text-slate-300">
          {type === 1 ? "%" : "$"}
        </span>
        <input 
          type="number"
          value={values.amount}
          onChange={(e) => onChange("amount", e.target.value)}
          className="w-full pl-12 pr-6 py-5 bg-white border border-slate-200 rounded-2xl text-3xl font-black outline-none focus:border-blue-500"
        />
      </div>
    </div>
  );
};