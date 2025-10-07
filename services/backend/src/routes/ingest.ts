import { Router } from 'express';
import { telemetrySchema } from '../lib/validation';
import prisma from '../lib/db';
import { Prisma } from '@prisma/client';
import evaluateRules from '../lib/rules';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const validatedData = telemetrySchema.parse(req.body);
    const { deviceId, metrics, extras } = validatedData;

    const telemetry = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
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

      const newTelemetry = await tx.telemetry.create({
        data: {
          deviceId,
          ...metrics,
          extras,
        },
      });

      return newTelemetry;
    });

    await evaluateRules(telemetry);

    res.status(202).json({ ok: true });
  } catch (error) {
    res.status(400).json({ error });
  }
});

export default router;
