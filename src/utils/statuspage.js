import https from 'https';
import { getFormattedDateTime } from './prometheus.js';

export async function updateStatuspage(metricId, metricData, apiKey, pageId) {
  return new Promise((resolve, reject) => {
    const API_BASE = 'https://api.statuspage.io/v1';
    const URL = `${API_BASE}/pages/${pageId}/metrics/${metricId}/data.json`;
    const options = {
      method: 'POST',
      headers: {
        'Authorization': 'OAuth ' + apiKey,
        'Content-Type': 'application/json',
      },
    };

    const request = https.request(URL, options, (res) => {
      if (res.statusCode === 401) {
        const genericError = "Ocorreu um erro. Verifique se o pageId e apiKey estão corretos.";
        console.error(genericError);
        reject(new Error(genericError));
      }
      res.on('data', () => {
        console.log(`[${getFormattedDateTime()}] - Statuspage atualizado com sucesso para ${metricId}. Valor da métrica: ${metricData.data.value}`);
      });
      res.on('end', resolve);
      res.on('error', (error) => {
        console.error(`[${getFormattedDateTime()}] - Error caught: ${error.message}`);
        reject(error);
      });
    });

    request.write(JSON.stringify(metricData));
    request.end();
  });
}