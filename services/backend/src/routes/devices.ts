import { Router } from 'express';
import prisma from '../lib/db';

const router = Router();

router.get('/', async (req, res) => {
  const devices = await prisma.device.findMany({
    include: {
      telemetry: {
        orderBy: { timestamp: 'desc' },
        take: 1,
      },
    },
  });
  res.json(devices);
});

router.get('/:id', async (req, res) => {
  const device = await prisma.device.findUnique({
    where: { id: req.params.id },
    include: {
      telemetry: {
        orderBy: { timestamp: 'desc' },
        take: 20,
      },
    },
  });
  res.json(device);
});

export default router;
