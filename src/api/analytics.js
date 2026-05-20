const API_BASE_URL = "http://localhost:8000/analytics";

export const getAnalyticsSummary = async () => {
  const response = await fetch(`${API_BASE_URL}/summary`);
  if (!response.ok) throw new Error("Error en summary");
  return await response.json();
};

export const getHourlyUsage = async () => {
  const response = await fetch(`${API_BASE_URL}/hourly-usage`);
  if (!response.ok) throw new Error("Error en hourly usage");
  return await response.json();
};

export const getRecentLogs = async () => {
    const response = await fetch(`${API_BASE_URL}/logs`);
    return await response.json();
};

export const downloadWeeklyReport = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/report/semanal`, {
      method: "GET",
      headers: {
        "Content-Type": "application/pdf",
      },
    });

    if (!response.ok) throw new Error("Error al generar el reporte");

    // Convertimos la respuesta a un objeto Blob (binario)
    const blob = await response.blob();
    
    // Creamos una URL temporal para el archivo
    const url = window.URL.createObjectURL(blob);
    
    // Creamos un link invisible para forzar la descarga
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Reporte_Semanal_FarmaBot_${new Date().toLocaleDateString()}.pdf`);
    
    document.body.appendChild(link);
    link.click();
    
    // Limpieza
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    return { success: true };
  } catch (error) {
    console.error("Error en descarga de PDF:", error);
    throw error;
  }
};