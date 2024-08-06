import express from 'express';
import { collectDefaultMetrics, Registry, Counter } from 'prom-client';

const app = express();
const register = new Registry();

collectDefaultMetrics({ register });

export const prometheusCounter = new Counter({
    name: 'pushermetrics_prometeus_requests_total',
    help: 'Total number of requests to Prometheus by status',
    labelNames: ['status'],
    registers: [register],
});

export const statuspageCounter = new Counter({
    name: 'pushermetrics_statuspage_updates_total',
    help: 'Total number of updates to StatusPage by status',
    labelNames: ['status'],
    registers: [register],
});

app.get('/metrics', async (req, res) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
});

const port = process.env.METRICS_PORT || 9137;
app.listen(port, () => {
    console.log(`Metrics server running on port ${port}`);
});