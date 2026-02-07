// services/products.service.js (Simulado)
export const searchProducts = async (query) => {
  // En un entorno real, esto vendría de tu base de datos (PHP/Python)
  const allProducts = [
    { 
        id: 1, 
        name: "Tempra 500mg", 
        activeSubstance: "Paracetamol", 
        price: 85.00, 
        stock: 24, 
        requiresPrescription: false 
    },
    { 
        id: 2, 
        name: "Amoxicilina 500mg", 
        activeSubstance: "Amoxicilina", 
        price: 120.50, 
        stock: 12, 
        requiresPrescription: true 
    },
    { 
        id: 3, 
        name: "VapoRub 50g", 
        activeSubstance: "Alcanfor/Mentol", 
        price: 65.00, 
        stock: 50, 
        requiresPrescription: false 
    },
  ];

  const filtered = allProducts.filter(p => 
    p.name.toLowerCase().includes(query.toLowerCase()) || 
    p.activeSubstance.toLowerCase().includes(query.toLowerCase())
  );

  return { data: filtered };
};