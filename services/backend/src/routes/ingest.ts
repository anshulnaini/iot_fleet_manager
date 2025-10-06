import { Router } from 'express';
import { telemetrySchema } from '../lib/validation';
import prisma from '../lib/db';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const validatedData = telemetrySchema.parse(req.body);
    const { deviceId, metrics, extras } = validatedData;

    await prisma.$transaction(async (tx) => {
      await tx.device.upsert({
        where: { id: deviceId },
        update: { lastSeenAt: new Date() },
        create: {
          id: deviceId,
          name: deviceId,
          type: 'default',
          tags: [],
        },
      });

      await tx.telemetry.create({
        data: {
          deviceId,
          ...metrics,
          extras,
        },
      });
    });

    res.status(202).json({ ok: true });
  } catch (error) {
    res.status(400).json({ error });
  }
});

export default router;
