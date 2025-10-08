import express from 'express';
import cors from 'cors';
import ingestRouter from './routes/ingest';
import alertsRouter from './routes/alerts';
import devicesRouter from './routes/devices';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ ok: true });
});

app.use('/api/ingest', ingestRouter);
app.use('/api/alerts', alertsRouter);
app.use('/api/devices', devicesRouter);

export default app;
