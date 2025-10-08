
import { Router } from 'express';
import prisma from '../lib/db';

const router = Router();

// GET all telemetry records
router.get('/', async (req, res) => {
  try {
    const telemetry = await prisma.telemetry.findMany({
      orderBy: { timestamp: 'desc' },
      take: 200, // Limit the number of records returned
    });
    res.json(telemetry);
  } catch (error) {
    console.error('Error fetching telemetry:', error);
    res.status(500).json({ error: 'Error fetching telemetry' });
  }
});

// GET a single telemetry record by ID
router.get('/:id', async (req, res) => {
  try {
    const record = await prisma.telemetry.findUnique({
      where: { id: req.params.id },
    });
    if (!record) {
      return res.status(404).json({ error: 'Telemetry record not found' });
    }
    res.json(record);
  } catch (error) {
    console.error(`Error fetching telemetry record ${req.params.id}:`, error);
    res.status(500).json({ error: `Error fetching telemetry record ${req.params.id}` });
  }
});

// DELETE a telemetry record
router.delete('/:id', async (req, res) => {
  try {
    await prisma.telemetry.delete({
      where: { id: req.params.id },
    });
    res.status(204).send();
  } catch (error) {
    if ((error as any).code === 'P2025') {
      return res.status(404).json({ error: 'Telemetry record not found' });
    }
    console.error(`Error deleting telemetry record ${req.params.id}:`, error);
    res.status(500).json({ error: `Error deleting telemetry record ${req.params.id}` });
  }
});

export default router;
