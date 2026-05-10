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