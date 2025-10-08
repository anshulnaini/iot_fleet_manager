import { Router } from 'express';
import prisma from '../lib/db';

const router = Router();

// GET alerts, with optional filter for active rules
router.get('/', async (req, res) => {
  const { rule_enabled } = req.query;
  let whereClause = {};

  if (rule_enabled === 'true') {
    whereClause = {
      rule: { enabled: true },
    };
  }

  try {
    const alerts = await prisma.alert.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      take: 200,
    });
    res.json(alerts);
  } catch (error) {
    console.error('Error fetching alerts:', error);
    res.status(500).json({ error: 'Error fetching alerts' });
  }
});

// GET a single alert by ID
router.get('/:id', async (req, res) => {
  try {
    const alert = await prisma.alert.findUnique({
      where: { id: req.params.id },
    });
    if (!alert) {
      return res.status(404).json({ error: 'Alert not found' });
    }
    res.json(alert);
  } catch (error) {
    console.error(`Error fetching alert ${req.params.id}:`, error);
    res.status(500).json({ error: `Error fetching alert ${req.params.id}` });
  }
});

// DELETE an alert
router.delete('/:id', async (req, res) => {
  try {
    await prisma.alert.delete({
      where: { id: req.params.id },
    });
    res.status(204).send();
  } catch (error) {
    // Handle cases where the alert might not be found (e.g., Prisma's P2025)
    if ((error as any).code === 'P2025') {
      return res.status(404).json({ error: 'Alert not found' });
    }
    console.error(`Error deleting alert ${req.params.id}:`, error);
    res.status(500).json({ error: `Error deleting alert ${req.params.id}` });
  }
});

export default router;