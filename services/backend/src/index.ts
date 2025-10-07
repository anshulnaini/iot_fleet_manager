import express from 'express';
import ingestRouter from './routes/ingest';
import alertsRouter from './routes/alerts';

const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ ok: true });
});

app.use('/api/ingest', ingestRouter);
app.use('/api/alerts', alertsRouter);

export default app;
