import axios from 'axios';

export function getFormattedDateTime() {
  return new Date().toLocaleString();
}

export async function getPrometheusData(query, prometheusUrl) {
  try {
    const response = await axios.get(prometheusUrl, {
      params: { query: query },
    });
    return response.data.data.result;
  } catch (error) {
    console.error(`[${getFormattedDateTime()}] - Erro ao obter dados do Prometheus:`, error);
    return null;
  }
}