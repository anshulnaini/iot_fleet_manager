
import { Router } from 'express';
import prisma from '../lib/db';

const router = Router();

// GET all rules
router.get('/', async (req, res) => {
  try {
    const rules = await prisma.rule.findMany();
    res.json(rules);
  } catch (error) {
    console.error('Error fetching rules:', error);
    res.status(500).json({ error: 'Error fetching rules' });
  }
});

// GET a single rule by ID
router.get('/:id', async (req, res) => {
  try {
    const rule = await prisma.rule.findUnique({
      where: { id: req.params.id },
    });
    if (!rule) {
      return res.status(404).json({ error: 'Rule not found' });
    }
    res.json(rule);
  } catch (error) {
    console.error(`Error fetching rule ${req.params.id}:`, error);
    res.status(500).json({ error: `Error fetching rule ${req.params.id}` });
  }
});

// POST a new rule
router.post('/', async (req, res) => {
  try {
    const rule = await prisma.rule.create({
      data: req.body,
    });
    res.status(201).json(rule);
  } catch (error) {
    console.error('Error creating rule:', error);
    res.status(500).json({ error: 'Error creating rule' });
  }
});

// PUT to update a rule
router.put('/:id', async (req, res) => {
  try {
    const rule = await prisma.rule.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(rule);
  } catch (error) {
    console.error(`Error updating rule ${req.params.id}:`, error);
    res.status(500).json({ error: `Error updating rule ${req.params.id}` });
  }
});

// DELETE a rule
router.delete('/:id', async (req, res) => {
  try {
    await prisma.rule.delete({
      where: { id: req.params.id },
    });
    res.status(204).send();
  } catch (error) {
    console.error(`Error deleting rule ${req.params.id}:`, error);
    res.status(500).json({ error: `Error deleting rule ${req.params.id}` });
  }
});

export default router;
