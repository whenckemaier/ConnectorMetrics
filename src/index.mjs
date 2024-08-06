import dotenv from 'dotenv';
import fs from 'fs';
import yaml from 'js-yaml';
import { getFormattedDateTime, getPrometheusData } from './utils/prometheus.js';
import { updateStatuspage } from './utils/statuspage.js';
import { prometheusCounter, statuspageCounter } from './server.mjs';

dotenv.config();

const prometheusUrl = process.env.PROMETHEUS_URL;
const queriesPath = './src/queries.yaml';

function loadQueries() {
  try {
    const fileContents = fs.readFileSync(queriesPath, 'utf8');
    return yaml.load(fileContents).promql;
  } catch (error) {
    console.error('Erro ao carregar o arquivo queries.yaml', error);
    throw error;
  }
}

async function main() {
  const queries = loadQueries();
  for (const { metric_id, query } of queries) {
    try {
      const result = await getPrometheusData(query, prometheusUrl);
      console.log(`[${getFormattedDateTime()}] - Dados obtidos com sucesso do Prometheus:`, result);
      prometheusCounter.labels('success').inc();

      const metricData = {
        data: {
          timestamp: Math.floor(Date.now() / 1000),
          value: parseFloat(result[0].value[1]),
        },
      };

      await updateStatuspage(metric_id, metricData, process.env.STATUSPAGE_API_KEY, process.env.STATUSPAGE_PAGE_ID);
      console.log(`[${getFormattedDateTime()}] - StatusPage atualizado sucesso:`, metricData.data.value);
      statuspageCounter.labels('success').inc();
    } catch (error) {
      console.error(`${getFormattedDateTime()} - Ocorreu um erro:`, error);
      statuspageCounter.labels('error').inc();
    }
  }
  setTimeout(main, 30000);
}
main();