import express from 'express';
import ingestRouter from './routes/ingest';

const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ ok: true });
});

app.use('/api/ingest', ingestRouter);

export default app;
