import express from 'express';
import cors from 'cors';
import ingestRouter from './routes/ingest';
import alertsRouter from './routes/alerts';
import devicesRouter from './routes/devices';
import rulesRouter from './routes/rules';
import telemetryRouter from './routes/telemetry';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ ok: true });
});

app.use('/api/ingest', ingestRouter);
app.use('/api/alerts', alertsRouter);
app.use('/api/devices', devicesRouter);
app.use('/api/rules', rulesRouter);
app.use('/api/telemetry', telemetryRouter);

export default app;
