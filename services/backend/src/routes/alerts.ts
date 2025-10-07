import { Router } from 'express';
import prisma from '../lib/db';

const router = Router();

router.get('/', async (req, res) => {
  const activeOnly = req.query.active === 'true';

  const alerts = await prisma.alert.findMany({
    where: activeOnly ? { rule: { enabled: true } } : {},
    orderBy: { createdAt: 'desc' },
    take: 100,
  });

  res.json(alerts);
});

export default router;
