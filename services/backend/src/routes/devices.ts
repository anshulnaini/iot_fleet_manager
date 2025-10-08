import { Router } from 'express';
import prisma from '../lib/db';

const router = Router();

router.get('/', async (req, res) => {
  console.log('GET /api/devices');
  try {
    const devices = await prisma.device.findMany({
      include: {
        telemetry: {
          orderBy: { timestamp: 'desc' },
          take: 1,
        },
      },
    });
    console.log('Found devices:', devices);
    res.json(devices);
  } catch (error) {
    console.error('Error fetching devices:', error);
    res.status(500).json({ error: 'Error fetching devices' });
  }
});

router.get('/:id', async (req, res) => {
  console.log(`GET /api/devices/${req.params.id}`);
  try {
    const device = await prisma.device.findUnique({
      where: { id: req.params.id },
      include: {
        telemetry: {
          orderBy: { timestamp: 'desc' },
          take: 20,
        },
      },
    });
    console.log('Found device:', device);
    res.json(device);
  } catch (error) {
    console.error(`Error fetching device ${req.params.id}:`, error);
    res.status(500).json({ error: `Error fetching device ${req.params.id}` });
  }
});

export default router;
